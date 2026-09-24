<template>
    <div class="p-4 space-y-4 bg-gray-50/50 min-h-[calc(100vh-80px)]">
        <!-- 顶部欢迎 Banner -->
        <a-card :bordered="false"
            class="shadow-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white overflow-hidden relative">
            <div class="flex items-center justify-between relative z-10 py-2">
                <div class="space-y-2">
                    <h2 class="text-2xl font-bold text-white mb-1">早安，管理员！👋</h2>
                    <p class="text-blue-100 text-sm">欢迎回到后台管理系统，今天也是充满活力的一天！</p>
                </div>
                <div class="hidden md:flex space-x-6 text-right">
                    <div>
                        <div class="text-blue-100 text-xs">系统运行时间</div>
                        <div class="text-xl font-semibold text-white mt-1">128 天</div>
                    </div>
                    <div>
                        <div class="text-blue-100 text-xs">今日访问量</div>
                        <div class="text-xl font-semibold text-white mt-1">1,429</div>
                    </div>
                </div>
            </div>
        </a-card>

        <!-- 统计卡片区域 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <a-card v-for="stat in statCards" :key="stat.title" :bordered="false"
                class="shadow-sm hover:shadow-md transition-shadow rounded-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-gray-400 text-xs mb-1">{{ stat.title }}</div>
                        <div class="text-2xl font-bold text-gray-800">{{ stat.value }}</div>
                        <div class="text-xs mt-2 flex items-center"
                            :class="stat.isUp ? 'text-green-500' : 'text-red-500'">
                            <span>{{ stat.isUp ? '↑' : '↓' }} {{ stat.change }}</span>
                            <span class="text-gray-400 ml-1">较上周</span>
                        </div>
                    </div>
                    <div :class="`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-500`">
                        <component :is="stat.icon" class="text-2xl" />
                    </div>
                </div>
            </a-card>
        </div>

        <!-- 中间主内容区：快捷入口 + 快捷状态 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            <!-- 快捷功能与系统概述 (占 2 栏) -->
            <div class="lg:col-span-2 space-y-4">
                <div class="mb-4">
                    <a-card title="快捷导航" :bordered="false" class="shadow-sm rounded-lg">
                        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div v-for="nav in quickNavs" :key="nav.title"
                                class="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-lg hover:bg-blue-50/50 hover:border-blue-200 cursor-pointer transition-all group">
                                <div
                                    :class="`p-3 rounded-lg bg-${nav.color}-50 text-${nav.color}-500 group-hover:scale-110 transition-transform`">
                                    <component :is="nav.icon" class="text-xl" />
                                </div>
                                <span class="text-xs text-gray-600 mt-2 font-medium">{{ nav.title }}</span>
                            </div>
                        </div>
                    </a-card>
                </div>

                <!-- 最近操作日志 / 任务 -->
                <a-card title="系统最新动态" :bordered="false" class="shadow-sm rounded-lg mt-4">
                    <a-timeline class="mt-2">
                        <a-timeline-item color="green">
                            <div class="text-xs text-gray-800 font-medium">管理员 修改了字典数据【用户状态】</div>
                            <div class="text-xs text-gray-400 mt-0.5">10 分钟前</div>
                        </a-timeline-item>
                        <a-timeline-item color="blue">
                            <div class="text-xs text-gray-800 font-medium">系统完成了自动数据备份</div>
                            <div class="text-xs text-gray-400 mt-0.5">2 小时前</div>
                        </a-timeline-item>
                        <a-timeline-item color="gray">
                            <div class="text-xs text-gray-800 font-medium">新增用户【张三】注册成功</div>
                            <div class="text-xs text-gray-400 mt-0.5">昨天 18:30</div>
                        </a-timeline-item>
                    </a-timeline>
                </a-card>
            </div>

            <!-- 右侧栏：通知公告与环境信息 (占 1 栏) -->
            <div class="space-y-4">
                <!-- 系统公告 -->
                <div class="mb-4">
                    <a-card title="通知公告" :bordered="false" class="shadow-sm rounded-lg">
                        <template #extra><a class="text-xs text-blue-500 hover:underline" href="#">更多</a></template>
                        <div class="space-y-3">
                            <div v-for="item in announcements" :key="item.id"
                                class="flex items-start justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                                <div class="space-y-1 pr-2">
                                    <div
                                        class="text-xs text-gray-700 font-medium line-clamp-1 hover:text-blue-500 cursor-pointer">
                                        {{ item.title }}
                                    </div>
                                    <div class="text-[11px] text-gray-400">{{ item.date }}</div>
                                </div>
                                <a-tag :color="item.type === 'important' ? 'red' : 'blue'"
                                    class="text-[10px] scale-90 transform-gpu">
                                    {{ item.tag }}
                                </a-tag>
                            </div>
                        </div>
                    </a-card>
                </div>

                <!-- 系统环境信息 -->
                <a-card title="系统信息" :bordered="false" class="shadow-sm rounded-lg ">
                    <div class="space-y-2 text-xs">
                        <div class="flex justify-between py-1 border-b border-gray-50">
                            <span class="text-gray-400">框架版本</span>
                            <span class="text-gray-700 font-medium">Vue 3.x + Antd</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-50">
                            <span class="text-gray-400">构建引擎</span>
                            <span class="text-gray-700 font-medium">Rsbuild / Vite</span>
                        </div>
                        <div class="flex justify-between py-1 border-b border-gray-50">
                            <span class="text-gray-400">当前环境</span>
                            <a-tag color="green" class="m-0 text-[10px]">{{ envMODE }}</a-tag>
                        </div>
                    </div>
                </a-card>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, markRaw } from 'vue'
