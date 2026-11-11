<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose
        :mask-closable="false">
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item name="cover" label="歌曲封面">
                            <uploadImage mode="single" v-model="formData.cover" savePath="cover"></uploadImage>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="title" label="歌曲名称">
                            <a-input v-model:value.trim="formData.title" placeholder="请输入歌曲名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="singerList" label="演出者">
                            <a-select v-model:value="formData.singerList" show-search placeholder="请选择歌手"
                                style="width: 100%" :default-active-first-option="false" :show-arrow="false"
                                mode="multiple" :filter-option="false" :not-found-content="null"
                                :options="singerOptions" @search="handleSearch" @focus="handleSearch()"></a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="mvUrl" label="歌曲mv">
                            <uploadFile v-model="formData.mvUrl" mode="single" savePath="video"
                                accept="video/mp4,video/ogg,video/webm" :size="150"></uploadFile>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="songTypes" label="音乐类型">
                            <DictSelect dictCode="MUSIC_CATEGORY" v-model="formData.songTypes" mode="multiple" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="publishDate" label="发布时间">
                            <a-date-picker v-model:value="formData.publishDate" style="width:100%"
                                value-format="YYYY-MM-DD" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="enabled" label="是否启用">
                            <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item label="上传音乐" :label-col="{ span: 24 }">
                            <div class="flex items-center justify-between mb-3">
                                <span class="text-gray-500">
                                    可添加不同品质的音频文件
                                </span>

                                <a-button type="primary" @click="addAudio">
                                    <template #icon>
                                        <PlusOutlined />
                                    </template>
                                    新增音频
                                </a-button>
                            </div>
                            <div class="max-h-[600px] overflow-y-auto rounded-lg transition-all" :class="{
                                'border-2 border-dashed border-blue-500 bg-blue-50/50': isDragging,
                                'border-2 border-transparent': !isDragging
                            }" @dragenter.prevent="handleDragEnter" @dragover.prevent
                                @dragleave.prevent="handleDragLeave" @drop.prevent="handleDrop">
                                <!-- 拖拽提示 -->
                                <div v-if="isDragging"
                                    class="flex flex-col items-center justify-center py-10 text-blue-500">
                                    <InboxOutlined class="text-4xl mb-3" />
                                    <div class="font-medium">释放文件，开始上传</div>
                                    <div class="text-xs mt-2">支持 MP3 / WAV / FLAC / OGG</div>
                                </div>

                                <div v-else class="flex flex-col gap-3 p-1">

                                    <!-- 原本的音频列表 -->
                                    <div v-for="(audio, index) in audioList" :key="audio.id ?? index"
                                        class="border rounded-lg p-3">
                                        <div class="flex items-center gap-3">
                                            <div
                                                class="w-10 h-10 flex items-center justify-center rounded bg-blue-50 text-blue-500">
                                                <SoundOutlined />
                                            </div>

                                            <div class="flex-1 min-w-0">
                                                <div class="truncate">
                                                    {{ audio.filename || '未选择音频' }}
                                                </div>

                                                <div class="text-gray-400 text-xs mt-1">
                                                    {{ audio.format || '--' }}
                                                    <span v-if="audio.bitrate"> · {{ audio.bitrate }}kbps</span>
                                                    <span v-if="audio.size"> · {{ formatFileSize(audio.size) }}</span>
                                                </div>
                                            </div>

                                            <DictSelect dictCode="AUDIO_QUALITY" v-model="audio.quality"
                                                placeholder="音频品质" style="width: 120px" />

                                            <a-button @click="selectAudio(audio)" :loading="audio.loading">
                                                <UploadOutlined />
                                                选择音乐
                                            </a-button>

                                            <a-button danger type="text" @click="removeAudio(index)">
                                                <DeleteOutlined />
                                            </a-button>
                                        </div>

                                        <!-- 上传状态
                                        <a-progress v-if="audio.loading" :percent="audio.progress || 0" size="small"
                                            status="active" :show-info="false" />
                                         -->
                                    </div>
                                    <a-empty v-if="audioList.length === 0" description="暂无音频文件"
                                        :image="Empty.PRESENTED_IMAGE_SIMPLE" />

                                    <!-- 拖拽入口 -->
                                    <div
                                        class="border border-dashed rounded-lg py-6 flex flex-col items-center text-gray-400 cursor-pointer hover:border-blue-400 hover:text-blue-500 transition-colors">
                                        <InboxOutlined class="text-2xl mb-2" />
                                        <span>拖拽音频文件到这里，或点击「新增音频」</span>
                                        <span class="text-xs mt-1">支持 MP3 / WAV / FLAC / OGG，单个文件 1MB ~ 100MB</span>
                                    </div>

                                </div>
                            </div>
                        </a-form-item>
                    </a-col>
                </a-row>

            </a-form>
        </a-spin>
        <template #footer>
            <template v-if="!readonly">
                <a-button @click="show = false">取消</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
            </template>
        </template>
    </a-modal>
</template>

