<template>
    <a-modal v-model:open="show" title="选择部门成员" :confirmLoading="confirmLoading" :width="900" destroyOnClose>
        <div class="pb-4">
            <a-form layout="inline" ref="formRef" :model="queryForm" @finish="fetchSelectUserList()">
                <a-form-item title="用户账户" name="username">
                    <a-input v-model:value="queryForm.username" placeholder="请输入用户账户" />
                </a-form-item>
                <a-form-item title="用户昵称" name="nickname">
                    <a-input v-model:value="queryForm.nickname" placeholder="请输入用户昵称" />
                </a-form-item>
                <a-form-item>
                    <div class="flex gap-4">
                        <a-button type="primary" html-type="submit">搜索</a-button>
                        <a-button type="default" @click="resetForm">重置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
        <a-spin tip=" 加载中..." :spinning="detailLoading">
            <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchSelectUserList"
                :row-selection="rowSelection" row-key="id">
                <template #bodyCell="{ column, record }">
                    <template v-if="column.key === 'avatar'">
                        <a-avatar :src="record[column.key]" />
                    </template>
                    <template v-if="column.key === 'enabled'">
                        {{ record[column.key] == 1 ? "已启用" : "已禁用" }}
                    </template>
                    <template v-else-if="column.key === 'updatedAt'">
                        {{ formatDateTime(record[column.key]) }}
                    </template>
                </template>
            </a-table>
        </a-spin>
        <template #footer>
            <a-button @click="show = false">取消</a-button>
            <a-button :disabled="selected" type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
        </template>
    </a-modal>
</template>


<script setup>
import { getSelectUserList, addDeptUsers } from "@/request/system/dept"
import { message } from 'ant-design-vue';
import { reactive } from "vue";
const props = defineProps({
    deptId: [Number, String],
})

const show = defineModel({
    type: Boolean,
    default: false
})

const columns = reactive([
    {
        title: '成员头像',
        dataIndex: 'avatar',
        key: 'avatar',
    },
    {
        title: '成员账户',
        dataIndex: 'username',
        key: 'username',
    },
    {
        title: '成员昵称',
        dataIndex: 'nickname',
        key: 'nickname',
    },
    {
        title: '联系电话',
        dataIndex: 'phone',
        key: 'phone',
    },
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    },
])


const total = ref(0)
const formRef = ref(null)
const dataSource = reactive([])

const queryForm = reactive({
    username: "",
    nickname: "",
    pageIndex: 1,
    pageSize: 10
});


const pagination = computed(() => ({
    total: total.value,
    current: queryForm.pageIndex,
    pageSize: queryForm.pageSize,
}));

const detailLoading = ref(false)
const confirmLoading = ref(false)
const selectedRowKeys = ref([])



const selected = computed(() => selectedRowKeys.value.length === 0)

const emits = defineEmits(["saveSuccess"])


function submit() {
    confirmLoading.value = true;
    addDeptUsers({ deptId: props.deptId, userIds: selectedRowKeys.value }).then(res => {
        message.success("保存成功")
        show.value = false
        emits("saveSuccess");
    }).finally(() => confirmLoading.value = false)
}


const rowSelection = {
    selectedRowKeys,
    onChange: (keys) => selectedRowKeys.value = keys
}


const resetForm = () => {
    formRef.value.resetFields();
    fetchSelectUserList()
};

function fetchSelectUserList({ current = 1, pageSize = 10 } = {}) {
    queryForm.pageIndex = current;
    queryForm.pageSize = pageSize
    detailLoading.value = true;
    getSelectUserList({ deptId: props.deptId, ...queryForm }).then(res => {
        dataSource.splice(0, dataSource.length, ...res.list)
        total.value = res.total;
    }).finally(() => {
        detailLoading.value = false;
    })
}

watch(() => show.value, (newVal) => {
    if (newVal) {
        initForm()
        if (props.deptId) fetchSelectUserList()
    }
});

function initForm() {
    queryForm.pageIndex = 1;
    queryForm.pageSize = 10
    selectedRowKeys.value = []
}

</script>