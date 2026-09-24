<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '100px' } }"
                    :disabled="readonly">
                    <a-form-item name="avatar" label="用户头像">
                        <Avatar v-model="formData.avatar" />
                    </a-form-item>
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-form-item name="username" label="用户账户">
                                <a-input v-model:value.trim="formData.username" placeholder="请输入用户账户" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="nickname" label="用户昵称">
                                <a-input v-model:value.trim="formData.nickname" placeholder="请输入用户昵称" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="password" label="用户密码">
                                <a-input-password v-model:value="formData.password" placeholder="请输入用户密码" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="phone" label="用户手机号">
                                <a-input v-model:value="formData.phone" placeholder="请输入用户手机号" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="email" label="用户邮箱">
                                <a-input v-model:value="formData.email" placeholder="请输入用户邮箱" />
                            </a-form-item>
                        </a-col>

                        <a-col :span="12">
                            <a-form-item name="roleIds" label="用户角色">
                                <a-select v-model:value="formData.roleIds" mode="multiple" :options="roleOptions"
                                    placeholder="请选择角色" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="deptIds" label="用户部门">
                                <a-tree-select v-model:value="formData.deptIds" placeholder="请选择部门" allow-clear multiple
                                    tree-checkable tree-check-strictly tree-default-expand-all
                                    :tree-data="deptOptions" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="sort" label="排序">
                                <a-input-number v-model:value="formData.sort" :min="1" style="width:100%" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="enabled" label="启用账号">
                                <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item name="remark" label="备注">
                                <a-textarea v-model:value="formData.remark" :rows="4" placeholder="请输入备注" />
                            </a-form-item>
                        </a-col>
                    </a-row>


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
import { getRoleOptions } from "@/request/system/role"
import { getDeptTree } from "@/request/system/dept"
import Avatar from "@/views/user/avatar.vue"
import { getUserInfo, saveUser } from "@/request/system/user"
import { message } from 'ant-design-vue';

const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const formData = ref({})
const roleOptions = ref([])
const deptOptions = ref([])
const formRef = ref(null)
const rulesRef = reactive({
    username: { required: true, message: '请输入用户账户', },
    nickname: { required: true, message: '请输入用户昵称', },
    roleIds: { required: true, message: '请选择角色', type: 'array' },
    phone: [{ required: true, message: '请输入用户手机号', }, { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式' }],
})

const title = computed(() => (props.id && props.readonly) ? '用户详情' : props.id ? '编辑用户' : '新增用户')
const emits = defineEmits(["update:modelValue", "saveSuccess"])

const show = defineModel({
    type: Boolean,
    default: false
})

const detailLoading = ref(false)
const confirmLoading = ref(false)


function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveUser({ id: props.id, ...formData.value, deptIds: formData.value.deptIds.map(item => item.value || item) }).then(_ => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getUserInfo(props.id)
        .then(info => {
            initForm(info)
        })
        .finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        if (props.id) fetchRoleInfo()
        getRoleOptions().then(list => roleOptions.value = list)
        getDeptTree().then(list => deptOptions.value = list)
    }
});



function initForm(data = {}) {
    formData.value = {
        avatar: data.avatar,
        username: data.username,
        nickname: data.nickname,
        password: data.password,
        roleIds: data.roleIds ?? [],
        deptIds: data.deptIds?.map(item => ({ value: item.value || item })) ?? [],
        email: data.email,
        enabled: data.enabled ?? 1,
        phone: data.phone,
        sort: data.sort ?? 1,
        remark: data.remark
    }
}

</script>