import { computed } from 'vue';
import useMenuStore from '@/store/system/menu';
import { h } from 'vue';
export const menuMap = new Map();

export const menuList = computed(() => {
    const menuStore = useMenuStore();

    menuMap.clear();
    const list = menuStore.menuList.slice(0);
    const nodes = [];
    while (list.length > 0) {
        const item = list.shift();

        if (item.children && item.children.length > 0) {
            list.push(...item.children);
        }

        if (item.visible === 0) continue;

        const newItem = {
            key: item.path,
            isLink: item.isLink,
            label: item.title,
        };

        if (checkIcon(item.icon)) {
            newItem.icon = () => h(getAntDesignIcon(item.icon));
        }

        if (item.type == 0) newItem.children = [];
        if (item.parentId) {
            const parent = menuMap.get(String(item.parentId));
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(newItem)
            };
        } else {
            nodes.push(newItem);
        }
        menuMap.set(String(item.id), newItem);
    }
    const homeView = {
        key: 'home',
        icon: () => h(getAntDesignIcon('AppstoreOutlined')),
        path: 'home',
        label: '首页',
    };

    menuMap.set(homeView.key, homeView)
    return [
        homeView,
        ...nodes
    ]
})