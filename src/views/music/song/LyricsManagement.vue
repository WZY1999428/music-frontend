<template>
    <a-modal v-model:open="show" title="歌单音乐管理" :confirmLoading="confirmLoading" :width="1200" destroyOnClose
        :footer="null">
        <a-spin tip=" 加载中..." :spinning="loading">
            <div class="py-2 flex gap-2">
                <a-button type="primary" @click="editLyrics(null)">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新增歌词</a-button>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchSongList"
                row-key="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'createdAt' || column.key === 'updatedAt'">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                    <template v-if="column.key === 'lang'">
                        {{ getDictName('LYRICS_LANGUAGE', record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-button type="link" @click="editLyrics(record.id)">编辑</a-button>
                        <a-button type="link" danger @click="removeLyrics(record.id)">移除</a-button>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </a-modal>
    <EditLyricsDialog v-model="editLyricsDialogShow" :id="lyricsId" :songId="props.id"></EditLyricsDialog>
</template>

<script setup>
import { getLyricsList, delLyrics } from "@/request/music/song.js"
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import EditLyricsDialog from "./editLyricsDialog.vue"
import { message, Modal } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const total = ref(0)

const queryForm = reactive({
    pageIndex: 1,
    pageSize: 10,
})

const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));
const emits = defineEmits(["saveSuccess"])

const loading = ref(false)
const dataSource = reactive([])
const confirmLoading = ref(false)
const editLyricsDialogShow = ref(false)
const lyricsId = ref(null)


const columns = reactive([
    {
        title: '歌词名称',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: '排序',
        dataIndex: 'sort',
        key: 'sort',
    },
    {
        title: '语言',
        dataIndex: 'lang',
        key: 'lang',
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
    {
        title: '更新时间',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 180,
    },
]);


function fetchSongList({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getLyricsList({ songId: props.id, ...queryForm }).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}

function editLyrics(id) {
    lyricsId.value = id;
    editLyricsDialogShow.value = true;
}


function removeLyrics(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前歌词吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            await delLyrics(id).then(_ => {
                message.success("删除成功")
            }).catch(() => { })
            fetchSongList()
        },
        onCancel() {
            console.log('Cancel');
        },
    });

}

watch(() => show.value, (newVal) => {
    if (newVal) {
        fetchSongList()
    }
});

</script>