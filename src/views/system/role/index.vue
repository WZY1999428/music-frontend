<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="角色名称" name="name">
                <a-input v-model:value="queryForm.name" placeholder="请输入角色名称 " style="width: 280px;" />
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
        <div class="w-full pb-2 flex justify-end">
            <a-button type="primary" @click="openDialog(null, false)">
                <template #icon>
                    <PlusOutlined />
                </template>新增</a-button>
        </div>
        <a-spin tip="加载中..." :spinning="loading">
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'enabled'">
                        {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                    </template>
                    <template v-if="['createdAt','updatedAt'].includes(column.key)">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'operation'">
                        <a-button type="link" @click="openDialog(record.id, true)" primary>详情</a-button>
                        <a-button type="link" @click="openDialog(record.id, false)" primary>编辑</a-button>
                        <a-button type="link" @click="() => {
                            roleId = record.id;
                            showMemberMgr = true;
                        }" primary>成员管理</a-button>

                        <a-button type="link" @click="() => {
                            roleId = record.id;
                            showPermissions = true;
                        }" primary>分配权限</a-button>

                        <a-popconfirm title="是否删除当前角色?" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                            <a-button type="link" danger>删除</a-button>
                        </a-popconfirm>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </div>
    <editDialog v-model="show" :readonly="readonly" @saveSuccess="fetchTableData" :id="roleId"></editDialog>
    <MemberMgrDialog v-model="showMemberMgr" :id="roleId"></MemberMgrDialog>
    <permissionsDialog v-model="showPermissions" :id="roleId"></permissionsDialog>
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue"
import { getRoleList, delRole } from "@/request/system/role"
import editDialog from "./editDialog.vue";
import permissionsDialog from "./permissionsDialog.vue";

import MemberMgrDialog from "./MemberMgrDialog.vue";

const show = ref(false);
const showMemberMgr = ref(false);
const roleId = ref(null);
const readonly = ref(false);
const loading = ref(false);
const showPermissions = ref(false);
const total = ref(0)
const queryForm = reactive({
    name: '',
    pageIndex: 1,
    pageSize: 10
});


const formRef = ref(null)
const dataSource = reactive([]);
const columns = reactive([
    {
        title: '角色名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
    },
    {
        title: '权重',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: '添加日期',
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
        width: 280,
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
    getRoleList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}

function handleDelete(row) {
    if (row.loading) return;
    row.loading = true;
    delRole(row.id).then(() => {
        fetchTableData()
    }).finally(() => {
        row.loading = false;
    })
}

function resetFields() {
    formRef.value?.resetFields()
    queryForm.pageIndex = 1;
    queryForm.pageSize = 10;
    fetchTableData()
}
</script>