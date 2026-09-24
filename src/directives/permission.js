
import useMenuStore from "../store/system/menu"

export const permission = {
    mounted(el, binding) {
        const { value } = binding;
        const menuStore = useMenuStore()
        const userPermissions = menuStore.permissionsSet; // 实际开发中从 pinia / store 获取
        const hasPermission = userPermissions.has(value);
        if (!hasPermission) {
            el.parentNode && el.parentNode.removeChild(el); // 没有权限则移除节点
        }
    }
};