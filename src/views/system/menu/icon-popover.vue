<template>
    <a-popover placement="topLeft" trigger="click">
        <template #content>
            <div class="w-[320px]">
                <h4 class="mb-3">图标</h4>
                <div class="grid grid-cols-8 gap-2 h-[300px] overflow-y-auto">
                    <div v-for="item in iconsList" :key="item.name" class="flex items-center justify-center p-2 border rounded cursor-pointer
                               hover:bg-gray-100" :title="item.name" @click="selectIcon(item)">
                        <component :is="item.component" />
                    </div>
                </div>
            </div>
        </template>

        <a-input v-model:value="iconValue" readonly placeholder="请选择图标">
            <template #suffix v-if="iconComponent">
                <component :is="iconComponent" />
            </template>
        </a-input>
    </a-popover>
</template>

<script setup>
const iconsList = reactive(antDesignIcons)
const iconValue = defineModel({ type: String, default: '' })
const iconComponent = computed(() => {
    return iconsList.find(item => item.name === iconValue.value)?.component 
})

function selectIcon(item) {
    iconValue.value = item.name
}
</script>