<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ span: 4 }" :disabled="readonly">
                    <a-form-item name="name" label="角色名称">
                        <a-input v-model:value.trim="formData.name" placeholder="请输入角色名称" />
                    </a-form-item>
                    <a-form-item name="enabled" label="状态">
                        <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                    </a-form-item>
                    <a-form-item name="weight" label="权重">
                        <a-input-number v-model:value="formData.weight" :min="1" style="width:100%" />
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
import { saveRole, getRoleInfo } from "@/request/system/role"
import { message } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})


const formData = ref({})
const formRef = ref(null)
const rulesRef = reactive({
    name: { required: true, message: '请输入角色名称', },
})

const title = computed(() => (props.id && props.readonly) ? '角色详情' : props.id ? '编辑角色' : '新增角色')
const emits = defineEmits(["saveSuccess"])

const show = defineModel({
    type: Boolean,
    default: false
})
const detailLoading = ref(false)
const confirmLoading = ref(false)


function submit() {
    formRef.value?.validate().then(() => {
        console.log('表单验证通过');
        confirmLoading.value = true;
        saveRole({ id: props.id, ...formData.value }).then(res => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)


    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getRoleInfo(props.id).then(res => {
        formData.value = {
            name: res.name,
            enabled: res.enabled,
            weight: res.weight,
        }
    }).finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    formData.value = {
        name: null,
        enabled: 1,
        weight: 1,
    }

    if (newVal && props.id) {
        fetchRoleInfo()
    }
});

</script>