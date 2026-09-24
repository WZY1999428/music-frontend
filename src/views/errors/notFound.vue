<template>
    <!-- 背景网格遮罩 -->
    <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none">
    </div>

    <!-- 浮动几何装饰图形 -->
    <div
        class="absolute top-20 left-[20%] w-12 h-12 border border-indigo-500/30 rounded-xl rotate-12 animate-float pointer-events-none">
    </div>
    <div
        class="absolute bottom-24 right-[22%] w-8 h-8 border border-purple-500/30 rounded-full animate-float-slow pointer-events-none">
    </div>

    <div class="w-full h-full flex  flex flex-col items-center justify-center ">
        <!-- 主要内容区域 -->
        <div class="relative z-10 max-w-lg  px-6 text-center ">
            <!-- 404 3D 浮动渐变文字 -->
            <div class="relative inline-block select-none my-2">
                <h1
                    class="text-[140px] sm:text-[170px] font-black leading-none tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-indigo-200 via-indigo-400 to-indigo-900 drop-shadow-[0_10px_35px_rgba(99,102,241,0.35)] animate-bounce-gentle">
                    404
                </h1>
                <!-- 光晕发光层 -->
                <span
                    class="absolute inset-0 text-[140px] sm:text-[170px] font-black leading-none tracking-tight text-indigo-500/20 blur-xl pointer-events-none">
                    404
                </span>
            </div>

            <!-- 提示文案 -->
            <!-- STREAMING_CHUNK:Rendering localized message and action buttons... -->
            <div class="space-y-3 mt-2">
                <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-slate-100">
                    抱歉，页面迷路了
                </h2>
                <p class="text-sm sm:text-base text-slate-400 max-w-sm mx-auto leading-relaxed">
                    您访问的页面不存在、已被移除或链接地址输入有误。
                </p>
            </div>

            <!-- 操作按钮组 -->
            <div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <!-- 返回上一页按钮 -->
                <a-button size="large"
                    class="!h-11 !px-6 !rounded-xl !bg-slate-900/80 !border-slate-800 !text-slate-200 hover:!border-indigo-500 hover:!text-white transition-all duration-300 flex items-center justify-center shadow-lg shadow-black/40 hover:scale-105"
                    @click="goBack">
                    <template #icon>
                        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </template>
                    返回上一页
                </a-button>

                <!-- 返回首页按钮 -->
                <a-button type="primary" size="large"
                    class="!h-11 !px-6 !rounded-xl !bg-gradient-to-r !from-indigo-500 !to-violet-600 !border-0 !text-white hover:!from-indigo-400 hover:!to-violet-500 transition-all duration-300 flex items-center justify-center shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105"
                    @click="goHome">
                    <template #icon>
                        <svg class="w-4 h-4 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                    </template>
                    返回首页
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
    router.go(-1)
}

const goHome = () => {
    router.push('/')
}
</script>