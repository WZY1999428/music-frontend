<template>
    <header class="h-[64px] pr-5 flex items-center justify-between bg-white border-b border-gray-200 ">

        <div class="flex items-center gap-2">
            <a-button type="primary" @click="toggleCollapsed">
                <MenuUnfoldOutlined v-if="collapsed" />
                <MenuFoldOutlined v-else />
            </a-button>
            <!-- 左侧：页面标题 -->
            <div class="flex items-center min-w-[180px]">
                <span class="text-lg font-semibold text-gray-800">
                    {{ config?.systemTitle }}
                </span>
            </div>
            <!-- 中间：搜索 -->
            <div class="flex-1 flex justify-center" style="width: 300px">
                <a-tree-select v-model:value="keyword" show-search style="width: 100%" @change="handleChange"
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }" placeholder="搜索菜单" allow-clear
                    tree-default-expand-all :tree-data="menuList" :field-names="{
                        children: 'children',
                        label: 'label',
                        value: 'key',
                    }" tree-node-filter-prop="label"></a-tree-select>
            </div>

        </div>


        <!-- 右侧：操作区 -->
        <div class="flex items-center gap-4">

            <!-- 国际化 -->
            <a-dropdown>
                <button class="w-10 h-10 flex items-center justify-center rounded-lg
                           text-gray-600 hover:bg-gray-100 transition-colors">
                    <GlobalOutlined class="text-lg" />
                </button>

                <template #overlay>
                    <a-menu>
                        <a-menu-item key="zh-CN">
                            简体中文
                        </a-menu-item>

                        <a-menu-item key="zh-TW">
                            繁體中文
                        </a-menu-item>

                        <a-menu-item key="en-US">
                            English
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
            <user-dropdown />
        </div>
    </header>
</template>

<script setup>
import userDropdown from './userDropdown.vue';
import useConfigStore from "@/store/system/config"
import useMenuStore from '@/store/system/menu'
import { menuList } from "../sider/menuList"
import { toggleCollapsed, collapsed } from "./collapsed.js"
const router = useRouter()
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    GlobalOutlined,
} from '@ant-design/icons-vue';
const keyword = ref();
const configStore = useConfigStore();
const config = computed(() => configStore.config)
const handleChange = (value) => {
    router.push({ name: value })
};

</script>
