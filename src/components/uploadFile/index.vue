<template>
    <div class="upload-file">
        <!-- 文件选择 -->
        <label v-if="canUpload" class="upload-trigger" :class="{ disabled: uploading }">
            <input ref="inputRef" type="file" :accept="accept" :multiple="mode === 'multiple'" :disabled="uploading"
                @change="handleSelect" />
            <span>＋</span>
            选择文件
        </label>

        <!-- 文件列表 -->
        <div v-if="fileList.length" class="file-list">
            <div v-for="file in fileList" :key="file.uid" class="file-item">
                <div class="file-info">
                    <span class="file-name" :title="file.name">
                        {{ file.name }}
                    </span>

                    <span class="file-status" :class="file.status">
                        {{ getStatusText(file) }}
                    </span>
                </div>

                <!-- 上传进度 -->
                <div v-if="file.status === 'uploading'" class="progress">
                    <div class="progress-inner" :style="{ width: file.percent + '%' }" />
                </div>

                <button v-if="file.status !== 'uploading'" type="button" class="remove-btn" @click="handleRemove(file)">
                    ×
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { message } from 'ant-design-vue'
import request from '@/request'

const props = defineProps({
    // single: 单文件
    // multiple: 多文件
    mode: {
        type: String,
        default: 'multiple',
        validator: value => ['single', 'multiple'].includes(value)
    },

    savePath: {
        type: String,
        default: undefined
    },

    // 文件类型，例如 .apk,.pdf,image/*
    accept: {
        type: String,
        default: undefined
    },

    // 单文件最大大小，单位 MB
    size: {
        type: Number,
        default: 50
    },

    maxCount: {
        type: Number,
        default: 8
    }
})

const modelValue = defineModel({
    type: [Array, Object],
    default: undefined
})

const inputRef = ref(null)
const fileList = ref([])

const uploading = computed(() =>
    fileList.value.some(file => file.status === 'uploading')
)

const canUpload = computed(() => {
    if (props.mode === 'single') {
        return fileList.value.length === 0
    }

    return fileList.value.length < props.maxCount
})

/**
 * 文件名称
 */
function getFileName(url) {
    if (!url) return '未知文件'

    try {
        const pathname = new URL(
            url,
            window.location.origin
        ).pathname

        return decodeURIComponent(
            pathname.split('/').pop() || '未知文件'
        )
    } catch {
        const name = url.split('/').pop() || '未知文件'

        try {
            return decodeURIComponent(name)
        } catch {
            return name
        }
    }
}

/**
 * 状态文本
 */
function getStatusText(file) {
    const statusMap = {
        uploading: `上传中 ${file.percent || 0}%`,
        done: '上传成功',
        error: '上传失败'
    }

    return statusMap[file.status] || ''
}

/**
 * 创建回显文件
 */
function createFileItem(item, index) {
    return {
        uid: `uploaded-${item.id}-${index}`,
        id: item.id,
        name: getFileName(item.url),
        url: item.url,
        status: 'done',
        percent: 100
    }
}

/**
 * 校验外部数据
 */
function isValidFile(item) {
    return (
        item &&
        typeof item === 'object' &&
        item.id !== undefined &&
        item.id !== null &&
        !!item.url
    )
}

/**
 * modelValue -> fileList
 *
 * 内部修改 modelValue 时跳过一次同步，
 * 避免多文件上传时覆盖其他正在上传的项目。
 */
let skipNextSync = false

watch(
    () => [modelValue.value, props.mode],
    () => {
        if (skipNextSync) {
            skipNextSync = false
            return
        }

        const value = modelValue.value

        if (props.mode === 'single') {
            if (!value) {
                fileList.value = []
                return
            }

            if (!isValidFile(value)) {
                console.warn('单文件数据格式错误，需要 { id, url }', value)
                fileList.value = []
                return
            }

            fileList.value = [createFileItem(value, 0)]
            return
        }

        if (value == null) {
            fileList.value = []
            return
        }

        if (!Array.isArray(value)) {
            console.warn('多文件模式需要传入数组', value)
            fileList.value = []
            return
        }

        const invalid = value.some(item => !isValidFile(item))

        if (invalid) {
            console.warn('文件数组中存在无效数据', value)
            fileList.value = []
            return
        }

        fileList.value = value.map(createFileItem)
    },
    {
        immediate: true,
        deep: true
    }
)

/**
 * fileList -> modelValue
 *
 * 只同步上传成功的文件
 */
