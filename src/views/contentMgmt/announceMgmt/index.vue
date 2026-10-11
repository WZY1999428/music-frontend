<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="菜单名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入菜单名称 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="菜单地址" name="path">
                <a-input v-model:value="queryForm.path" placeholder="请输入菜单地址 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="菜单状态" name="enabled">
                <a-select v-model:value="queryForm.enabled" placeholder="请选择菜单状态" style="width: 280px;">
                    <a-select-option :value="1">启用</a-select-option>
                    <a-select-option :value="0">禁用</a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item>
                <div class="flex gap-2 ">
                    <a-button type="primary" @click="resetFields">重置</a-button>
                    <a-button type="primary" html-type="submit">搜索</a-button>
                </div>
            </a-form-item>
        </a-form>
    </div>
    <div class="mt-2 p-2  bg-white rounded">
        <div class="p-2 bg-white rounded flex-1 min-w-[800px]">
            <div class="w-full pb-2 flex justify-end">
                <a-button type="primary" @click="openDialog(null, false)" v-permission="'edit:announceMgmt:detail'">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增公告</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'type'">
                            {{ getDictName('NOTICE_TYPE', record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="column.key === 'startTime'">
                            {{ formatDateTime(record.startTime) }} ~ {{ formatDateTime(record.endTime) }}
                        </template>
                        <template v-if="['createdAt', 'updatedAt'].includes(column.key)">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button v-permission="'view:announceMgmt:detail'" @click="openDialog(record.id, true)"
                                type="link" primary>详情</a-button>
                            <a-button v-permission="'edit:announceMgmt:detail'" @click="openDialog(record.id, false)"
                                type="link" primary>编辑</a-button>
                            <a-button v-permission="'delete:announceMgmt'" type="link" @click="handleDelete(record.id)"
                                danger>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>
    <editDialog :id="announceId" v-model="show" :readonly="readonly"></editDialog>

</template>

<script setup>
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import editDialog from "./editDialog.vue"
import { Modal, message } from 'ant-design-vue';
import { getannounceMgmtList, delAnnounceMgmt } from "@/request/contentMgmt/announceMgmt.js"

const readonly = ref(false);
const loading = ref(false);
const show = ref(false);
const total = ref(0)
const queryForm = reactive({
    deptId: null,
    pageIndex: 1,
    pageSize: 10
});

const announceId = ref(null)
const dataSource = reactive([]);
const columns = reactive([
    {
        title: '公告名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '发布人',
        dataIndex: 'createUser',
        key: 'createUser',
    },
    {
        title: '有效期',
        dataIndex: 'startTime',
        key: 'startTime',
    },
    {
        title: '发布类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '发布日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '更新日期',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 220,
    },
])

const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));

fetchTableData()
function fetchTableData({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getannounceMgmtList(queryForm).then(res => {
        console.log(res);
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}




function openDialog(id, read) {
    announceId.value = id;
    readonly.value = read;
    show.value = true;
}

const confirmLoading = ref(false)
function handleDelete(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前部门吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            try {
                await delAnnounceMgmt(id);
                message.success("删除成功")
                fetchTableData()
            } catch (error) {

            }
        },
        onCancel() {
            console.log('Cancel');
        },
    });

}




</script>


<style lang="scss" scoped>
:deep(.ant-tree-treenode) {
    width: 100%;

    .ant-tree-node-content-wrapper {
        flex: 1;
    }
}
</style>