<template>
    <div class="w-full h-full bg-white p-6 rounded-lg shadow-sm">
        <a-tabs v-model:activeKey="activeKey" class="profile-tabs">
            <!-- 1. 用户信息模块 -->
            <a-tab-pane key="profile" tab="用户信息">
                <div class="max-w-xl py-4">
                    <!-- 头像修改区域 -->
                    <div class="flex items-center gap-6 mb-8">
                        <Avatar v-model="userInfo.avatar"></Avatar>
                    </div>

                    <!-- 个人资料表单 -->
                    <a-form ref="userInfoFormRef" :model="userInfo" :rules="userInfoRules" layout="vertical">
                        <a-form-item label="登录账号" name="username">
                            <a-input v-model:value="userInfo.username" disabled />
                        </a-form-item>

                        <a-form-item label="用户昵称" name="nickname">
                            <a-input v-model:value="userInfo.nickname" placeholder="请输入昵称" />
                        </a-form-item>

                        <a-form-item label="联系电话" name="phone">
                            <a-input v-model:value="userInfo.phone" placeholder="请输入手机号" />
                        </a-form-item>

                        <a-form-item label="电子邮箱" name="email">
                            <a-input v-model:value="userInfo.email" placeholder="请输入邮箱" />
                        </a-form-item>

                        <a-form-item class="mt-6">
                            <a-button type="primary" :loading="submitLoading" @click="saveUserInfo">
                                保存修改
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-tab-pane>

            <!-- 2. 修改密码模块 -->
            <a-tab-pane key="password" tab="修改密码">
                <div class="max-w-md py-4">
                    <a-form ref="passwordFormRef" :model="passwordForm" :rules="passwordRules" layout="vertical">
                        <a-form-item label="旧密码" name="oldPassword">
                            <a-input-password v-model:value="passwordForm.oldPassword" placeholder="请输入当前使用的密码" />
                        </a-form-item>

                        <a-form-item label="新密码" name="newPassword">
                            <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码（至少6位）" />
                        </a-form-item>

                        <a-form-item label="确认新密码" name="confirmPassword">
                            <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" />
                        </a-form-item>

                        <a-form-item class="mt-6">
                            <a-button type="primary" :loading="passwordLoading" @click="updatePassword">
                                确认修改密码
                            </a-button>
                        </a-form-item>
                    </a-form>
                </div>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Avatar from "./avatar.vue"
import useUserStore from "@/store/user"
import { editPwd, editUserInfo } from "@/request/user.js"
import { message } from 'ant-design-vue';
const userStore = useUserStore()
const route = useRoute();
const activeKey = ref(route.query.mode || 'profile');

const userInfoFormRef = ref();
const passwordFormRef = ref();

const submitLoading = ref(false);
const passwordLoading = ref(false);

// --- 用户信息数据 ---
const userInfo = reactive({
    username: userStore.userInfo.username,
    nickname: userStore.userInfo.nickname,
    phone: userStore.userInfo.phone || '',
    email: userStore.userInfo.email || '',
    avatar: userStore.userInfo.avatar || '',
});


watch(() => route.query, () => {
    activeKey.value = route.query.mode || 'profile'
})


watch(() => userStore.userInfo, () => {
    Object.assign(userInfo, userStore.userInfo);
})

// 用户信息校验规则
const userInfoRules = {
    nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
    phone: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号格式', trigger: 'blur' },
    ],
    email: [
        { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
    ],
};

// --- 修改密码数据 ---
const passwordForm = reactive({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
});

// 自定义二次密码校验
const validateConfirmPassword = async (_rule, value) => {
    if (!value) {
        return Promise.reject('请再次输入新密码');
    }
    if (value !== passwordForm.newPassword) {
        return Promise.reject('两次输入的密码不一致！');
    }
    return Promise.resolve();
};

// 密码校验规则
const passwordRules = {
    oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, message: '密码长度不能少于6位', trigger: 'blur' },
    ],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'change' }],
};



// 保存用户信息
const saveUserInfo = async () => {
    try {
        await userInfoFormRef.value.validate();
        submitLoading.value = true;
        await editUserInfo(userInfo);
        message.success('个人资料保存成功！');
        userStore.fetchUserInfo()


    } catch (error) {
        console.log('表单校验失败:', error);
    }
    submitLoading.value = false;
};

// 提交密码修改
const updatePassword = async () => {
    try {
        await passwordFormRef.value.validate();
        passwordLoading.value = true;

        // TODO: 调用后端修改密码接口
        await editPwd(passwordForm);
        message.success('密码修改成功，请重新登录！');
        // 清空表单
        passwordFormRef.value.resetFields();
    } catch (error) {
        console.log('密码校验失败:', error);
    }
    passwordLoading.value = false;
};
</script>

<style scoped>
.profile-tabs :deep(.ant-tabs-nav) {
    margin-bottom: 16px;
}
</style>