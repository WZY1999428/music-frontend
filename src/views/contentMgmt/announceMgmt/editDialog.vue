<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-row :gutter="24"> <a-col :span="12">
                        <a-form-item name="title" label="公告名称">
                            <a-input v-model:value.trim="formData.title" placeholder="请输入公告名称" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">

                        <a-form-item name="type" label="公告类型">
                            <DictSelect v-model="formData.type" dictKey="NOTICE_TYPE"></DictSelect>
                        </a-form-item>
                    </a-col>

                    <a-col :span="12">
                        <a-form-item name="sort" label="排序">
                            <a-input-number v-model:value="formData.sort" placeholder="请输入排序" style="width:100%" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="dateRange" label="有效日期">
                            <a-range-picker v-model:value="formData.dateRange" :rows="10"
                                :placeholder="['请输入开始日期', '请输入结束日期']" style="width:100%" value-format="YYYY-MM-DD" />
                        </a-form-item>
                    </a-col>
                    <a-form-item name="enabled" label="是否启用">
                        <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                    </a-form-item>
                </a-row>

                <a-form-item name="content" label="公告内容" :label-col="{ span: 24 }">
                    <a-textarea v-model:value="formData.content" :rows="10" placeholder="请输入公告内容" />
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
import { getAnnounceMgmtInfo, saveAnnounceMgmt } from "@/request/contentMgmt/announceMgmt.js"
import DictSelect from "@/components/dictSelect"
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
    title: { required: true, message: '请输入协议名称', },
    type: { required: true, message: '请输入协议编码', },
    content: { required: true, message: '请输入协议内容', },
})

const title = computed(() => (props.id && props.readonly) ? '公告详情' : props.id ? '编辑公告' : '新增公告')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveAnnounceMgmt({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}

function fetchInfo() {
    detailLoading.value = true;
    getAnnounceMgmtInfo(props.id)
        .then(res => initForm(res))
        .finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal && props.id) {
        fetchInfo()
    }
});


function initForm(data = {}) {
    formData.value = {
        title: data.title,
        enabled: data.enabled ?? 1,
        content: data.content,
        type: data.type,
        sort: data.sort ?? 1,
        dateRange: data.createdAt ? [data.createdAt, data.createdAt] : []
    }

}

</script>