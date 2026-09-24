<template>

    <div class="h-full">
        <div class="w-full h-[80px] flex items-center justify-center px-4">
            <img :src="config?.logo" class="max-w-full max-h-full object-contain" alt="Logo" />
        </div>
        <a-menu v-model:openKeys="state.openKeys" v-model:selectedKeys="state.selectedKeys" mode="inline" theme="light"
            @select="selectMenu" :items="menuList"></a-menu>
    </div>
</template>


<script setup>
import useConfigStore from "@/store/system/config"
import { menuList } from "./menuList"
const configStore = useConfigStore();
const config = computed(() => configStore.config)
const router = useRouter()
const route = useRoute()

const state = reactive({
    selectedKeys: ['home'],
    openKeys: [],
    preOpenKeys: [],
});


watch(() => route.path, setSelectedKeys)
setSelectedKeys()
function setSelectedKeys() {
    state.selectedKeys = [route.name]
}

function selectMenu(info) {
    const menu = info.item;
    if (menu && info.key) {
        if (menu.isLink === 1) {
            window.open(info.key);
        } else {
            router.push({ name: info.key });
        }
    }
}
</script>

<style lang="scss" scoped></style>