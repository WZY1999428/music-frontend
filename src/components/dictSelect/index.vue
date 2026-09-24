<template>
    <a-select v-model:value="selectValue" :placeholder="placeholder" :mode="mode" :options="dicts"
        :field-names="{ label: 'title', value: 'value' }"></a-select>
</template>

<script setup>
import useDictStore from '@/store/system/dict';
const dictStore = useDictStore();
const props = defineProps({
    placeholder: {
        type: String,
        default: "请选择"
    },
    mode: {
        type: String,
        default: "combobox"
    },
    dictKey: {
        type: String,
        required: true
    },
});

const selectValue = defineModel({
    type: [String, Array],
    default: null
})


initValue()
watch(() => selectValue.value, initValue)
function initValue() {
    if (!selectValue.value && props.mode === "multiple") {
        selectValue.value = []
    }
}

const dicts = computed(() => dictStore.getDict(props.dictKey));

</script>
