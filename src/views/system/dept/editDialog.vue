<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '120px' } }"
                    :disabled="readonly">
                    <a-form-item name="parentId" label="上级部门">
                        <a-tree-select :tree-data="deptTree" v-model:value="formData.parentId" placeholder="请选择上级部门"
                            allow-clear />
                    </a-form-item>
                    <a-form-item name="deptName" label="部门名称">
                        <a-input v-model:value.trim="formData.deptName" placeholder="请输入部门名称" :max-length="30" />
                    </a-form-item>
                    <a-form-item name="leaderId" label="部门负责人">
                        <a-select :options="leaderOptions" v-model:value="formData.leaderId" placeholder="请选择部门负责人" />
                    </a-form-item>
                    <a-form-item name="phone" label="部门联系电话">
                        <a-input v-model:value.trim="formData.phone" placeholder="请输入联系电话" />
                    </a-form-item>
                    <a-form-item name="email" label="部门邮箱">
                        <a-input v-model:value.trim="formData.email" placeholder="请输入邮箱" />
                    </a-form-item>
                    <a-form-item name="enabled" label="是否启用">
                        <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                    </a-form-item>
                    <a-form-item name="sort" label="排序">
                        <a-input-number v-model:value="formData.sort" :min="1" style="width:100%" />
                    </a-form-item>
                    <a-form-item name="remark" label="备注">
                        <a-textarea v-model:value="formData.remark" placeholder="请输入备注" :rows="5" :max-length="200"
                            show-count />
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
import { saveDept, getDeptInfo, getDeptTree } from "@/request/system/dept"
import { getAllUser } from "@/request/system/user"
import { message } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const leaderOptions = ref([])
const deptTree = ref([])
const formData = ref({})
const formRef = ref(null)
const rulesRef = reactive({
    deptName: { required: true, message: '请输入部门名称', },
    deptCode: { required: true, message: '请输入部门编码', },
    sort: { required: true, message: '请输入排序', },
    leaderId: { required: true, message: '请选择负责人', },
    phone: [
        { required: true, message: '请输入联系电话' },
        { message: '请输入正确联系电话', pattern: /^1[3-9]\d{9}$/, }
    ],
    email: { required: false, message: '请输入正确邮箱', type: 'email' },
})

const title = computed(() => (props.id && props.readonly) ? '部门详情' : props.id ? '编辑部门' : '新增部门')
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
        saveDept({ id: props.id, ...formData.value }).then(res => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)


    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getDeptInfo(props.id).then(info => initForm(info)).finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        getAllUser().then(res => leaderOptions.value = res.list.map(i => ({ label: i.nickname, value: i.id })))
        getDeptTree().then(list => deptTree.value = list)
        if (props.id) fetchRoleInfo()
    }
});



function initForm(data = {}) {
    formData.value = {
        parentId: data.parentId,
        deptName: data.deptName,
        deptCode: data.deptCode,
        sort: data.sort ?? 1,
        leaderId: data.leaderId,
        phone: data.phone,
        email: data.email,
        enabled: data.enabled ?? 1,
        remark: data.remark,
    }
}


</script>