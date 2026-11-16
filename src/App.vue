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
import useAudioPlayerStore from "@/store/audioPlayer"

const configStore = useConfigStore();
const audioStore = useAudioPlayerStore();
configStore.fetchConfig();


onMounted(() => {
  audioStore.initAudio();
})

</script>

<style lang="scss" scoped></style>
