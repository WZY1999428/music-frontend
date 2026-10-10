<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="900" destroyOnClose
        :maskClosable="false">
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :disabled="readonly" colon labelAlign="right"
                :label-col="{ style: { width: '90px' } }" class="route-form">
                <!-- 基础信息 -->
                <section class="form-section">
                    <div class="section-header">
                        <div>
                            <h3>基础信息</h3>
                            <span>配置菜单的基本属性与显示信息</span>
                        </div>
                    </div>

                    <a-row :gutter="[20, 4]">

                        <!-- 父级 -->
                        <a-col :span="24">
                            <a-form-item name="parentId" label="菜单父级">
                                <a-tree-select :tree-data="treeData" v-model:value="formData.parentId"
                                    placeholder="请选择菜单父级" allow-clear tree-default-expand-all class="w-full" />
                            </a-form-item>
                        </a-col>

                        <!-- 菜单名称 -->
                        <a-col :span="12">
                            <a-form-item name="type" label="菜单类型">
                                <a-radio-group v-model:value="formData.type" :options="[
                                    { label: '目录', value: 0 },
                                    { label: '菜单', value: 1 },
                                ]" />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item name="title" label="菜单名称">
                                <a-input v-model:value.trim="formData.title" placeholder="请输入菜单名称" :maxlength="50"
                                    show-count />
                            </a-form-item>
                        </a-col>


                        <!-- 路由地址 -->
                        <a-col :span="12">
                            <a-form-item name="path" label="路由地址">
                                <a-input v-model:value.trim="formData.path" placeholder="例如：/user" :maxlength="50"
                                    show-count />
                            </a-form-item>
                        </a-col>
                        <!-- 外链 -->
                        <a-col :span="12" v-if="formData.type == 1">
                            <a-form-item name="isLink" label="是否外链">
                                <a-switch v-model:checked="formData.isLink" checked-children="是" :checked-value="1"
                                    :un-checked-value="0" un-checked-children="否" />
                            </a-form-item>
                        </a-col>
                        <!-- 组件路径 -->
                        <a-col :span="12" v-if="formData.type == 1 && formData.isLink === 0">
                            <a-form-item name="component" label="组件路径"
                                :rules="[{ required: true, message: '请输入组件路径!' }]">
                                <a-input v-model:value.trim="formData.component" @change="componentInput"
                                    placeholder="例如：/system/user/index" :maxlength="100" show-count />
                            </a-form-item>
                        </a-col>

                        <!-- 图标 -->
                        <a-col :span="12">
                            <a-form-item name="icon" label="菜单图标">
                                <IconPopover v-model="formData.icon" />
                            </a-form-item>
                        </a-col>

                        <!-- 排序 -->
                        <a-col :span="12">
                            <a-form-item name="sort" label="排序">
                                <a-input-number v-model:value="formData.sort" :min="1" :precision="0"
                                    style="width: 100%" placeholder="请输入排序" />
                            </a-form-item>
                        </a-col>

                        <!-- 外链 -->
                        <a-col :span="12">
                            <a-form-item name="visible" label="是否显示">
                                <a-switch v-model:checked="formData.visible" checked-children="是" :checked-value="1"
                                    :un-checked-value="0" un-checked-children="否" />
                            </a-form-item>
                        </a-col>
                        <!-- 启用 -->
                        <a-col :span="12">
                            <a-form-item name="enabled" label="是否启用">
                                <a-switch v-model:checked="formData.enabled" :checked-value="1" :un-checked-value="0"
                                    checked-children="启用" un-checked-children="停用" />
                            </a-form-item>
                        </a-col>
                        <!-- 首页推荐 -->
                        <a-col :span="12" v-if="formData.type == 1">
                            <a-form-item name="isHome" label="首页推荐">
                                <a-switch v-model:checked="formData.isHome" :checked-value="1" :un-checked-value="0"
                                    checked-children="是" un-checked-children="否" />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </section>

                <!-- 路由权限 -->
                <section class="form-section" v-if="props.id">
                    <div class="section-header">
                        <div>
                            <h3>路由权限</h3>
                            <span>配置该菜单下可使用的操作权限</span>
                        </div>

                        <a-button type="link" size="small" @click="() => {
                            permissionsId = null
                            permissionsEditVisible = true
                        }">新增权限</a-button>
                    </div>
                    <a-table row-key="id" :dataSource="permissionsTable || []" :columns="columns"
                        :pagination="pagination" @change="fetchPermissionData">
                        <template #bodyCell="{ column, record }">

                            <template v-if="['createdAt', 'updatedAt'].includes(column.key)">
                                {{ formatDateTime(record[column.key]) }}
                            </template>
                            <template v-else-if="column.key === 'operation'">
                                <a-button type="link" @click="() => {
                                    permissionsId = record.id
                                    permissionsEditVisible = true
                                }" primary>编辑</a-button>
                                <a-popconfirm title="是否删除当前权限吗?" ok-text="确定" cancel-text="取消"
                                    @confirm="handleDelete(record)">
                                    <a-button type="link" danger>删除</a-button>
                                </a-popconfirm>
                            </template>
                        </template>
                    </a-table>
                </section>
            </a-form>
        </a-spin>
        <template #footer>
            <template v-if="!readonly">
                <a-button @click="show = false">取消</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
            </template>
        </template>
    </a-modal>
    <PermissionsEdit v-model="permissionsEditVisible" :routeId="id" :id="permissionsId"
        @saveSuccess="fetchPermissionData" />
