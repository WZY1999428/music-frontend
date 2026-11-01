<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '100px' } }"
                    :disabled="readonly">
                    <a-form-item name="image" label="图片">
                        <uploadImage v-model="formData.image" mode="single" />
                    </a-form-item>
                    <a-form-item name="title" label="标题">
                        <a-input v-model:value="formData.title" placeholder="请输入标题" />
                    </a-form-item>
                    <a-form-item name="type" label="轮播图类型">
                        <DictSelect dictCode="APP_BANNER_TYPE" v-model="formData.type" @change="change" />
                    </a-form-item>
                    <a-form-item name="value" :label="selectLabel"
                        v-if="['album', 'artist', 'playlist', 'song', 'announce'].includes(formData.type)">
                        <a-select ref="select" v-model:value="formData.value" :options="options" placeholder="请选择"
                            allowClear show-search :filter-option="false" @search="fetchOptions"
                            @deselect="fetchOptions()" />
                    </a-form-item>
                    <a-form-item name="value" label="外部链接" v-else-if="formData.type === 'link'">
                        <a-input v-model:value="formData.value"></a-input>
                    </a-form-item>
                    <a-form-item name="desc" label="描述">
                        <a-textarea v-model:value="formData.desc" placeholder="请输入描述" :rows="4" :maxlength="200"
                            show-count />
                    </a-form-item>
                    <a-form-item name="sort" label="排序">
                        <a-input-number v-model:value="formData.sort" :min="0" style="width: 100%" />
                    </a-form-item>
                    <a-form-item name="enabled" label="是否启用">
                        <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                    </a-form-item>
                </a-form>
            </div>
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
import uploadImage from "@/components/uploadImage"
import DictSelect from "@/components/dictSelect"
import { getAlbumOptions } from "@/request/music/album"
import { searchArtist } from "@/request/music/artist"
import { getPlaylistOptions } from "@/request/music/playlist"
import { getSongOptions } from "@/request/music/song"
import { getAnnounceMgmtOptions } from "@/request/contentMgmt/announceMgmt"

import { getAppBannerInfo, saveAppBanner } from "@/request/app/banner"
import { message } from 'ant-design-vue';

const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const options = ref([])
const formData = ref({})
const formRef = ref(null)

const rulesRef = reactive({
    image: { required: true, message: '请上传图片', },
    type: { required: true, message: '请选择类型', },
    title: { required: true, message: '请输入标题', },
    value: {
        required: true, validator: (rule, value) => {
            if (!value) {
                return Promise.reject(selectLabel.value + '不能为空');
            }
            return Promise.resolve();
        }
    },
})
const selectLabel = computed(() => {
    switch (formData.value.type) {
        case 'album':
            return '专辑'
        case 'artist':
            return '艺人'
        case 'playlist':
            return '歌单'
        case 'song':
            return '歌曲'
        case 'announce':
            return '公告'
        default:
            return ''
    }
})
const title = computed(() => (props.id && props.readonly) ? '轮播图详情' : props.id ? '编辑轮播图' : '新增轮播图')
const emits = defineEmits(["update:modelValue", "saveSuccess"])

const show = defineModel({
    type: Boolean,
    default: false
})

const detailLoading = ref(false)
const confirmLoading = ref(false)

function change() {
    formData.value.value = ''
    fetchOptions()
}

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveAppBanner({ id: props.id, ...formData.value }).then(_ => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}

function fetchOptions(keyword) {
    const funcObject = {
        album: getAlbumOptions,
        artist: searchArtist,
        playlist: getPlaylistOptions,
        song: getSongOptions,
        announce: getAnnounceMgmtOptions,
    }
    const requestFunc = funcObject[formData.value.type]
    if (requestFunc) {
        requestFunc({ keyword, value: formData.value.value }).then(res => {
            options.value = res.list;
        })
    }
}

function fetchInfo() {
    detailLoading.value = true;
    getAppBannerInfo(props.id)
        .then(initForm)
        .finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        if (props.id) fetchInfo()
    }
});



function initForm(data = {}) {
    const value = Number(data.value);
    formData.value = {
        image: data.image,
        type: data.type,
        title: data.title,
        desc: data.desc,
        value: isNaN(value) ? data.value : value,
        enabled: data.enabled ?? 1,
        sort: data.sort ?? 1,
    }
    if (props.id) {
        fetchOptions()
    }
}

</script>