<template>
    <a-table :dataSource="dataSource" :columns="columns" :scroll="{ x: 1000 }" :pagination="pagination"
        @change="fetchTableData" row-key="id">
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
const total = ref(0)
const columns = reactive([
    {
        title: '封面',
        dataIndex: 'cover',
        key: 'cover',
        width: 80,
        fixed: 'left',
    },
    {
        title: '歌单名称',
        dataIndex: 'title',
        key: 'title',
        width: 200,
    },
    {
        title: '歌单描述',
        dataIndex: 'description',
        key: 'description',
        width: 200,
        ellipsis: true,
    },
    {
        title: '创建日期',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 180,
    },
    {
        title: '更新日期',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
        width: 180,
    },
]);
const dataSource = reactive([]);
const loading = ref(false)
const props = defineProps({ userId: Number })
const queryForm = reactive({
    userId: props.userId,
    type: "playlist",
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
