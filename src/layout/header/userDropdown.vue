<template>
    <!-- 用户 -->
    <a-dropdown>
        <div class="flex items-center gap-2 px-4 py-1.5 rounded-lg
                    cursor-pointer hover:bg-gray-100 transition-colors">
            <a-avatar :size="36">
                <template #icon>
                    <UserOutlined />
                </template>
            </a-avatar>
            <div class="hidden md:block leading-tight">
                <div class="text-sm font-medium text-gray-800">{{ userInfo?.nickname || '管理员' }}</div>
                <div class="text-xs text-gray-400">{{ userInfo?.isSuperAdmin ? '超级管理员' : userInfo?.role?.name || '游客' }}
                </div>
            </div>
            <DownOutlined class="text-xs text-gray-400" />
        </div>

        <template #overlay>
            <a-menu>
                <a-menu-item key="profile" @click="toUserInfo('profile')">
                    <UserOutlined />
                    个人资料
                </a-menu-item>

                <a-menu-item key="password" @click="toUserInfo('password')">
                    <LockOutlined />
                    修改密码
                </a-menu-item>

                <a-sub-menu key="switchRole" v-if="!userInfo.isSuperAdmin">
                    <template #title>
                        <UserSwitchOutlined />
                        切换角色
                    </template>
                    <a-menu-item v-for="role in roles" @click="selectRole(role)" :key="role.roleId">{{ role.name
                    }}</a-menu-item>
                </a-sub-menu>
                <a-menu-item key="logout" danger @click="handleLogout">
                    <LogoutOutlined />
                    退出登录
                </a-menu-item>
            </a-menu>
        </template>
    </a-dropdown>
</template>

<script setup>
import { ExclamationCircleOutlined, UserSwitchOutlined, LockOutlined, UserOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons-vue';
import { Modal, message } from 'ant-design-vue';
import useUserStore from '@/store/user';
const router = useRouter()
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const roles = computed(() => userStore.roles);

function handleLogout() {
    Modal.confirm({
        title: '提示',
        icon: h(ExclamationCircleOutlined),
        content: '确定要退出登录吗？',
        okText: '确定',
        cancelText: '取消',
        onOk() {
            userStore.logout();
            storageClear();
            window.location.replace('/login');
        },
        onCancel() { },
    });

};

function selectRole(role) {
    Modal.confirm({
        title: '提示',
        icon: h(ExclamationCircleOutlined),
        content: `确定要切换角色为${role.name}吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk() {
            userStore.switchUserRole(role.roleId).then(() => {
                message.success("切换成功")
            })
        },
        onCancel() { },
    });
}

function toUserInfo(mode) {
    router.push({
        name: 'profile',
        query: {
            mode
        }
    })
}

</script>
