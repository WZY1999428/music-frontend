import { ref } from "vue";
export const collapsed = ref(getItem('collapsed'))
export function toggleCollapsed() {
    collapsed.value = !collapsed.value
    setItem('collapsed', collapsed.value)
}