</template>


<script setup>
import PermissionsEdit from "./permissionsEdit.vue";
import { getMenuInfo, saveMenu, getMenuOptions, getPermissionsList, delPermissions } from "@/request/system/menu"
import { message } from 'ant-design-vue';
import IconPopover from './icon-popover.vue';
const props = defineProps({
    id: [Number, String],
    parentId: [Number, String],
    readonly: Boolean,
    isCopy: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const pagination = reactive({
    total: 30,
    current: 30,
    pageSize: 30
})


const formData = ref({})
const permissionsEditVisible = ref(false);
const permissionsId = ref(null)
const permissionsTable = ref([])

const formRef = ref(null)
const treeData = ref([])
const rulesRef = reactive({
    title: { required: true, message: '请输入菜单名称', },
    path: { required: true, message: '请输入菜单路径', },
    sort: { required: true, message: '请输入排序', },
})

const title = computed(() => (props.id && props.readonly) ? '菜单详情' : (props.id && props.isCopy) ? '复制菜单' : props.id ? '编辑菜单' : '新增菜单')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)


const columns = reactive([
    {
        title: '权限名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '权限编码',
        dataIndex: 'permission',
        key: 'permission',
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
    {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 160
    }
])


watch(() => show.value, (newVal) => {
    if (newVal) {
        getMenuOptions().then(list => {
            treeData.value = [{ value: 0, label: "根目录", children: list }]
        })
        permissionsTable.value = []
        initFormData()
        if (props.id) {
            fetchMenuInfo()
            if (!props.isCopy) fetchPermissionData()
        }
    }
});

function componentInput() {
    formData.value.component = formData.value.component.replace(/\\+/g, "/")
}

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        const params = { ...formData.value }
        if (props.id && !props.isCopy) {
            params.id = props.id;
        }

        saveMenu(params).then(res => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}

function handleDelete(row) {
    if (row.loading) return;
    row.loading = true;
    delPermissions(row.id).then(() => {
        message.success("删除成功")
        fetchPermissionData()
    }).finally(() => {
        row.loading = false;
    })
}

function fetchMenuInfo() {
    detailLoading.value = true;
    getMenuInfo(props.id).then(res => initFormData(res)).finally(() => detailLoading.value = false)
}

function fetchPermissionData() {
    getPermissionsList({
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        routeId: props.id
    }).then(res => {
        permissionsTable.value = res.list;
        pagination.total = res.total;
    })
}




function initFormData(data = {}) {
    formData.value = {
        parentId: props.parentId,
        title: data.title,
        type: data.type || 0,
        icon: data.icon,
        path: data.path,
        component: data.component,
        sort: data.sort || 1,
        visible: data.visible ?? 1,
        isLink: data.isLink ?? 0,
        enabled: data.enabled ?? 1,
        isHome: data.isHome ?? 0,
    }


}

</script>

<style scoped lang="scss">
.route-form {
    padding: 4px 4px 20px;
}

.form-section {
    padding: 15px;
    margin-bottom: 20px;
    background: #fff;
    border: 1px solid #f0f0f0;
    border-radius: 8px;
}

.section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 16px;
    margin-bottom: 8px;
    border-bottom: 1px solid #f5f5f5;

    h3 {
        margin: 0;
        font-size: 16px;
        font-weight: 600;
        line-height: 24px;
    }

    span {
        display: block;
        margin-top: 3px;
        color: #999;
        font-size: 13px;
    }

}


.route-form :deep(.ant-form-item) {
    margin-bottom: 16px;
}

.route-form :deep(.ant-form-item-label) {
    font-weight: 400;
}

.permission-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    min-height: 40px;
}

.permission-tag {
    margin: 0;
    padding: 5px 12px;
    font-size: 13px;
    line-height: 20px;
    border-radius: 6px;
    cursor: pointer;
}
</style>