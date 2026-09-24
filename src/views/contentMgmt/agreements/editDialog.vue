<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="title" label="协议名称">
                            <a-input v-model:value.trim="formData.title" placeholder="请输入协议名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="code" label="协议编码">
                            <a-input v-model:value.trim="formData.code" placeholder="请输入协议编码" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-form-item name="enabled" label="是否启用">
                    <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                </a-form-item>
                <a-form-item name="content" label="协议内容" :label-col="{ span: 24 }">
                    <RichTextEditor :disabled="readonly" v-model="formData.content"></RichTextEditor>
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
import { getAgreementsInfo, saveAgreements } from "@/request/contentMgmt/agreements.js"
import { message } from 'ant-design-vue';
import RichTextEditor from "@/components/richTextEditor/index.vue"
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
    title: { required: true, message: '请输入协议名称', },
    code: { required: true, message: '请输入协议编码', },
    content: { required: true, message: '请输入协议内容', },
})

const title = computed(() => (props.id && props.readonly) ? '协议详情' : props.id ? '编辑协议' : '新增协议')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveAgreements({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getAgreementsInfo(props.id)
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
        title: data.title,
        code: data.code,
        enabled: data.enabled ?? 1,
        content: data.content,
    }
}

</script>