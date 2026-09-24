<template>
    <a-layout class="w-full h-full">
        <a-layout-sider theme="light" v-model:collapsed="collapsed">
            <layout-sider />
        </a-layout-sider>
        <a-layout>
            <a-layout-header style="background: #fff; box-shadow: 0 2px 8px #f0f1f2; padding: 0 20px;">
                <layout-header />
            </a-layout-header>
            <a-layout-content>
                <LayoutTabs></LayoutTabs>
                <div class="p-2 w-full  overflow-y-auto" style="height: calc(100% - 40px);">
                    <router-view />
                </div>
            </a-layout-content>
        </a-layout>
    </a-layout>
</template>

<script setup>
import { collapsed } from "./header/collapsed"
import LayoutSider from './sider/index.vue';
import LayoutHeader from './header/header.vue';
import LayoutTabs from './tabs/index.vue';


import useUserStore from '@/store/user';
import useMenuStore from "@/store/system/menu";
import useDictStore from "@/store/system/dict";


const menuStore = useMenuStore();
const userStore = useUserStore();
const dictStore = useDictStore();

userStore.fetchUserInfo();
menuStore.fetchMenu();
dictStore.fetchDicts();
</script>