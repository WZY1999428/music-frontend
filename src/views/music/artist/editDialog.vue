<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="name" label="歌手名称">
                            <a-input v-model:value.trim="formData.name" placeholder="请输入歌手名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="realName" label="真实姓名">
                            <a-input v-model:value.trim="formData.realName" placeholder="请输入真实姓名" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="avatar" label="歌手头像">
                            <uploadImage mode="single" v-model="formData.avatar" savePath="avatar"></uploadImage>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="cover" label="歌手封面">
                            <uploadImage mode="single" v-model="formData.cover" savePath="cover"></uploadImage>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="gender" label="性别">
                            <DictSelect v-model="formData.gender" dictKey="ARTIST_GENDER"></DictSelect>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="area" label="地区">
                            <DictSelect v-model="formData.area" dictKey="ARTIST_REGION"></DictSelect>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="sort" label="排序">
                            <a-input-number v-model:value.trim="formData.sort" placeholder="请输入排序" style="width:100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="isHot" label="热门歌手">
                            <a-switch v-model:checked="formData.isHot" :checkedValue="1" :unCheckedValue="0" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item name="enabled" label="是否启用">
                    <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                </a-form-item>
                <a-form-item name="description" label="歌手简介">
                    <a-textarea v-model:value="formData.description" :max-length="500" show-count placeholder="请输入" :rows="5" />
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
import { getArtistInfo, saveArtist } from "@/request/music/artist.js"

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
const formRef = ref(null)
const rulesRef = reactive({
    name: { required: true, message: '请输入歌手名称', },
    realName: { required: true, message: '请输入真实姓名', },
    avatar: { required: true, message: '请上传歌手头像', },
    cover: { required: true, message: '请上传歌手封面', },
    gender: { required: true, message: '请选择性别', },
    area: { required: true, message: '请选择地区', },
})

const title = computed(() => (props.id && props.readonly) ? '歌手详情' : props.id ? '编辑歌手' : '新增歌手')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveArtist({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getArtistInfo(props.id)
        .then(res => initForm(res))
        .finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal && props.id) {
        fetchRoleInfo()
    }
});


function initForm(data = {}) {
    formData.value = {
        name: data.name,
        realName: data.realName,
        avatar: data.avatar,
        cover: data.cover,
        gender: data.gender,
        area: data.area,
        sort: data.sort ?? 1,
        isHot: data.isHot ?? 0,
        enabled: data.enabled ?? 1,
        description: data.description,
    }
}

</script>