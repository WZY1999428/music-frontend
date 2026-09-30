<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item name="cover" label="歌单封面">
                            <uploadImage mode="single" v-model="formData.cover" savePath="cover"></uploadImage>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="title" label="歌单名称">
                            <a-input v-model:value.trim="formData.title" placeholder="请输入专辑名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="sort" label="权重">
                            <a-input v-model:value="formData.sort" style="width: 100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="isHot" label="是否热门">
                            <a-switch v-model:checked="formData.isHot" :checkedValue="1" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="enabled" label="是否启用">
                            <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item name="description" label="详情描述">
                    <a-textarea v-model:value="formData.description" :maxlength="500" show-count placeholder="请输入"
                        :rows="5" />
                </a-form-item>
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
import { getPlaylistInfo, savePlaylist } from "@/request/music/playlist.js"
import { searchArtist } from "@/request/music/artist.js"

import { message } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const formData = ref({})
const singerOptions = reactive([])
const formRef = ref(null)
const rulesRef = reactive({
    cover: {
        required: true, validator: (_, cover) => {
            if (!cover || !cover.id) {
                return Promise.reject('请上传封面')
            }
            return Promise.resolve()
        }
    },
    title: { required: true, message: '请输入歌单名称', },
})

const title = computed(() => (props.id && props.readonly) ? '歌单详情' : props.id ? '编辑歌单' : '新增歌单')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        savePlaylist({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getPlaylistInfo(props.id)
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
        if (props.id) fetchRoleInfo()
    }
});


function initForm(data = {}) {
    formData.value = {
        title: data.title,
        cover: data.cover,
        sort: data.sort ?? 1,
        isHot: data.isHot ?? 0,
        enabled: data.enabled ?? 1,
        description: data.description,
    }
}

</script>