<template>
  <a-config-provider :locale="zhCN" :theme="{
    algorithm: theme.defaultAlgorithm,
  }">
    <RouterView />
  </a-config-provider>
</template>

<script setup>
import { theme } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import useConfigStore from "@/store/system/config"
const configStore = useConfigStore();
configStore.fetchConfig();
</script>

<style lang="scss" scoped></style>
