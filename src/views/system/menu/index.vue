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
        <div class="w-full pb-2 flex justify-end">
            <a-button type="primary" @click="openDialog(null, false, false)" v-permission="'edit:menu:detail'">
                <template #icon>
                    <PlusOutlined />
                </template>新增</a-button>
        </div>
        <a-spin tip="加载中..." :spinning="loading">
            <a-table row-key="id" :dataSource="dataSource" :columns="columns" :pagination="pagination"
                @change="fetchTableData">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'enabled'">
                        {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                    </template>
                    <template v-else-if="column.key === 'icon' && checkIcon(record.icon)">
                        <component :is="getAntDesignIcon(record[column.key])" />
                    </template>
                    <template v-else-if="['createdAt', 'updatedAt'].includes(column.key)">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'operation'">
                        <a-button v-permission="'view:menu:detail'" type="link" @click="openDialog(record, true, false)" primary>详情</a-button>
                        <a-button v-permission="'edit:menu:detail'" type="link" @click="openDialog(record, false, false)" primary>编辑</a-button>
                        <a-button v-permission="'copy:menu:detail'" type="link" @click="openDialog(record, false, true)" primary>复制</a-button>
                        <a-button v-permission="'add:children:menu'" type="link" v-if="record.type == 0" @click="addChild(record)" primary>新增子菜单</a-button>
                        <a-popconfirm title="是否删除当前菜单吗?" ok-text="确定" cancel-text="取消" @confirm="handleDelete(record)">
                            <a-button type="link" v-permission="'delete:menu'" danger>删除</a-button>
                        </a-popconfirm>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </div>
    <editDialog v-model="show" @saveSuccess="fetchTableData" :parentId="params.parentId" :readonly="params.readonly"
        :id="params.menuId" :isCopy="params.isCopy">
    </editDialog>
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue"
import editDialog from "./editDialog.vue";
import { getMenuList, deleteMenu } from "@/request/system/menu"

const params = ref({
    menuId: null,
    readonly: false,
    parentId: null,
    isCopy: false,
})

const show = ref(false);
const loading = ref(false);
const total = ref(0);

const queryForm = reactive({
    title: '',
    path: '',
    enabled: null,
    pageIndex: 1,
    pageSize: 10
});


const formRef = ref(null)
const dataSource = reactive([]);
const columns = reactive([
    {
        title: '菜单名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '菜单地址',
        dataIndex: 'path',
        key: 'path',
    },
    {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
    },
    {
        title: '状态',
        dataIndex: 'enabled',
        key: 'enabled',
    },
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 220
    }
])

const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));

function openDialog(row, read, cp) {
    params.value = {
        menuId: row?.id,
        parentId: row?.parentId || 0,
        readonly: read,
        isCopy: cp,
    }
    show.value = true;
}

function addChild(row) {
    params.value = {
        menuId: null,
        parentId: row?.id || 0,
        readonly: false,
        isCopy: false,
    }
    show.value = true;
}

fetchTableData()

function fetchTableData({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getMenuList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}

function handleDelete(row) {
    if (row.loading) return;
    row.loading = true;
    deleteMenu(row.id).then(() => {
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