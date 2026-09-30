<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item name="cover" label="专辑封面">
                            <uploadImage mode="single" v-model="formData.cover" savePath="cover"></uploadImage>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="title" label="专辑名称">
                            <a-input v-model:value.trim="formData.title" placeholder="请输入专辑名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="singerList" label="演出者">
                            <a-select v-model:value="formData.singerList" show-search placeholder="请选择演出者"
                                style="width: 100%" :default-active-first-option="false" :show-arrow="false"
                                mode="multiple" :filter-option="false" :not-found-content="null"
                                :options="singerOptions" @search="handleSearch" @focus="handleSearch()"></a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="company" label="唱片公司">
                            <a-input v-model:value.trim="formData.company" placeholder="请输入唱片公司" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="releaseDate" label="发行时间">
                            <a-date-picker v-model:value="formData.releaseDate" style="width: 100%"
                                value-format="YYYY-MM-DD" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="type" label="专辑类型">
                            <DictSelect v-model="formData.type" dictKey="ALBUM_TYPE"></DictSelect>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="genre" label="流派/风格">
                            <DictSelect v-model="formData.genre" dictKey="MUSIC_GENRE" mode="multiple"></DictSelect>
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
                </a-row>
                <a-form-item name="enabled" label="是否启用">
                    <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                </a-form-item>
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
import DictSelect from "@/components/dictSelect/index.vue"
import { getAlbumInfo, saveAlbum } from "@/request/music/album.js"
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
            console.log(cover);
            if (!cover || !cover.id) {
                return Promise.reject('请上传封面')
            }
            return Promise.resolve()
        }
    },
    title: { required: true, message: '请输入专辑名称', },
    singerList: { required: true, message: '请选择演出人', type: 'array' },
    company: { required: true, message: '请输入唱片公司', },
    releaseDate: { required: true, message: '请输入发行时间', },
    type: { required: true, message: '请选择专辑类型', },
    genre: { required: true, message: '请选择流派/风格', type: 'array' },
})

const title = computed(() => (props.id && props.readonly) ? '专辑详情' : props.id ? '编辑专辑' : '新增专辑')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveAlbum({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getAlbumInfo(props.id)
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
        singerList: data.singerList || [],
        company: data.company,
        releaseDate: data.releaseDate,
        type: data.type,
        genre: data.genre,
        sort: data.sort ?? 1,
        isHot: data.isHot ?? 0,
        enabled: data.enabled ?? 1,
        description: data.description,
    }
}

</script>