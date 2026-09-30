<template>
    <a-upload v-model:file-list="fileList" action="/admin-api/upload/public" :headers="{ authorization: getToken() }"
        :accept="accept" list-type="text" :max-count="maxCount" :before-upload="beforeUpload" @change="handleChange"
        @remove="handleRemove" :data="{ path: savePath }">
        <a-button v-if="
            (fileList.length < maxCount && mode === 'array') ||
            (fileList.length === 0 && mode === 'single')
        ">
            <UploadOutlined />
            选择文件
        </a-button>
    </a-upload>
</template>

<script setup>
import { nextTick, ref, watch } from 'vue'
import { message } from 'ant-design-vue'
import { UploadOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    /**
     * object:
     * {
     *     id: 1,
     *     url: '/uploads/test.pdf'
     * }
     *
     * array:
     * [
     *     {
     *         id: 1,
     *         url: '/uploads/test.pdf'
     *     }
     * ]
     */

    // single: 单文件
    // array: 多文件
    mode: {
        type: String,
        default: 'array',
        validator: value => ['single', 'array'].includes(value)
    },

    savePath: {
        type: String,
        default: undefined
    },

    /**
     * 文件类型
     *
     * 例如：
     * .pdf,.doc,.docx
     * image/*
     * video/*
     */
    accept: {
        type: String,
        default: undefined
    },

    // 单个文件最大大小，单位 MB
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

const fileList = ref([])

/**
 * =========================
 * modelValue 校验
 * =========================
 */

function isValidFileValue(value) {
    if (!value || typeof value !== 'object') {
        return false
    }

    return (
        Object.prototype.hasOwnProperty.call(value, 'id') &&
        Object.prototype.hasOwnProperty.call(value, 'url') &&
        value.id !== null &&
        value.id !== undefined &&
        value.url
    )
}

function validateModelValue(value) {
    if (props.mode === 'single') {
        if (
            value === undefined ||
            value === null ||
            value === ''
        ) {
            return true
        }

        if (!isValidFileValue(value)) {
            console.warn(
                '文件数据格式错误，需要 { id, url } 格式',
                value
            )

            return false
        }

        return true
    }

    if (
        value === undefined ||
        value === null ||
        value === ''
    ) {
        return true
    }

    if (!Array.isArray(value)) {
        console.warn(
            '文件数据格式错误，多文件模式需要传入数组',
            value
        )

        return false
    }

    const invalid = value.some(
        item => !isValidFileValue(item)
    )

    if (invalid) {
        message.warning(
            '文件数据格式错误，数组中的每一项都需要 { id, url } 格式'
        )

        return false
    }

    return true
}

/**
 * =========================
 * modelValue -> fileList
 * =========================
 */

function syncFileList() {
    if (!validateModelValue(modelValue.value)) {
        fileList.value = []
        return
    }

    if (props.mode === 'single') {
        if (!modelValue.value) {
            fileList.value = []
            return
        }

        fileList.value = [
            createFileItem(modelValue.value, 0)
        ]

        return
    }

    fileList.value = (modelValue.value || []).map(
        (item, index) => createFileItem(item, index)
    )
}

function createFileItem(item, index) {
    return {
        uid: `uploaded-${item.id}-${index}`,
        name: getFileName(item.url),
        status: 'done',
        url: item.url,
        response: {
            data: {
                id: item.id,
                url: item.url
            }
        }
    }
}

function getFileName(url) {
    if (!url) {
        return '未知文件'
    }

    try {
        const pathname = new URL(url, window.location.origin).pathname

        return decodeURIComponent(
            pathname.split('/').pop() || '未知文件'
        )
    } catch {
        return decodeURIComponent(
            url.split('/').pop() || '未知文件'
        )
    }
}

/**
 * 初始化 + 外部修改同步
 */
watch(() => modelValue.value, syncFileList, {
    immediate: true,
    deep: true
})

/**
 * =========================
 * fileList -> modelValue
 * =========================
 */

function updateModelValue() {
    const values = fileList.value
        .filter(file => file.status === 'done')
        .map(file => {
            const data =
                file.response?.data ||
                file.response

            return {
                id: data?.id ?? file.id,
                url: data?.url ?? file.url
            }
        })
        .filter(
            item =>
                item.id !== undefined &&
                item.id !== null &&
                item.url
        )

    if (props.mode === 'single') {
        modelValue.value =
            values.length > 0
                ? values[0]
                : null
    } else {
        modelValue.value = values
    }
}

/**
 * =========================
 * 上传前校验
 * =========================
 */

function beforeUpload(file) {
    /**
     * 文件大小
     */
    const maxSize = props.size * 1024 * 1024
    let warnMsg = null
    if (file.size > maxSize) {
        warnMsg = `文件大小不能超过 ${props.size}MB`
    }

    /**
     * 单文件模式
     */
    if (props.mode === 'single' && fileList.value.length >= 1) {
        warnMsg = '只能上传一个文件'
    }

    /**
     * 最大数量
     */
    if (fileList.value.length >= props.maxCount) {
        warnMsg = `最多只能上传 ${props.maxCount} 个文件`
    }

    if (warnMsg) {
        updateModelValue()
        message.warning(warnMsg)
        return false
    }

    return true
}

/**
 * =========================
 * 上传状态变化
 * =========================
 */

function handleChange({ file, fileList: list }) {
    fileList.value = list
    if (file.status === 'done') {
        const response = file.response
        const data = response?.data || response

        /**
         * 后端推荐返回：
         *
         * {
         *     data: {
         *         id: 123,
         *         url: "/uploads/test.pdf"
         *     }
         * }
         */

        if (
            !data ||
            data.id === undefined ||
            !data.url
        ) {
            message.warning(
                '上传成功，但服务器返回的文件信息格式错误，需要 { id, url }'
            )

            file.status = 'error'

            return
        }

        file.url = data.url
        file.id = data.id
        file.name = getFileName(data.url)

        updateModelValue()
    }

    if (file.status === 'error') {
        message.warning(
            `文件「${file.name}」上传失败`
        )
    }
}

/**
 * =========================
 * 删除
 * =========================
 */

function handleRemove() {
    setTimeout(() => {
        updateModelValue()
    })

    return true
}
</script>
