<template>
    <div class="w-full h-full flex gap-2">
        <div class="bg-white rounded p-2  h-full" style="width: 300px;">
            <div class="flex  gap-2">
                <a-input-search v-model:value="searchValue" style="margin-bottom: 8px" placeholder="搜索部门" />
                <a-button type="primary" @click="openDialog(null, false)">
                    <template #icon>
                        <PlusOutlined />
                    </template></a-button>
            </div>
            <a-tree :tree-data="filteredTreeData" :field-names="{
                title: 'deptName',
                key: 'id',
                children: 'children'
            }">
                <template #title="{ deptName, id }">
                    <div class="flex items-center justify-between group w-full">
                        <span class="flex-1 block overflow-hidden text-ellipsis" @click="() => {
                            queryForm.deptId = id;
                            fetchTableData();
                        }">{{ deptName }}</span>
                        <div class="ml-4 hidden group-hover:flex items-center gap-3 ">
                            <EditOutlined class="cursor-pointer" @click.stop="openDialog(id)" />
                            <DeleteOutlined class="cursor-pointer" @click.stop="handleDelete(id)" style="color: red" />
                        </div>
                    </div>
                </template>
            </a-tree>
        </div>

        <div class="p-2 bg-white rounded flex-1 min-w-[800px]" v-if="queryForm.deptId">
            <div class="w-full pb-2 flex justify-end">
                <a-button v-permission="'add:dept:user'" type="primary" @click="showAddUsers = true">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增成员</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'avatar'">
                            <a-avatar :src="record[column.key]" />
                        </template>
                        <template v-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="column.key === 'updatedAt'">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button v-permission="'view:dept:user'" type="link" @click="() => {
                                userId = record.id;
                                showUserEdit = true;
                            }" primary>详情</a-button>
                            <a-popconfirm title="是否删除当前部门用户?" ok-text="确定" cancel-text="取消"
                                @confirm="handleDeleteUser(record)">
                                <a-button type="link" v-permission="'delete:dept:user'" danger>删除</a-button>
                            </a-popconfirm>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>

    <editDialog v-model="show" :readonly="readonly" @saveSuccess="fetchDeptData" :id="deptId">
    </editDialog>
    <addUsersDialog v-model="showAddUsers" @saveSuccess="fetchTableData" :deptId="queryForm.deptId"></addUsersDialog>
    <userEditDialog v-model="showUserEdit" :id="userId" :readonly="true"></userEditDialog>

</template>

<script setup>
import { PlusOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal } from 'ant-design-vue';
import { getDeptList, delDept, getDeptusers, delDeptUser } from "@/request/system/dept"
import editDialog from "./editDialog.vue";

import addUsersDialog from "./addUsersDialog.vue";
import userEditDialog from "../user/editDialog.vue";
const show = ref(false);
const showAddUsers = ref(false);
const showUserEdit = ref(false);
const userId = ref(null);
const searchValue = ref("");
const readonly = ref(false);
const loading = ref(false);
const total = ref(0)
const queryForm = reactive({
    deptId: null,
    pageIndex: 1,
    pageSize: 10
});

const deptId = ref(null)
const dataSource = reactive([]);
const treeData = reactive([]);
const columns = reactive([
    {
        title: '成员头像',
        dataIndex: 'avatar',
        key: 'avatar',
    },
    {
        title: '成员账户',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '成员昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '成员邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '用户状态',
        dataIndex: 'enabled',
        key: 'enabled',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 220,
    },
])

const filteredTreeData = computed(() => {
    const keyword = searchValue.value.trim().toLowerCase();
    if (!keyword) {
        return treeData;    
    }
    const filterTree = (nodes) => {
        return nodes.reduce((result, node) => {
            const children = node.children ? filterTree(node.children) : [];
            const matched = node.deptName?.toLowerCase().includes(keyword);
            // 当前节点匹配，或者子节点匹配，都保留
            if (matched || children.length) {
                result.push({ ...node, children, });
            }

            return result;
        }, []);
    };

    return filterTree(treeData);
});

const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));


fetchDeptData()


function fetchTableData({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getDeptusers(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}


function fetchDeptData() {
    getDeptList().then(res => {
        treeData.splice(0, treeData.length, ...res.list)
        if (treeData.length > 0) {
            queryForm.deptId = treeData[0].id
            fetchTableData()
        }
    })
}



function openDialog(id, read) {
    deptId.value = id;
    readonly.value = read;
    show.value = true;
}

const confirmLoading = ref(false)
function handleDelete(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前部门吗',
        confirmLoading: confirmLoading.value,
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
            confirmLoading.value = true;
            delDept(id).then(() => {
                fetchDeptData()
            }).finally(() => {
                confirmLoading.value = false;
            })
        },
        onCancel() {
            console.log('Cancel');
        },
    });

}


function handleDeleteUser(row) {
    row.loading = true;
    delDeptUser({ userId: row.id, deptId: queryForm.deptId }).then(() => {
        fetchDeptData()
    }).finally(() => {
        row.loading = false;
    })
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