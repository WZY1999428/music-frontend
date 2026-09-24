<template>
    <div class="min-h-screen flex bg-gray-50">
        <!-- 左侧品牌区域 -->
        <div class="hidden lg:flex lg:w-1/2 bg-gray-900 text-white
                   items-center justify-center relative overflow-hidden">
            <div class="relative z-10 max-w-lg px-12">
                <div class="flex items-center gap-3 mb-8">
                    <img :src="config?.logo" class="w-12 h-12 rounded-xl bg-white/10
                               flex items-center justify-center text-xl font-bold" />
                    <span class="text-2xl font-semibold">
                        {{ config?.systemTitle }}
                    </span>
                </div>

                <h1 class="text-4xl font-bold leading-tight mb-5">
                    欢迎回来
                </h1>

                <p class="text-gray-400 text-lg leading-8">
                    一个简洁、高效的后台管理系统。
                    登录后即可开始管理你的业务数据。
                </p>
            </div>

            <!-- 装饰背景 -->
            <div class="absolute -right-32 -bottom-32
                       w-96 h-96 rounded-full
                       bg-white/5" />

            <div class="absolute -left-20 -top-20
                       w-72 h-72 rounded-full
                       bg-white/5" />
        </div>

        <!-- 右侧登录区域 -->
        <div class="w-full lg:w-1/2
                   flex items-center justify-center
                   px-6 py-12">
            <div class="w-full max-w-md">

                <!-- 移动端 Logo -->
                <div class="lg:hidden text-center mb-10">
                    <img :src="config?.logo" class="inline-flex w-12 h-12 rounded-xl
                               bg-gray-900 text-white
                               items-center justify-center
                               text-xl font-bold mb-4">
                    A
                    </img>

                    <h1 class="text-2xl font-semibold text-gray-900">
                        {{ config?.systemTitle }}
                    </h1>
                </div>

                <!-- 标题 -->
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900">
                        登录
                    </h2>

                    <p class="text-gray-500 mt-2">
                        欢迎回来，请登录你的账号
                    </p>
                </div>

                <!-- 表单 -->
                <a-form :model="form" :rules="rules" layout="vertical" @finish="handleLogin">
                    <!-- 账号 -->
                    <a-form-item label="账号" name="username">
                        <a-input v-model:value="form.username" size="large" placeholder="请输入账号" allow-clear
                            autocomplete="username" />
                    </a-form-item>
                    <!-- 密码 -->
                    <a-form-item label="密码" name="password">
                        <a-input-password v-model:value="form.password" size="large" placeholder="请输入密码"
                            autocomplete="current-password" />
                    </a-form-item>
                    <!-- 验证码 -->
                    <a-form-item label="验证码" name="captcha">
                        <div class="w-full flex items-center gap-2">
                            <a-input class="flex-1" v-model:value="form.captcha" size="large" :maxlength="4"
                                placeholder="请输入验证码" />
                            <div class="w-[120px] h-[40px]">
                                <a-image class="cursor-pointer w-full h-full" :src="captchaUrl" :preview="false"
                                    @click="refreshCaptcha" />
                            </div>
                        </div>
                    </a-form-item>

                    <!-- 记住我 -->
                    <div class="flex items-center justify-between mb-6">

                        <a-checkbox v-model:checked="form.remember">
                            记住我
                        </a-checkbox>

                        <a href="javascript:;" class="text-blue-600 hover:text-blue-500">
                            忘记密码？
                        </a>

                    </div>

                    <!-- 登录按钮 -->
                    <a-button type="primary" html-type="submit" size="large" block :loading="loading">
                        登录
                    </a-button>

                </a-form>

                <!-- 底部 -->
                <div class="text-center text-sm text-gray-400 mt-8">
                    © 2026 Admin System
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { login } from "@/request/user.js";
import useMenuStore from "@/store/system/menu";
import useConfigStore from "@/store/system/config"

const configStore = useConfigStore();
const config = computed(() => configStore.config)
const menuStore = useMenuStore();

const loading = ref(false);
const router = useRouter()
const route = useRoute()
const captchaUrl = ref("");
const form = reactive({
    username: "admin",
    password: "123456789",
    remember: true,
});

refreshCaptcha()
function refreshCaptcha() {
    captchaUrl.value = `/admin-api/captcha?t=${Date.now()}`;
}

const rules = {
    username: [
        {
            required: true,
            message: "请输入账号",
            trigger: "blur",
        },
    ],

    password: [
        {
            required: true,
            message: "请输入密码",
            trigger: "blur",
        },
    ],

    captcha: [
        {
            required: true,
            message: "请输入验证码",
            trigger: "blur",
        },
    ],
};

const handleLogin = async () => {
    loading.value = true;
    login(form).then(async token => {
        setToken(token);
        await menuStore.fetchMenu();
        router.replace(route.query.redirect || "/")
    }).catch(err => {
        loading.value = false;
        refreshCaptcha();
    });
};
</script>

<style lang="scss" scoped></style>
