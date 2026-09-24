<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose
        :maskClosable="false">
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :model="formData" :disabled="readonly" colon labelAlign="right"
                :label-col="{ style: { width: '90px' } }" class="route-form">
                <a-form-item label="权限名称" name="name" :rules="[{ required: true, message: '权限名称不能为空' }]">
                    <a-input placeholder="请输入权限名称" v-model:value.trim="formData.name" :max-length="20" />
                </a-form-item>
                <a-form-item label="权限编码" name="permission" :rules="[{ required: true, message: '权限编码不能为空' }]">

                    <a-input placeholder="请输入权限编码" v-model:value.trim="formData.permission" :max-length="20" />
                </a-form-item>

                <a-form-item label="请求地址" name="path">
                    <a-select show-search :options="apiOptions" v-model:value.trim="formData.apiList" :max-length="20"
                        mode="multiple" @change="change" option-label-prop="children">
                    </a-select>
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
import { getSystemApis, savePermissions, getPermissions, delPermissions } from "@/request/system/menu"
import { message } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    routeId: [Number, String],
    readonly: Boolean,
    modelValue: {
        type: Boolean,
        default: false
    }
})


const formData = ref({})
const formRef = ref(null)
const apiOptions = ref([])

const title = computed(() => props.id ? '编辑权限' : '新增权限')
const emits = defineEmits(["update:modelValue", "saveSuccess"])
const show = ref(props.modelValue)

const detailLoading = ref(false)
const confirmLoading = ref(false)


function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        const params = {
            routeId: props.routeId,
            id: props.id,
            ...formData.value,
        }

        savePermissions(params).then(res => {
            message.success("保存成功")
            emits("saveSuccess");
            show.value = false
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchPermissionsInfo() {
    detailLoading.value = true;
    getPermissions(props.id).then(res => {
        initFormData(res)
    }).finally(() => {
        detailLoading.value = false;
    })
}



watch(() => show.value, (newVal) => emits("update:modelValue", newVal))
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        initFormData()
        getSystemApis().then(apis => apiOptions.value = apis)
        if (props.id) fetchPermissionsInfo()
    }

    show.value = newVal
});


function change(_, opt) {
    formData.value.method = opt.method
}

function initFormData(data = {}) {
    formData.value = {
        name: data.name,
        permission: data.permission,
        apiList: data.apiList ?? []
    }

}

</script>
