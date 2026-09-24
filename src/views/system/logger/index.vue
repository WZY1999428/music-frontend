<template>
  <div class="p-4 bg-white rounded">
    <a-form ref="formRef" :model="queryForm" layout="inline" @finish="fetchTableData()">
      <a-form-item label="访问用户" name="username">
        <a-input v-model:value="queryForm.username" placeholder="请输入角色名称 " style="width: 280px;" pla />
      </a-form-item>

      <a-form-item label="角色" name="roleName">
        <a-input v-model:value="queryForm.roleName" placeholder="请输入角色名称 " style="width: 280px;" pla />
      </a-form-item>

      <a-form-item label="请求方法" name="method">
        <a-select :options="methodOptions" v-model:value="queryForm.method" placeholder="请选择请求方法"
          style="width: 280px;" />
      </a-form-item>

      <a-form-item label="访问日期" name="dateRange">
        <a-range-picker v-model:value="queryForm.dateRange" :placeholder="['请选择开始时间', '请选择结束时间']"
          valueFormat="YYYY-MM-DD" />
      </a-form-item>
      <a-form-item>
        <div class="flex gap-2 ">
          <a-button type="primary" @click="resetFields">重置</a-button>
          <a-button type="primary" html-type="submit">搜索</a-button>
        </div>
      </a-form-item>
    </a-form>
  </div>

  <div class="mt-2 p-2  bg-white rounded">
    <a-spin tip="加载中..." :spinning="loading">
      <a-table :dataSource="dataSource" :columns="columns" :pagination="pagination" @change="fetchTableData">
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'name'">
            {{ record[column.name] || "游客" }}
          </template>
          <template v-if="column.key === 'createdAt'">
            {{ formatDateTime(record[column.key]) }}
          </template>
          <template v-else-if="column.key === 'operation'">
            <a-button type="link" @click="() => {
              logId = record.id
              show = true
            }" primary>详情</a-button>
          </template>
        </template>
      </a-table>
    </a-spin>
  </div>
  <detailDialog v-model="show" :id="logId" />
</template>

<script setup>
import { PlusOutlined } from "@ant-design/icons-vue"
import { getLoggerList } from "@/request/system/logger"
import detailDialog from "./detailDialog.vue"
const show = ref(false);
const logId = ref(null);
const loading = ref(false);
const total = ref(0)
const formRef = ref(null)

const queryForm = reactive({
  name: '',
  roleName: '',
  method: '',
  dateRange: [],
  pageIndex: 1,
  pageSize: 10
});

const dataSource = reactive([]);
const methodOptions = [
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "PATCH",
    value: "PATCH",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
  {
    label: "HEAD",
    value: "HEAD",
  },
  {
    label: "OPTIONS",
    value: "OPTIONS",
  },
]
const columns = reactive([
  {
    title: '访问用户',
    dataIndex: 'nickname',
    key: 'nickname',
  },
  {
    title: '角色',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: '操作类型',
    dataIndex: 'action',
    key: 'action',
  },
  {
    title: '请求方法',
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    key: 'ip',
  },
  {
    title: '访问日期',
    dataIndex: 'createdAt',
    key: 'createdAt',
  },
  {
    title: '操作',
    key: 'operation',
    fixed: 'right',
    width: 160
  }
])

const pagination = computed(() => ({
  total: total.value,
  current: queryForm.pageIndex,
  pageSize: queryForm.pageSize,
}));

function openDialog(id, read) {
  logId.value = id;
  readonly.value = read;
  show.value = true;
}

fetchTableData()
function fetchTableData({ current = 1, pageSize = 10 } = {}) {
  queryForm.pageIndex = current;
  queryForm.pageSize = pageSize;
  loading.value = true;
  getLoggerList(queryForm).then(res => {
    dataSource.splice(0, dataSource.length, ...res.list)
    total.value = res.total;
  }).finally(() => {
    loading.value = false;
  })
}

function resetFields() {
  formRef.value?.resetFields()
  queryForm.pageIndex = 1;
  queryForm.pageSize = 10;
  fetchTableData()
}
</script>