<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="歌手名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入菜单名称 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="歌手地区" name="path">
                <a-input v-model:value="queryForm.path" placeholder="请输入菜单地址 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="日期范围" name="path">
                <a-input v-model:value="queryForm.path" placeholder="请输入菜单地址 " style="width: 280px;" />
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
                <a-button v-permission="'edit:artist:detail'" type="primary" @click="openEidt(null, false)">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增歌手</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'avatar'">
                            <a-image :width="36" :height="36" :src="record.avatar"
                                class="rounded object-cover border flex-shrink-0" />
                        </template>
                        <template v-else-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="column.key === 'area'">
                            {{ getDictName("ARTIST_REGION", record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'gender'">
                            {{ getDictName("ARTIST_GENDER", record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'isHot'">
                            {{ record[column.key] == 1 ? '是' : '否' }}
                        </template>
                        <template v-if="['createdAt', 'updatedAt'].includes(column.key)">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button v-permission="'view:artist:detail'" type="link" @click="openEidt(record.id, true)"
                                primary>详情</a-button>
                            <a-button v-permission="'edit:artist:detail'" type="link"
                                @click="openEidt(record.id, false)" primary>编辑</a-button>
                            <a-button v-permission="'delete:artist'" type="link" @click="handleDelete(record.id)"
                                danger>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>
    <editDialog v-model="show" :id="agreementsId" :readonly="readonly" @saveSuccess="fetchTableData()"></editDialog>
</template>

<script setup>


import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
import { getArtistList, delArtist } from "@/request/music/artist.js"
import editDialog from "./editDialog.vue"
const total = ref(0)
const show = ref(false);
const readonly = ref(false);
const loading = ref(false)
const formRef = ref(null)
const queryForm = reactive({
    agreementsId: null,
    pageIndex: 1,
    pageSize: 10
});

const agreementsId = ref(null)
const dataSource = reactive([]);
const columns = reactive([
    {
        title: '歌手头像',
        dataIndex: 'avatar',
        key: 'avatar',
        width: 100,
    },
    {
        title: '歌手名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '地区',
        dataIndex: 'area',
        key: 'area',
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: '热门歌手',
        dataIndex: 'isHot',
        key: 'isHot',
    },
    {
        title: '创建人',
        dataIndex: 'createUser',
        key: 'createUser',
    },
    {
        title: '创建日期',
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
    getArtistList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}


function openEidt(id, read) {
    agreementsId.value = id;
    readonly.value = read;
    show.value = true;
}

function handleDelete(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前协议吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            await delArtist(id).catch(() => { })
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