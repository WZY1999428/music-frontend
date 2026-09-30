<template>
    <a-modal v-model:open="show" title="选择音乐" :width="1000" destroyOnClose>
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="歌手名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入歌手名称" />
            </a-form-item>
            <a-form-item label="歌曲名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入歌曲名称" />
            </a-form-item>
            <a-form-item>
                <div class="flex gap-2 ">
                    <a-button type="primary" @click="resetFields">重置</a-button>
                    <a-button type="primary" html-type="fetchTableData">搜索</a-button>
                </div>
            </a-form-item>
        </a-form>
        <div class="h-[10px]"></div>
        <a-spin tip="加载中..." :spinning="loading">
            <a-table :dataSource="dataSource" :columns="columns" :rowSelection="rowSelection" :pagination="pagination"
                @change="fetchTableData" row-key="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'cover'">
                        <a-image :width="36" :height="36" :src="record[column.key]"
                            class="rounded object-cover border flex-shrink-0" />
                    </template>
                    <template v-else-if="column.key === 'createdAt' || column.key === 'updatedAt'">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'publishDate'">
                        {{ formatDate(record[column.key]) }}
                    </template>
                </template>
            </a-table>
        </a-spin>
        <template #footer>
            <a-button :loading="confirmLoading" @click="show = false">取消</a-button>
            <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
        </template>
    </a-modal>
</template>


<script setup>
import { getAlbumSongList } from "@/request/music/song.js"

const props = defineProps({
    albumId: {
        type: [String, Number]
    },
    playlistId: {
        type: [String, Number]
    },
    selectedSave: {
        type: Function,
    }
})

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
]);


const show = defineModel({ type: Boolean, default: false })

const formData = ref({})

const emits = defineEmits(["saveSuccess"])
const songIds = ref([])
const loading = ref(false)
const confirmLoading = ref(false)
const total = ref(0)
const rowSelection = {
    onChange: (keys) => songIds.value = keys,
    selectedRowKeys: songIds
}

const queryForm = reactive({
    title: "",
    singer: "",
    pageIndex: 1,
    pageSize: 10
});

const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));

function fetchTableData({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getAlbumSongList({ ...queryForm, albumId: props.albumId, playlistId: props.playlistId }).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}


async function submit() {
    if (props.selectedSave) {
        confirmLoading.value = true
        await props.selectedSave(songIds.value)
        confirmLoading.value = false
        show.value = false;
    }
}


watch(() => show.value, (newVal) => {
    resetFields()
    if (newVal) {
       
        fetchTableData()
    }
});


function resetFields(data = {}) {
    formData.value = {
    }
     songIds.value = []
}

</script>