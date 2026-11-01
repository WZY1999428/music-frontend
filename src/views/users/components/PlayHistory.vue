<template>
    <div class="play-history">
        <a-empty description="暂无播放历史" />
    </div>
</template>

<script setup>
const props = defineProps({
    userId: [Number, String]
})
</script>

<style scoped>
.play-history {
    min-height: 300px;
}
</style>
