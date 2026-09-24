<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ span: 4 }" :disabled="readonly">
                    <a-form-item name="title" label="数据名称">
                        <a-input v-model:value.trim="formData.title" placeholder="请输入字典数据名称" />
                    </a-form-item>
                    <a-form-item name="value" label="数据值">
                        <a-input v-model:value.trim="formData.value" placeholder="请输入字典数据值" />
                    </a-form-item>
                    <a-form-item name="extData" label="备用数据值">
                        <a-input v-model:value.trim="formData.extData" placeholder="当数据值不够用时使用" />
                    </a-form-item>
                    <a-form-item name="sort" label="排序">
                        <a-input-number v-model:value="formData.sort" :min="1" style="width:100%" />
                    </a-form-item>
                    <a-form-item name="enabled" label="是否启用">
                        <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                    </a-form-item>
                    <a-form-item name="remark" label="描述">
                        <a-textarea show-count :maxlength="255" v-model:value="formData.remark" :checkedValue="1"
                            :unCheckedValue="0" />
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
import { getDictItemInfo, saveDictItem } from "@/request/system/dict"
import useDictStore from '@/store/system/dict';
import { message } from 'ant-design-vue';
const dictStore = useDictStore()
const route = useRoute()
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})


const formData = ref({})
const formRef = ref(null)
const rulesRef = reactive({
    title: { required: true, message: '请输入字典名称', },
    value: { required: true, message: '请输入字典数据值', },
    sort: { required: true, message: '请输入排序', },
})

const title = computed(() => (props.id && props.readonly) ? '字典数据详情' : props.id ? '编辑字典数据' : '新增字典数据')

const emits = defineEmits(["saveSuccess"])
const show = defineModel({
    type: Boolean,
    default: false
})

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveDictItem({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            dictStore.fetchDicts()
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getDictItemInfo(props.id)
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
        dictId: route.query.id,
        title: data.title,
        value: data.value,
        extData: data.extData,
        sort: data.sort ?? 1,
        remark: data.remark,
        enabled: data.enabled ?? 1,
    }
}

</script>