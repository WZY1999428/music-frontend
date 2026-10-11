<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="专辑名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入专辑名称 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="日期范围" name="dateRange">
                <a-range-picker v-model:value="queryForm.dateRange" style="width: 280px;" />
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
                <a-button type="primary" @click="openEdit(null, false)" v-permission="'edit:album:detail'">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增专辑</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'cover'">
                            <a-image :width="36" :height="36" :src="record[column.key]"
                                class="rounded object-cover border flex-shrink-0" />
                        </template>
                        <template v-else-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="column.key === 'genre'">
                            <a-tag color="blue" v-for="genre in record[column.key]" :key="genre">
                                {{ getDictName("MUSIC_GENRE", genre) }}
                            </a-tag>
                        </template>
                        <!-- ALBUM_TYPE -->
                        <template v-else-if="column.key === 'type'">
                            {{ getDictName("ALBUM_TYPE", record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'isHot'">
                            {{ record[column.key] == 1 ? '是' : '否' }}
                        </template>
                        <template v-else-if="column.key === 'releaseDate'">
                            {{ formatDate(record[column.key]) }}
                        </template>
                        <template v-else-if="['createdAt', 'updatedAt'].includes(column.key)">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <!-- view:album:detail -->
                            <a-button v-permission="'view:album:detail'" type="link" @click="openEdit(record.id, true)"
                                primary>详情</a-button>
                            <a-button v-permission="'edit:album:detail'" type="link" @click="openEdit(record.id, false)"
                                primary>编辑</a-button>
                            <a-button v-permission="'album:song:manage'" type="link" @click="openAlbumSongs(record.id)"
                                primary>专辑音乐</a-button>
                            <a-button v-permission="'delete:album'" type="link" @click="handleDelete(record.id)"
                                danger>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>
    <editDialog v-model="show" :id="albumId" :readonly="readonly" @saveSuccess="fetchTableData()"></editDialog>
    <songManagementDialog v-model="showSongManagement" :id="albumId" @saveSuccess="fetchTableData()">
    </songManagementDialog>
</template>

<script setup>


import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
import { getAlbumList, delAlbum } from "@/request/music/album.js"
import editDialog from "./editDialog.vue"
import songManagementDialog from "./songManagement.vue"

const total = ref(0)
const show = ref(false);
const showSongManagement = ref(false);
const albumId = ref(null);
const readonly = ref(false);
const loading = ref(false)
const formRef = ref(null)
const queryForm = reactive({
    albumId: null,
    pageIndex: 1,
    pageSize: 10
});

const dataSource = reactive([]);
const columns = reactive([
    {
        title: '封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 100,
    },
    {
        title: '专辑名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '发行时间',
        dataIndex: 'releaseDate',
        key: 'releaseDate',
    },
    {
        title: '发行公司',
        dataIndex: 'company',
        key: 'company',
    },
    {
        title: '专辑类型',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: '流派/风格',
        dataIndex: 'genre',
        key: 'genre',
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
        width: 280,
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
    getAlbumList(queryForm).then(res => {
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


function openEdit(id, read = false) {
    albumId.value = id;
    readonly.value = read;
    show.value = true;
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
            await delAlbum(id).catch(() => { })
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