function updateModelValue() {
    const values = fileList.value
        .filter(file => file.status === 'done')
        .map(file => ({
            id: file.id,
            url: file.url
        }))
        .filter(item => item.id != null && item.url)

    skipNextSync = true

    if (props.mode === 'single') {
        modelValue.value = values[0] || null
    } else {
        modelValue.value = values
    }
}

/**
 * 上传文件
 */
async function uploadFile(file, item) {
    const formData = new FormData()

    formData.append('file', file)
    if (props.savePath !== undefined) {
        formData.append('path', props.savePath)
    }

    try {
        // 如果 request 的 baseURL 已包含 /admin-api，
        // 这里直接使用 /upload/public 即可。
        const data = await request.post('/upload/public', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress(event) {
                if (event.total) {
                    item.percent = Math.round(
                        event.loaded / event.total * 100
                    )
                }
            }
        })

        if (!data || data.id === undefined || data.id === null || !data.url) {
            throw new Error('服务器返回的文件信息格式错误')
        }

        item.id = data.id
        item.url = data.url
        item.name = getFileName(data.url)
        item.status = 'done'
        item.percent = 100

        updateModelValue()

        message.success(`${item.name} 上传成功`)
    } catch (error) {
        item.status = 'error'
        message.error(
            error.response?.data?.message ||
            error.message ||
            '文件上传失败'
        )
    }
}

/**
 * 选择文件
 */
async function handleSelect(event) {
    const input = event.target
    const files = Array.from(input.files || [])

    // 允许重复选择同一个文件
    input.value = ''

    if (!files.length) return

    const currentCount = fileList.value.length
    const maxCount = props.mode === 'single'
        ? 1
        : props.maxCount

    const availableCount = maxCount - currentCount

    if (availableCount <= 0) {
        message.warning(`最多只能上传 ${maxCount} 个文件`)
        return
    }

    if (files.length > availableCount) {
        message.warning(`最多还能选择 ${availableCount} 个文件`)
    }

    const selectedFiles = files.slice(0, availableCount)

    // 先校验，避免批量选择时部分上传部分失败
    const validFiles = []

    for (const file of selectedFiles) {
        if (file.size > props.size * 1024 * 1024) {
            message.warning(
                `文件「${file.name}」大小不能超过 ${props.size}MB`
            )
            continue
        }

        validFiles.push(file)
    }

    if (!validFiles.length) return

    // 先加入列表，再执行上传
    const tasks = validFiles.map((file, index) => {
        const item = {
            uid: `upload-${Date.now()}-${index}`,
            name: file.name,
            status: 'uploading',
            percent: 0,
            id: undefined,
            url: undefined
        }

        fileList.value.push(item)

        console.log(file);


        return uploadFile(file, item)
    })

    await Promise.all(tasks)
}

/**
 * 删除文件
 */
function handleRemove(file) {
    if (file.status === 'uploading') {
        return
    }

    fileList.value = fileList.value.filter(
        item => item.uid !== file.uid
    )

    updateModelValue()
}
</script>

<style scoped>
.upload-file {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
}

.upload-trigger {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    color: rgba(0, 0, 0, 0.88);
    cursor: pointer;
    font-size: 14px;
    transition: all 0.2s;
}

.upload-trigger:hover {
    color: #1677ff;
    border-color: #1677ff;
}

.upload-trigger input {
    display: none;
}

.upload-trigger span {
    font-size: 18px;
}

.upload-trigger.disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.file-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 0;
}

.file-item {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 5px;
    width: 100%;
    min-width: 0;
    padding: 8px 32px 8px 10px;
    border: 1px solid #f0f0f0;
    border-radius: 6px;
    box-sizing: border-box;
}

.file-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-width: 0;
}

.file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-width: 0;
}

.file-status {
    flex-shrink: 0;
    font-size: 12px;
    color: #999;
}

.file-status.done {
    color: #52c41a;
}

.file-status.error {
    color: #ff4d4f;
}

.file-status.uploading {
    color: #1677ff;
}

.progress {
    height: 4px;
    width: 100%;
    overflow: hidden;
    background: #f0f0f0;
    border-radius: 4px;
}

.progress-inner {
    height: 100%;
    background: #1677ff;
    transition: width 0.2s;
}

.remove-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    color: #999;
    cursor: pointer;
    font-size: 20px;
    line-height: 1;
}

.remove-btn:hover {
    color: #ff4d4f;
}
</style>
