<template>
    <div class="flex w-full h-full bg-white px-4 py-2 rounded-lg">
        <a-tabs v-model:activeKey="activeKey" class="w-full">
            <a-tab-pane key="SiteConfig" tab="基础/站点设置">
                <SiteConfig />
            </a-tab-pane>
            <a-tab-pane key="ReleaseConfig" tab="发布配置" force-render>
                <ReleaseConfig />
            </a-tab-pane>
            <!-- <a-tab-pane key="UploadConfig" tab="上传与存储配置">
                <UploadConfig />
            </a-tab-pane>
            <a-tab-pane key="PushConfig" tab="消息推送">
                <PushConfig />
            </a-tab-pane>  -->
        </a-tabs>
    </div>
</template>

<script setup>
import SiteConfig from './SiteConfig.vue'
import ReleaseConfig from './ReleaseConfig.vue'
// import UploadConfig from './UploadConfig.vue'
// import PushConfig from './PushConfig.vue'

const activeKey = ref('SiteConfig')
</script>


<style lang="scss" scoped></style>