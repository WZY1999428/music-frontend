<template>
 <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData"
     row-key="id">
     <template #bodyCell="{ column, record }">
         <template v-if="column.key === 'cover'">
             <a-image :width="36" :height="36" :src="record[column.key]"
                 class="rounded object-cover border flex-shrink-0" />
         </template>
         <template v-else-if="['createdAt', 'updatedAt'].includes(column.key)">
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

const total = ref(0)
const loading = ref(false)
const props = defineProps({ userId: Number })
const queryForm = reactive({
    userId: props.userId,
    type: "album",
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