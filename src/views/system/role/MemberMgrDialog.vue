<template>
    <a-modal v-model:open="show" title="成员管理" :confirmLoading="confirmLoading" :width="1000" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="flex justify-center py-2">
                <a-transfer v-model:target-keys="targetKeys" :data-source="mockData" show-search
                    :titles="['未分配成员', '已分配成员']" :operations="['分配', '移除']" :list-style="{
                        width: '450px',
                        height: '460px',
                    }" :locale="{
                        searchPlaceholder: '请输入成员姓名搜索',
                        itemUnit: '人',
                        itemsUnit: '人',
                    }" @change="handleChange">
                    <!-- 自定义单行选项渲染：增加图标与文本排版 -->
                    <template #render="item">
                        <div class="flex items-center space-x-2 py-0.5">
                            <user-outlined class="text-gray-400" />
                            <span class="font-medium text-gray-700">{{ item.title }}</span>
                            <span v-if="item.description" class="text-xs text-gray-400">({{ item.description }})</span>
                        </div>
                    </template>

                    <!-- 优化无数据空状态显示 -->
                    <template #notFoundContent>
                        <a-empty :image="Empty.PRESENTED_IMAGE_SIMPLE" description="暂无可分配成员" />
                    </template>
                </a-transfer>
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
import { getRoleUsers, saveRoleUsers } from "@/request/system/role"
import { getAllUser } from "@/request/system/user"
import { message } from 'ant-design-vue';
import { Empty } from 'ant-design-vue'
import { UserOutlined } from '@ant-design/icons-vue'

const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})
const detailLoading = ref(false)
const confirmLoading = ref(false)
const emits = defineEmits(["saveSuccess"])



const targetKeys = ref([])
const mockData = ref([])
function handleChange(keys) {
    targetKeys.value = keys
}


function submit() {
    confirmLoading.value = true;
    saveRoleUsers({ id: props.id, userIds: targetKeys.value.map(item => parseInt(item)) }).then(res => {
        message.success("保存成功")
        show.value = false
    }).finally(() => confirmLoading.value = false)

}


function fetchRoleInfo() {
    detailLoading.value = true;
    getAllUser().then(res => {
        mockData.value = res.list.map(item => ({
            key: item.id.toString(),
            title: item.username,
            description: item.nickname
        }))
    })
    getRoleUsers(props.id).then(res => targetKeys.value = res.map(item => item.toString())).finally(() => detailLoading.value = false)
}

watch(() => show.value, (newVal) => {
    if (newVal && props.id) {
        fetchRoleInfo()
    }
});

</script>