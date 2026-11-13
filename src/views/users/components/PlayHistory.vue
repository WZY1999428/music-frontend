<template>
    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
        :scroll="{ x: 1100, }" row-key="id">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'cover'">
                <a-image :width="36" :height="36" :src="record[column.key]"
                    class="rounded object-cover border flex-shrink-0" />
            </template>
            <template v-else-if="column.key === 'artists'">
                <div class="flex flex-wrap gap-2">
                    <a-tag v-for="artist in record[column.key]" :key="artist.id" color="blue">
                        {{ artist.artistName }}
                    </a-tag>
                </div>
            </template>
            <template v-else-if="column.key === 'enabled'">
                {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
            </template>
            <template v-else-if="column.key === 'createdAt' || column.key === 'lastPlayedAt'">
                {{ formatDateTime(record[column.key]) }}
            </template>
            <template v-else-if="column.key === 'publishDate'">
                {{ formatDate(record[column.key]) }}
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { getUserPlayHistory } from "@/request/app/user"
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
        dataIndex: 'artists',
        key: 'artists',
        width: 200,
    },
    {
        title: '播放次数',
        dataIndex: 'playCount',
        key: 'playCount',
        width:100,
    },
    {
        title: '歌曲发布日期',
        dataIndex: 'publishDate',
        key: 'publishDate',
        width: 200,
    },
    {
        title: '最后播放日期',
        dataIndex: 'lastPlayedAt',
        key: 'lastPlayedAt',
        width: 200,
    },
]); 
const total = ref(0)
const loading = ref(false)
const props = defineProps({ userId: Number })
const queryForm = reactive({
    userId: props.userId,
    type: "artist",
    pageIndex: 1,
    pageSize: 10
});
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
    getUserPlayHistory(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total
    }).finally(() => loading.value = false)
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