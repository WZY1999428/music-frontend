<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
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

                            <div class="max-h-[600px] overflow-y-auto">
                                <div class="flex flex-col gap-3">
                                    <div v-for="(audio, index) in audioList" :key="audio.id ?? index"
                                        class="border rounded-lg p-3">
                                        <!-- 文件信息 -->
                                        <div class="flex items-center gap-3">
                                            <!-- 音频图标 -->
                                            <div
                                                class="w-10 h-10 flex items-center justify-center rounded bg-blue-50 text-blue-500">
                                                <SoundOutlined />
                                            </div>

                                            <!-- 文件名 -->
                                            <div class="flex-1 min-w-0">
                                                <div class="truncate">{{ audio.filename || '未选择音频' }}</div>
                                                <div class="text-gray-400 text-xs mt-1">
                                                    {{ audio.format || '--' }}
                                                    <span v-if="audio.bitrate"> · {{ audio.bitrate }}kbps</span>
                                                    <span v-if="audio.size">· {{ formatSize(audio.size) }}</span>
                                                </div>
                                            </div>
                                            <!-- 音频品质 -->
                                            <DictSelect dictKey="AUDIO_QUALITY" v-model="audio.quality"
                                                placeholder="音频品质" style="width: 120px" />
                                            <!-- 操作 -->
                                            <a-button @click="selectAudio(audio)">
                                                <UploadOutlined></UploadOutlined>
                                                选择音乐
                                            </a-button>

                                            <a-button danger type="text" @click="removeAudio(index)">
                                                <DeleteOutlined />
                                            </a-button>
                                        </div>
                                    </div>
                                    <!-- 空状态 -->
                                    <a-empty v-if="audioList.length === 0" description="暂无音频文件"
                                        :image="Empty.PRESENTED_IMAGE_SIMPLE" />
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
import DictSelect from "@/components/dictSelect/index.vue"
import { PlusOutlined, DeleteOutlined, SoundOutlined, UploadOutlined } from '@ant-design/icons-vue'
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

const title = computed(() => (props.id && props.readonly) ? '歌手详情' : props.id ? '编辑歌手' : '新增歌手')
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
        quality: null,
        bitrate: null,
        sampleRate: null,
        bitDepth: null,
    })
}

const ACCEPT = ["audio/mp3", "audio/wav", "audio/flac", "audio/ogg"]
const exts = ["mp3", "flac", "wav", "ogg"]
function selectAudio(row) {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = ACCEPT.join(',');
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!exts.includes(file.name.split('.').pop().toLowerCase())) {
                message.error('请选择正确的音频文件');
                return;
            }

            if (file.size < 1024 * 1024 * 1) {
                message.error('文件大小不能小于1MB');
                return;
            }

            if (file.size > 1024 * 1024 * 100) {
                message.error('文件大小不能超过100MB');
                return;
            }

            row.loading = true;

            const formData = new FormData();
            formData.append('song', file);
            uploadAudio(formData).then(res => {
                row.url = res.url;
                row.filename = res.filename;
                row.fileId = res.fileId;
                row.duration = res.duration;
                row.format = res.codec;
                row.bitrate = res.bitrate;
                row.sampleRate = res.sampleRate;
                row.bitDepth = res.bitsPerSample;
            }).finally(() => {
                row.loading = false;
            })
        }
    };
    fileInput.click();
}


function initForm(data = {}) {
    audioList.splice(0)
    formData.value = {
        title: data.title,
        cover: data.cover,
        publishDate: data.publishDate,
        singerList: data.singerList ?? []
    }

    console.log(data.singerList);

    if (data.audioList) audioList.push(...data.audioList)
}

</script>