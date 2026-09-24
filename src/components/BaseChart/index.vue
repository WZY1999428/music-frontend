<template>
    <div ref="chartRef" :style="{ width, height }"></div>
</template>

<script setup>
import * as echarts from 'echarts';
// 定义组件 Props

const props = defineProps({
    option: {
        type: Object,
        required: true
    },
    width: {
        type: String,
        default: '100%'
    },
    height: {
        type: String,
        default: '100%'
    },
    theme: {
        type: String,
        default: ''
    },
    loading: {
        type: Boolean,
        default: false
    }
});

const chartRef = ref(null);
let chartInstance = null;
// 初始化图表
const initChart = () => {
    if (!chartRef.value) return;
    // 如果已存在实例，先销毁
    if (chartInstance) {
        chartInstance.dispose();
    }
    chartInstance = echarts.init(chartRef.value, props.theme);
    setOption();
};

// 设置/更新图表配置
const setOption = () => {
    if (!chartInstance) return;
    if (props.loading) {
        chartInstance.showLoading();
    } else {
        chartInstance.hideLoading();
        // notMerge: true 确保更新 option 时彻底替换旧配置
        chartInstance.setOption(props.option, true);
    }
};

// 监听 option 变化自动更新
watch(() => props.option, setOption, { deep: true });

// 监听 loading 状态变化
watch(
    () => props.loading,
    (val) => {
        if (!chartInstance) return;
        val ? chartInstance.showLoading() : chartInstance.hideLoading();
    }
);

// 容器尺寸自动适应 ( ResizeObserver 比 window.onresize 更准确)
let resizeObserver = null;
const initResizeObserver = () => {
    if (!chartRef.value) return;
    resizeObserver = new ResizeObserver(() => {
        chartInstance?.resize();
    });
    resizeObserver.observe(chartRef.value);
};

onMounted(() => {
    nextTick(() => {
        initChart();
        initResizeObserver();
    });
});

onUnmounted(() => {
    if (resizeObserver && chartRef.value) {
        resizeObserver.unobserve(chartRef.value);
        resizeObserver.disconnect();
    }
    chartInstance?.dispose();
    chartInstance = null;
});
// 暴露 ECharts 实例给外部使用（方便触发点击事件或导出图片等高级用法）
defineExpose({
    getInstance: () => chartInstance,
});
</script>