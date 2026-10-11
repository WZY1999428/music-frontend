<template>
    <a-modal v-model:open="show" title="日志详情" :width="900" destroyOnClose :footer="null">
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-descriptions v-if="detail" :column="2" bordered size="small">
                <!-- 操作主体 -->
                <a-descriptions-item label="操作人">
                    {{ detail.username || '-' }}
                </a-descriptions-item>

                <a-descriptions-item label="昵称">
                    {{ detail.nickname || '-' }}
                </a-descriptions-item>

                <a-descriptions-item label="用户 ID">
                    {{ detail.userId ?? '-' }}
                </a-descriptions-item>

                <a-descriptions-item label="角色 / 部门">
                    {{ detail.roleName || '-' }}
                </a-descriptions-item>

                <!-- 行为 -->
                <a-descriptions-item label="操作">
                    {{ detail.action || '-' }}
                </a-descriptions-item>

                <a-descriptions-item label="日志类型">
                    <a-tag v-if="detail.logType">
                        {{ detail.logType }}
                    </a-tag>
                    <span v-else>-</span>
                </a-descriptions-item>

                <!-- 请求 -->
                <a-descriptions-item label="请求方法">
                    <a-tag v-if="detail.method" :color="methodColor(detail.method)">
                        {{ detail.method }}
                    </a-tag>
                    <span v-else>-</span>
                </a-descriptions-item>

                <a-descriptions-item label="状态码">
                    <a-tag :color="statusColor(detail.status)">
                        {{ detail.status ?? '-' }}
                    </a-tag>
                </a-descriptions-item>

                <a-descriptions-item label="请求地址" :span="2">
                    <a-typography-text copyable>
                        {{ detail.requestUrl || '-' }}
                    </a-typography-text>
                </a-descriptions-item>

                <a-descriptions-item label="IP 地址">
                    {{ detail.ip || '-' }}
                </a-descriptions-item>

                <a-descriptions-item label="执行耗时">
                    {{ detail.executionTime ?? 0 }} ms
                </a-descriptions-item>

                <a-descriptions-item label="User Agent" :span="2">
                    <a-typography-text>
                        {{ detail.userAgent || '-' }}
                    </a-typography-text>
                </a-descriptions-item>

                <!-- 请求参数 -->
                <a-descriptions-item label="请求参数" :span="2">
                    <pre v-if="detail.reqParams"
                        class="max-h-[240px] overflow-auto whitespace-pre-wrap break-all rounded bg-gray-50 p-3 text-xs">{{ formatJson(detail.reqParams) }}</pre>
                    <span v-else>-</span>
                </a-descriptions-item>

                <!-- 响应 -->
                <a-descriptions-item label="响应结果" :span="2">
                    <pre v-if="detail.resBody"
                        class="max-h-[300px] overflow-auto whitespace-pre-wrap break-all rounded bg-gray-50 p-3 text-xs">{{ formatJson(detail.resBody) }}</pre>
                    <span v-else>-</span>
                </a-descriptions-item>

                <!-- 异常 -->
                <a-descriptions-item v-if="detail.errorMessage" label="异常信息" :span="2">
                    <a-alert type="error" :message="detail.errorMessage" />
                </a-descriptions-item>

                <!-- 时间 -->
                <a-descriptions-item label="访问日期">
                    {{ formatDateTime(detail.createdAt) }}
                </a-descriptions-item>
            </a-descriptions>

            <a-empty v-else-if="!detailLoading" description="暂无日志详情" />
        </a-spin>
    </a-modal>
</template>

<script setup>
import { ref, watch } from "vue";
import { getLoggerDetail } from "@/request/system/logger";

const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
});


const show = defineModel({
    type: Boolean,
    default: false
});
const detail = ref(null);
const detailLoading = ref(false);

function fetchLogInfo() {
    detailLoading.value = true;
    getLoggerDetail(props.id)
        .then(res => {
            detail.value = res;
        })
        .finally(() => {
            detailLoading.value = false;
        });
}

function formatJson(value) {
    if (!value) return "-";

    try {
        const data = typeof value === "string"
            ? JSON.parse(value)
            : value;
        return JSON.stringify(data, null, 2);
    } catch {
        return String(value);
    }
}

function methodColor(method) {
    const colors = {
        GET: "blue",
        POST: "green",
        PUT: "orange",
        PATCH: "orange",
        DELETE: "red"
    };

    return colors[method] || "default";
}

function statusColor(status) {
    if (!status) return "default";

    if (status >= 200 && status < 300) {
        return "green";
    }

    if (status >= 400 && status < 500) {
        return "orange";
    }

    if (status >= 500) {
        return "red";
    }

    return "default";
}

watch(() => show.value, value => {
    if (value && props.id) {
        detail.value = null;
        fetchLogInfo();
    }
},
    { immediate: true }
);
</script>
