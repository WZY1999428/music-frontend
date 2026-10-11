<template>
    <div class="p-4 bg-white rounded">
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="歌曲名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入专辑名称 " style="width: 280px;" />
            </a-form-item>
            <a-form-item label="歌手名称" name="artist">
                <a-input v-model:value="queryForm.artist" placeholder="请输入专辑名称 " style="width: 280px;" />
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
    <div class="p-4 mt-2 bg-white rounded">
        <div class="p-2 bg-white rounded flex-1 min-w-[800px]">
            <div class="w-full pb-2 flex justify-end" v-permission="'edit:song:detail'">
                <a-button type="primary" @click="openEidt(null, false)">
                    <template #icon>
                        <PlusOutlined />
                    </template>新增歌曲</a-button>
            </div>
            <a-spin tip="加载中..." :spinning="loading">
                <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
                    row-key="id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.key === 'cover'">
                            <a-image :width="36" :height="36" :src="record[column.key]"
                                class="rounded object-cover border flex-shrink-0" />
                        </template>
                        <template v-else-if="column.key === 'artistList'">
                            <div class="flex flex-wrap gap-2">
                                <a-tag v-for="artist in record[column.key]" :key="artist.id" color="blue">
                                    {{ artist.name }}
                                </a-tag>
                            </div>
                        </template>
                        <template v-else-if="column.key === 'enabled'">
                            {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                        </template>
                        <template v-else-if="column.key === 'createdAt' || column.key === 'updatedAt'">
                            {{ formatDateTime(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'publishDate'">
                            {{ formatDate(record[column.key]) }}
                        </template>
                        <template v-else-if="column.key === 'operation'">
                            <a-button v-permission="'view:song:detail'" type="link" @click="openEidt(record.id, true)"
                                primary>详情</a-button>
                            <a-button v-permission="'edit:song:detail'" type="link" @click="openEidt(record.id, false)"
                                primary>编辑</a-button>
                            <a-button v-permission="'edit:song:lyrics'" type="link"
                                @click="openLyricsManagement(record.id)" primary>歌词管理</a-button>
                            <a-button v-permission="'delete:song'" type="link" @click="handleDelete(record.id)"
                                danger>删除</a-button>
                        </template>
                    </template>
                </a-table>
            </a-spin>
        </div>
    </div>
    <editDialog v-model="show" :id="songId" :readonly="readonly" @saveSuccess="fetchTableData()"></editDialog>
    <LyricsManagement v-model="lyricsManagementShow" :id="songId"></LyricsManagement>
</template>

<script setup>


import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
import { getSongList, delSong, } from "@/request/music/song.js"
import editDialog from "./editDialog.vue"
import LyricsManagement from "./LyricsManagement.vue"

const total = ref(0)
const show = ref(false);
const readonly = ref(false);
const loading = ref(false)
const lyricsManagementShow = ref(false)
const formRef = ref(null)
const queryForm = reactive({
    artist: null,
    title: null,
    songId: null,
    pageIndex: 1,
    pageSize: 10
});

const songId = ref(null)
const dataSource = reactive([]);
const columns = reactive([
    {
        title: '歌曲封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 100,
    },
    {
        title: '歌曲名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '歌手',
        dataIndex: 'artistList',
        key: 'artistList',
    },
    {
        title: '歌曲发布日期',
        dataIndex: 'publishDate',
        key: 'publishDate',
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
    getSongList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}


function openEidt(id, read) {
    songId.value = id;
    readonly.value = read;
    show.value = true;
}

function openLyricsManagement(id) {
    // TODO: 跳转到歌词管理页面
    songId.value = id;
    lyricsManagementShow.value = true;
    console.log('打开歌词管理', id);
}

function handleDelete(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前歌曲吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            await delSong(id).then(_ => {
                message.success("删除成功")
                fetchTableData()
            }).catch(() => { })
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