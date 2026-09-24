<template>
    <div class="p-4 bg-white rounded-lg shadow-sm">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="文件名称" name="filename">
                <a-input v-model:value="queryForm.filename" placeholder="请输入文件名称" style="width: 220px;" allow-clear />
            </a-form-item>
            <a-form-item label="上传日期" name="dateRange">
                <a-range-picker v-model:value="queryForm.dateRange" :placeholder="['开始时间', '结束时间']"
                    valueFormat="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item>
                <div class="flex gap-2">
                    <a-button type="primary" html-type="submit">
                        <template #icon>
                            <SearchOutlined />
                        </template>
                        搜索
                    </a-button>
                    <a-button @click="resetFields">
                        <template #icon>
                            <ReloadOutlined />
                        </template>
                        重置
                    </a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>

    <div class="mt-4 p-4 bg-white rounded-lg shadow-sm">
        <a-spin tip="加载中..." :spinning="loading">
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                size="middle">
                <template #bodyCell="{ column, record }">
                    <!-- 1. 预览/文件名：带缩略图或类型图标 -->
                    <template v-if="column.key === 'filename'">
                        <div class="flex items-center gap-2">
                            <!-- 图片显示微型预览，非图片显示对应图标 -->
                            <a-image v-if="record.mimeType?.startsWith('image/')" :width="36" :height="36"
                                :src="record.url" class="rounded object-cover border flex-shrink-0" />
                            <FileImageOutlined v-else-if="record.mimeType?.startsWith('image/')"
                                class="text-xl text-blue-500" />
                            <FilePdfOutlined v-else-if="record.mimeType?.includes('pdf')"
                                class="text-xl text-red-500" />
                            <FileTextOutlined v-else class="text-xl text-gray-400" />

                            <span class="truncate font-medium" :title="record.filename">{{ record.filename }}</span>
                        </div>
                    </template>

                    <!-- 3. 文件类型：彩色 Tag -->
                    <template v-else-if="column.key === 'mimeType'">
                        <a-tag :color="getTagColor(record.mimeType)">
                            {{ record.mimeType?.split('/')[1] || record.mimeType }}
                        </a-tag>
                    </template>

                    <!-- 4. 时间格式化 -->
                    <template v-else-if="column.key === 'createdAt'">
                        <span class="text-gray-500">{{ formatDateTime(record[column.key]) }}</span>
                    </template>

                    <!-- 5. 文件大小 -->
                    <template v-else-if="column.key === 'size'">
                        <span class="text-gray-600">{{ formatFileSize(record[column.key]) }}</span>
                    </template>

                    <!-- 6. 操作按钮：带 Icon -->
                    <template v-else-if="column.key === 'operation'">
                        <div class="flex items-center gap-1">
                            <a-button type="link" size="small" @click="downloadFile(record)">
                                <template #icon>
                                    <DownloadOutlined />
                                </template>
                                下载
                            </a-button>
                            <a-popconfirm title="确定要删除该文件吗？" @confirm="handleDelete(record)">
                                <a-button type="link" danger size="small">
                                    <template #icon>
                                        <DeleteOutlined />
                                    </template>
                                    删除
                                </a-button>
                            </a-popconfirm>
                        </div>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </div>
</template>

<script setup>
import {
    ExclamationCircleOutlined,
    SearchOutlined,
    ReloadOutlined,
    DownloadOutlined,
    DeleteOutlined,
    FileImageOutlined,
    FilePdfOutlined,
    FileTextOutlined
} from '@ant-design/icons-vue';
import { getUploadFiles, delUploadFiles } from "@/request/upload"
import { Modal, message } from 'ant-design-vue';
const show = ref(false);
const readonly = ref(false);
const loading = ref(false);
const total = ref(0)

const queryForm = reactive({
    filename: '',
    dateRange: [],
    pageIndex: 1,
    pageSize: 10
});


const formRef = ref(null)
const dataSource = reactive([]);
const columns = reactive([

    {
        title: '文件名',
        dataIndex: 'filename',
        key: 'filename',
    },
    {
        title: '上传前名称',
        dataIndex: 'originalName',
        key: 'originalName',
    },
    {
        title: '上传人',
        dataIndex: 'nickname',
        key: 'nickname',
        width: 180,
    },
    {
        title: '文件地址',
        dataIndex: 'url',
        key: 'url',
    },
    {
        title: '文件类型',
        dataIndex: 'mimeType',
        key: 'mimeType',
        width: 140,
    },
    {
        title: '文件大小',
        dataIndex: 'size',
        key: 'size',
        width: 140,
    },
    {
        title: '上传时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 180,
    },
])


const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));

function openDialog(id, read) {
    roleId.value = id;
    readonly.value = read;
    show.value = true;
}

fetchTableData()
function fetchTableData({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getUploadFiles(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}

const getTagColor = (mimeType = '') => {
    if (mimeType.includes('image')) return 'blue';
    if (mimeType.includes('pdf')) return 'red';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'cyan';
    if (mimeType.includes('zip') || mimeType.includes('compressed')) return 'orange';
    return 'default';
};

function handleDelete(row) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除这个文件吗？',
        onOk: async () => {
            try {
                await delUploadFiles(row.id);
                message.success('删除成功');
                fetchTableData();
            } catch (error) {
                console.error(error);
            }
        },
    });
}

function downloadFile(row) {
    // 下载文件
    const link = document.createElement('a');
    link.href = row.url;
    link.download = row.filename;
    link.click();
}

function resetFields() {
    formRef.value?.resetFields()
    queryForm.pageIndex = 1;
    queryForm.pageSize = 10;
    fetchTableData()
}
</script>