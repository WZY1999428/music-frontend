<template>
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
        </template>
    </a-table>
</template>

<script setup>
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
const total = ref(0)
const formRef = ref(null)
const queryForm = reactive({
    playlistId: null,
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
        title: '歌单名称',
        dataIndex: 'title',
        key: 'title',
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
</script>
