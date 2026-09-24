<template>
    <a-modal v-model:open="show" title="选择音乐" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
            <a-form-item label="歌手名称" name="title">
                <a-input v-model:value="queryForm.title" placeholder="请输入歌手名称" style="width: 280px;" />
            </a-form-item>
            <a-form-item label="歌手" name="singer">
                <a-select v-model:value="queryForm.singer" show-search placeholder="请选择演出者" style="width: 100%"
                    :default-active-first-option="false" :show-arrow="false" :filter-option="false"
                    :not-found-content="null" :options="singerOptions" @search="handleSearch"
                    @focus="handleSearch()"></a-select>
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
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="p-2 bg-white rounded flex-1 min-w-[800px]">
                <a-spin tip="加载中..." :spinning="loading">
                    <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination"
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
            </div>
        </a-spin>
        <template #footer>
            <template v-if="!readonly">
                <a-button @click="show = false">取消</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
            </template>
        </template>
    </a-modal>
</template>


<script setup>
import { message } from 'ant-design-vue';
import { getSongList } from "@/request/music/song.js"

const props = defineProps({
    selectedIds: {
        type: Array,
        default: () => []
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

const detailLoading = ref(false)
const confirmLoading = ref(false)
const total = ref(0)

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
    getSongList(queryForm).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}
function submit() {
}



watch(() => show.value, (newVal) => {
    initForm()
    if (newVal && props.id) {
        fetchTableData()
    }
});


function initForm(data = {}) {
    formData.value = {
    }
}

</script>