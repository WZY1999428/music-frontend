<template>
    <a-modal v-model:open="show" title="专辑音乐管理" :confirmLoading="confirmLoading" :width="1200" destroyOnClose
        :footer="null">
        <div class="pb-4">
            <a-form layout="inline" ref="formRef" :model="queryForm" @finish="fetchSongList()">
                <a-form-item title="歌曲名称" name="title">
                    <a-input v-model:value="queryForm.title" placeholder="请输入歌曲名称" />
                </a-form-item>
                <a-form-item title="歌曲作者" name="artist">
                    <a-input v-model:value="queryForm.artist" placeholder="请输入歌曲作者" />
                </a-form-item>
                <a-form-item>
                    <div class="flex gap-4">
                        <a-button type="primary" html-type="submit">搜索</a-button>
                        <a-button type="default" @click="resetForm">重置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>

        <a-spin tip=" 加载中..." :spinning="loading">
            <div class="py-2 flex gap-2">
                <a-button type="primary" @click="selectSongDialogOpen = true">
                    <template #icon>
                        <PlusOutlined />
                    </template>
                    新增歌曲</a-button>
            </div>
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchSongList"
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
                    <template v-else-if="column.key === 'publishDate'">
                        {{ formatDate(record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'createdAt' || column.key === 'updatedAt'">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                    <template v-else-if="column.key === 'action'">
                        <a-button type="link" danger @click="removeSong(record.id)">移除</a-button>
                    </template>
                </template>
            </a-table>
        </a-spin>
    </a-modal>
    <SelectSongDialog v-model="selectSongDialogOpen" :selectedSave="selectedSave" :albumId="id"></SelectSongDialog>
</template>


<script setup>
import { saveAlbumSong, getAlbumSongList, removeAlbumSong } from "@/request/music/album.js"
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons-vue"
import SelectSongDialog from "@/components/selectSongDialog/index.vue"
import { message, Modal } from 'ant-design-vue';
import { nextTick } from "vue";
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const formRef = ref({})
const selectSongDialogOpen = ref(false)
const total = ref(0)

const queryForm = reactive({
    artist: "",
    title: "",
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
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100,
    },
]);

function selectedSave(songIds) {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveAlbumSong({ albumId: props.id, songIds }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchSongList({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize;
    loading.value = true;
    getAlbumSongList(props.id).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        loading.value = false;
    })
}



function removeSong(id) {
    Modal.confirm({
        title: '提示?',
        icon: h(ExclamationCircleOutlined),
        content: '确定要删除当前歌曲吗',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
            await removeAlbumSong({ albumId: props.id, songIds: [id] }).then(_ => {
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
        resetForm()
        if (props.id) {
            // TODO: 获取专辑歌曲列表
        }
    }
});

const resetForm = () => {
    nextTick(() => {
        formRef.value.resetFields();
        fetchSongList()
    })
};
</script>