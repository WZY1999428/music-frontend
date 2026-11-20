<template>
    <div class="p-4 space-y-4 bg-gray-50/50 ">
        <!-- 顶部统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
            <a-card v-for="stat in statCards" :key="stat.title" :bordered="false"
                class="shadow-sm hover:shadow-md transition-shadow rounded-lg">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="text-gray-400 text-xs mb-1">{{ stat.title }}</div>
                        <div class="text-2xl font-bold text-gray-800">{{ stat.value }}</div>
                        <div class="text-xs mt-2 text-gray-400">{{ stat.desc }}</div>
                    </div>
                    <div :class="`p-3 rounded-xl bg-${stat.color}-50 text-${stat.color}-500`">
                        <component :is="getAntDesignIcon(stat.icon)" class="text-2xl" />
                    </div>
                </div>
            </a-card>
        </div>

        <!-- 地区歌手分布 -->
        <a-card title="地区歌手分布" :bordered="false" class="shadow-sm rounded-lg " >
            <BaseChart :option="regionOption" width="100%" height="360px"></BaseChart>
        </a-card>

        <!-- 饼图区域 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
            <a-card title="MV 歌曲占比" :bordered="false" class="shadow-sm rounded-lg">
                <BaseChart :option="mvOption" width="100%" height="340px"></BaseChart>
            </a-card>
            <a-card title="歌手性别统计" :bordered="false" class="shadow-sm rounded-lg">
                <BaseChart :option="genderOption" width="100%" height="340px"></BaseChart>
            </a-card>
        </div>
    </div>
</template>

<script setup>
import BaseChart from "@/components/BaseChart"

// ===== 模拟数据（后续对接接口后替换） =====
const regionData = [
    { name: '华东', value: 486 },
    { name: '华南', value: 402 },
    { name: '华北', value: 358 },
    { name: '西南', value: 276 },
    { name: '华中', value: 214 },
    { name: '东北', value: 158 },
    { name: '西北', value: 96 },
]

const mvData = [
    { name: '有 MV', value: 3240 },
    { name: '无 MV', value: 1860 },
]

const genderData = [
    { name: '男歌手', value: 2180 },
    { name: '女歌手', value: 1950 },
    { name: '组合/团体', value: 620 },
    { name: '未知', value: 350 },
]

const statCards = [
    { title: '歌手总数', value: '5,100', desc: '覆盖全国 7 大地区', icon: 'TeamOutlined', color: 'blue' },
    { title: '歌曲总数', value: '15,420', desc: '含 MV 歌曲 3,240 首', icon: 'CustomerServiceOutlined', color: 'purple' },
    { title: 'MV 歌曲占比', value: '21.0%', desc: '较上月 +2.4%', icon: 'VideoCameraOutlined', color: 'green' },
    { title: '覆盖地区', value: '7', desc: '华东地区歌手最多', icon: 'EnvironmentOutlined', color: 'orange' },
]

// ===== 图表配置 =====
const regionOption = {
    tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: params => `${params[0].name}<br/>歌手数量：${params[0].value} 位`,
    },
    grid: { left: 70, right: 30, top: 20, bottom: 20, containLabel: false },
    xAxis: {
        type: 'value',
        min: 0,
        axisLabel: { color: '#999' },
        splitLine: { lineStyle: { type: 'dashed', color: '#eee' } },
        axisLine: { show: false },
        axisTick: { show: false },
    },
    yAxis: {
        type: 'category',
        data: regionData.map(i => i.name),
        axisLabel: { color: '#666', fontSize: 12 },
        axisLine: { show: false },
        axisTick: { show: false },
    },
    series: [{
        name: '歌手数量',
        type: 'bar',
        barWidth: 22,
        data: regionData.map(i => i.value),
        itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: '#1677FF',
        },
        label: { show: true, position: 'right', color: '#666', fontSize: 12 },
    }],
}

const mvOption = {
    tooltip: { trigger: 'item', formatter: '{b}：{c} 首（{d}%）' },
    legend: { bottom: 0, icon: 'circle' },
    series: [{
        name: 'MV 歌曲',
        type: 'pie',
        radius: ['45%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
        data: mvData,
        color: ['#1677FF', '#91C8FF'],
    }],
}

const genderOption = {
    tooltip: { trigger: 'item', formatter: '{b}：{c} 位（{d}%）' },
    legend: { bottom: 0, icon: 'circle' },
    series: [{
        name: '歌手性别',
        type: 'pie',
        radius: '65%',
        center: ['50%', '45%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 12 },
        data: genderData,
        color: ['#1677FF', '#F759AB', '#722ED1', '#BFBFBF'],
    }],
}
</script>

<style scoped>
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
