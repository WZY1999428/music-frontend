<template>
    <a-table :dataSource="dataSource" :columns="columns" :scroll="{ x: 1000 }" :pagination="pagination"
        @change="fetchTableData" row-key="id">
        <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'avatar'">
                <a-image :width="36" :height="36" :src="record.avatar"
                    class="rounded object-cover border flex-shrink-0" />
            </template>
            <template v-if="column.key === 'area'">
                {{ getDictName("ARTIST_REGION", record[column.key]) }}
            </template>
            <template v-if="column.key === 'gender'">
                {{ getDictName("ARTIST_GENDER", record[column.key]) }}
            </template>
            <template v-if="['createdAt', 'updatedAt'].includes(column.key)">
                {{ formatDateTime(record[column.key]) }}
            </template>
        </template>
    </a-table>
</template>

<script setup>
import { getUserFavorite } from "@/request/app/user"
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
        title: '歌手别名',
        dataIndex: 'alias',
        key: 'alias',
        width: 200,
    },
    {
        title: '地区',
        dataIndex: 'area',
        key: 'area',
        width: 100,
    },
    {
        title: '性别',
        dataIndex: 'gender',
        key: 'gender',
        width: 100,
    },
    {
        title: '收藏日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
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
    getUserFavorite(queryForm).then(res => {
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