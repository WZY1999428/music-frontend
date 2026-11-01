<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="pr-8">
                <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '100px' } }"
                    :disabled="readonly">
                    <a-form-item name="avatar" label="用户头像">
                        <uploadImage v-model="formData.avatar" mode="single" />
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
                            <a-form-item name="gender" label="性别">
                                <a-radio-group v-model:value="formData.gender" :options="[
                                    { label: '未知', value: 0 },
                                    { label: '男', value: 1 },
                                    { label: '女', value: 2 },
                                ]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="birthday" label="生日">
                                <a-date-picker v-model:value="formData.birthday" placeholder="请选择生日" style="width:100%" value-format="YYYY-MM-DD"/>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="enabled" label="启用账号">
                                <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="24">
                            <a-form-item name="remark" label="个性签名">
                                <a-textarea v-model:value="formData.remark" :rows="4" placeholder="请输入个性签名" />
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
import uploadImage from "@/components/uploadImage"
import { getAppUserInfo, saveAppUser } from "@/request/app/user"
import { message } from 'ant-design-vue';

const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const formData = ref({})
const formRef = ref(null)

const rulesRef = reactive({
    username: { required: true, message: '请输入用户账户', },
    nickname: { required: true, message: '请输入用户昵称', },
    avatar: { required: true, message: '请上传用户头像', },
    birthday: { required: true, message: '请选择用户生日', },
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
        saveAppUser({ id: props.id, ...formData.value }).then(_ => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchRoleInfo() {
    detailLoading.value = true;
    getAppUserInfo(props.id)
        .then(info => {
            initForm(info)
        })
        .finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        if (props.id) fetchRoleInfo()
    }
});



function initForm(data = {}) {
    formData.value = {
         username:data.username,
         nickname:data.nickname,
         avatar:data.avatar,
         email:data.email,
         phone:data.phone,
         gender:data.gender??0,
         birthday:data.birthday,
         signature:data.signature,
         enabled:data.enabled??1,
    }
}

</script>