<script setup>
import uploadImage from "@/components/uploadImage/index.vue"
import uploadFile from "@/components/uploadFile/index.vue"
import DictSelect from "@/components/dictSelect/index.vue"
import { PlusOutlined, DeleteOutlined, SoundOutlined, UploadOutlined, InboxOutlined } from '@ant-design/icons-vue'
import { getSongInfo, saveSong, uploadAudio } from "@/request/music/song.js"
import { searchArtist } from "@/request/music/artist.js"
import { message, Empty } from 'ant-design-vue';
import { reactive } from "vue"
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const formData = ref({})
const audioList = reactive([])
const singerOptions = reactive([])
const formRef = ref(null)
const rulesRef = reactive({
    name: { required: true, message: '请输入歌手名称', },
})

const title = computed(() => (props.id && props.readonly) ? '歌曲详情' : props.id ? '编辑歌曲' : '新增歌曲')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveSong({ id: props.id, ...formData.value, audioList }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchInfo() {
    detailLoading.value = true;
    getSongInfo(props.id)
        .then(res => initForm(res))
        .finally(() => detailLoading.value = false)
}

const handleSearch = debounce(fetchSearchArtist, 500)

function fetchSearchArtist(kwd) {
    searchArtist(kwd).then(artist => {
        singerOptions.splice(0, singerOptions.length, ...artist.map(item => ({ label: item.name, value: item.id })))
    }).catch(err => {
        console.log(err);
    })
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        fetchSearchArtist()
        if (props.id) fetchInfo()
    }
});

function removeAudio(index) {
    audioList.splice(index, 1)
}

function addAudio() {
    audioList.unshift({
        url: null,
        duration: null,
        filename: null,
        fileId: null,
        format: null,
        quality: "2",
        bitrate: null,
        sampleRate: null,
        bitDepth: null,
        loading: false
    })
}

const ACCEPT = ["audio/mp3", "audio/wav", "audio/flac", "audio/ogg"]
const exts = ["mp3", "flac", "wav", "ogg"]

function selectAudio(row) {
    const fileInput = document.createElement('input')

    fileInput.type = 'file'
    fileInput.accept = ACCEPT.join(',')

    fileInput.onchange = async (e) => {
        const file = e.target.files?.[0]

        if (file) {
            await uploadAudioFile(row, file)
        }

        fileInput.remove()
    }

    fileInput.click()
}


// 校验文件
function validateAudio(file) {
    const ext = file.name.split('.').pop().toLowerCase()

    if (!exts.includes(ext)) {
        message.error(`${file.name}：请选择正确的音频文件`)
        return false
    }

    if (file.size < 1024 * 1024) {
        message.error(`${file.name}：文件大小不能小于1MB`)
        return false
    }

    if (file.size > 1024 * 1024 * 100) {
        message.error(`${file.name}：文件大小不能超过100MB`)
        return false
    }

    return true
}

// 上传音频
async function uploadAudioFile(row, file) {
    if (!validateAudio(file)) return

    row.loading = true

    const fData = new FormData()
    fData.append('song', file)

    try {
        const res = await uploadAudio(fData)

        if (!formData.value.title) {
            formData.value.title = res.title
        }

        if (!formData.value.singerList?.length) {
            formData.value.singerList = res.artists.map(item => item.id)

            // 填充歌手下拉选项，避免显示空白
            res.artists.forEach(item => {
                if (!singerOptions.some(option => option.value === item.id)) {
                    singerOptions.push({
                        label: item.name,
                        value: item.id
                    })
                }
            })
        }

        row.url = res.url
        row.filename = res.filename
        row.fileId = res.fileId
        row.duration = res.duration
        row.format = res.codec
        row.bitrate = res.bitrate
        row.sampleRate = res.sampleRate
        row.bitDepth = res.bitsPerSample
        row.size = file.size

    } catch (err) {
        message.error(`${file.name} 上传失败`)
        console.error(err)
    } finally {
        row.loading = false
    }
}

const isDragging = ref(false)
let dragCounter = 0

// 拖拽进入
function handleDragEnter(e) {
    if (!e.dataTransfer?.types.includes('Files')) return

    dragCounter++
    isDragging.value = true
}

// 拖拽离开
function handleDragLeave() {
    dragCounter--

    if (dragCounter <= 0) {
        dragCounter = 0
        isDragging.value = false
    }
}

// 放下文件
function handleDrop(e) {
    dragCounter = 0
    isDragging.value = false

    const files = Array.from(e.dataTransfer?.files || [])

    if (!files.length) return

    files.forEach(file => {
        addAudio()
        uploadAudioFile(audioList[0], file)
    })
}


function initForm(data = {}) {
    audioList.splice(0)
    formData.value = {
        title: data.title,
        cover: data.cover,
        mvUrl: data.mvUrl,
        enabled: data.enabled ?? 1,
        songTypes: data.songTypes,
        publishDate: data.publishDate,
        singerList: data.singerList ?? []
    }


    if (data.audioList) audioList.push(...data.audioList)
}

</script>