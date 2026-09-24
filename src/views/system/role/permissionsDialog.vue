<template>
    <a-modal v-model:open="show" title="分配权限" :confirmLoading="confirmLoading" :width="800" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="min-h-[600px]">
                <a-tree v-model:checkedKeys="checkedKeys" default-expand-all checkable class="min-h-[600px]"
                    check-strictly :tree-data="treeData" @check="handleCheck" :field-names="{
                        title: 'deptName',
                        key: 'id',
                        children: 'children'
                    }">
                    <template #title="{ title, type }">
                        <span class="flex items-center gap-1">
                            <img class="w-[16px]" v-if="type === 0" src="@/assets/svg/directory.svg" alt="目录">
                            <img class="w-[14px]" v-else-if="type === 1" src="@/assets/svg/text.svg" alt="菜单">
                            <img class="w-[16px]" v-else-if="type === 2" src="@/assets/svg/lock.svg" alt="权限">
                            <!-- <span v-if="type === 0" class="text-gray-500">📁</span> -->
                            <!-- <span v-else-if="type === 1" class="text-blue-500">📄</span>
                            <span v-else-if="type === 2" class="text-green-500">🔐</span> -->
                            <span>{{ title }}</span>
                        </span>
                    </template>
                </a-tree>
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
import { getMenuTree } from "@/request/system/menu"
import { getRolePermissionsIds, saveRolePermissions } from "@/request/system/role"
import { message } from 'ant-design-vue';
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const treeData = ref([])
const checkedKeys = ref([])

const emits = defineEmits(["saveSuccess"])
const show = defineModel({
    type: Boolean,
    default: false
})

const detailLoading = ref(false)
const confirmLoading = ref(false)


function submit() {
    console.log(checkedKeys.value);
    confirmLoading.value = true;
    const params = {
        roleId: props.id,
        permissionIds: checkedKeys.value
    }

    saveRolePermissions(params).then(res => {
        message.success("保存成功")
        emits("saveSuccess");
        show.value = false
    }).finally(() => confirmLoading.value = false)
}

function handleCheck(_, { node, checked }) {
    const ids = getDescendantIds(node);
    const keys = checkedKeys.value?.checked || [];
    if (checked) {
        checkedKeys.value = Array.from(new Set([...keys, node.id, ...ids]));
    } else {
        const removeIds = new Set([node.id, ...ids]);
        checkedKeys.value = keys.filter(id => !removeIds.has(id));
    }
};

function getDescendantIds(node) {
    const ids = [];

    function walk(children = []) {
        for (const item of children) {
            ids.push(item.id);
            walk(item.children);
        }
    }

    walk(node.children);

    return ids;
}


watch(() => show.value, (newVal) => {
    if (newVal) {
        getTree()
        if (props.id) {
            getRolePermissionsIds(props.id).then(res => {
                checkedKeys.value = res;
            })
        }
    }

});



function initFormData(data = {}) {

}

function getTree() {
    getMenuTree().then(tree => treeData.value = tree)
}

</script>
