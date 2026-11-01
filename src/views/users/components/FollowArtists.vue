<template>
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
        </template>
    </a-table>
</template>

<script setup>
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import { Modal, message } from 'ant-design-vue';
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
    }
]);



</script>


<style lang="scss" scoped>
:deep(.ant-tree-treenode) {
    width: 100%;

    .ant-tree-node-content-wrapper {
        flex: 1;
    }
}
</style>