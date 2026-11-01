<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="用户名" name="username">
                <a-input v-model:value="queryForm.username" placeholder="请输入用户名" style="width: 280px;" />
            </a-form-item>
            <a-form-item label="昵称" name="nickname">
                <a-input v-model:value="queryForm.nickname" placeholder="请输入昵称" style="width: 280px;" />
            </a-form-item>
            <a-form-item label="日期范围" name="dateRange">
                <a-range-picker v-model:value="queryForm.dateRange" style="width: 280px;" value-format="YYYY-MM-DD" />
            </a-form-item>
            <a-form-item label="状态" name="enabled">
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
                <a-button type="primary" @click="openEdit(null, false)" v-permission="'edit:appUser:detail'">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增用户</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="['createdAt', 'updatedAt', 'lastLoginTime'].includes(column.key)">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button v-permission="'view:appUser:detail'" type="link" @click="openEdit(record.id, true)"
                                primary>详情</a-button>
                            <a-button v-permission="'edit:appUser:detail'" type="link" @click="openEdit(record.id, false)"
                                primary>编辑</a-button>
                            <a-button v-permission="'delete:appUsers'" type="link" @click="handleDelete(record.id)"
                                danger>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>
    <EditDialog v-model="show" :id="userId" @saveSuccess="fetchTableData" />    
    <DetailDialog v-model="showDetail" :id="userId" @saveSuccess="fetchTableData" />    
</template>

<script setup>
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
import EditDialog from "./editDialog.vue"
import DetailDialog from "./detailDialog.vue"
import { getAppUserList, delAppUser } from "@/request/app/user.js"

const total = ref(0)
const show = ref(false);
const showDetail = ref(false);
const userId = ref(null);
const loading = ref(false)
const formRef = ref(null)
const queryForm = reactive({
    username: '',
    nickname: '',
    dateRange: [],
    enabled: null,
    pageIndex: 1,
    pageSize: 10
});

const dataSource = reactive([]);
const columns = reactive([
    {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: '生日',
        dataIndex: 'birthday',
        key: 'birthday',
    },
    {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
    },
    {
        title: '最后登录时间',
        dataIndex: 'lastLoginTime',
        key: 'lastLoginTime',
    },
    {
        title: '最后登录IP',
        dataIndex: 'lastLoginIp',
        key: 'lastLoginIp',
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
    }
]);


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
    getAppUserList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}


function openAlbumSongs(id) {
    albumId.value = id;
    showSongManagement.value = true;
}


function openEdit(id, detail = false) {
    userId.value = id;
    if (detail) {
        showDetail.value = true;
    } else {
        show.value = true;
    }
}

function handleDelete(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前专辑吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            await delAppUser(id).catch(() => { })
            message.success("删除成功")
            fetchTableData()
        },
        onCancel() {
            console.log('Cancel');
        },
    });

}



function resetFields() {
    formRef.value?.resetFields()
    queryForm.pageIndex = 1;
    queryForm.pageSize = 10;
    fetchTableData()
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