import {
    UserOutlined,
    SettingOutlined,
    BookOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    FileTextOutlined,
    AppstoreOutlined,
    BellOutlined
} from '@ant-design/icons-vue'

const envMODE= import.meta.env.MODE

// 顶部统计卡片数据
const statCards = ref([
    { title: '总用户量', value: '8,848', change: '12%', isUp: true, color: 'blue', icon: markRaw(UserOutlined) },
    { title: '在线人数', value: '423', change: '5%', isUp: true, color: 'green', icon: markRaw(TeamOutlined) },
    { title: '系统日志', value: '12,042', change: '2%', isUp: false, color: 'orange', icon: markRaw(FileTextOutlined) },
    { title: '异常警报', value: '0', change: '0%', isUp: true, color: 'purple', icon: markRaw(BellOutlined) },
])

// 快捷入口数据
const quickNavs = ref([
    { title: '用户管理', icon: markRaw(UserOutlined), color: 'blue' },
    { title: '系统设置', icon: markRaw(SettingOutlined), color: 'gray' },
    { title: '字典管理', icon: markRaw(BookOutlined), color: 'orange' },
    { title: '权限控制', icon: markRaw(SafetyCertificateOutlined), color: 'green' },
    { title: '菜单管理', icon: markRaw(AppstoreOutlined), color: 'indigo' },
])

// 官方/系统公告数据
const announcements = ref([
    { id: 1, title: '系统预计于本周五晚 24:00 进行常规例行维护', date: '2026-09-10', type: 'important', tag: '维护' },
    { id: 2, title: '后台权限角色分组功能升级完成说明', date: '2026-09-08', type: 'normal', tag: '更新' },
    { id: 3, title: '关于提高系统管理员账号安全强度的通知', date: '2026-09-05', type: 'normal', tag: '安全' },
])
</script>

<style scoped>
/* 针对卡片内文字样式做适当调整 */
:deep(.ant-card-head) {
    border-bottom: 1px solid #f3f4f6;
    font-size: 14px;
    font-weight: 600;
    min-height: 44px;
}

:deep(.ant-card-head-title) {
    padding: 10px 0;
}
</style>