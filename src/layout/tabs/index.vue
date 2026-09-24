<template>
    <div class="chrome-tabs-container">
        <a-tabs v-model:activeKey="activeKey" hide-add type="editable-card" class="chrome-tabs" @tabClick="onTabClick"
            @edit="onEdit">
            <a-tab-pane v-for="pane in panes" :key="pane.key" :closable="pane.closable !== false">
                <template #tab>
                    <div class="chrome-tab-item">
                        <span class="tab-dot" :class="{ active: activeKey === pane.key }" />

                        <span class="tab-title">
                            {{ pane.title }}
                        </span>
                    </div>
                </template>
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
const router = useRouter()
const route = useRoute()

/**
 * 首页固定存在，不允许关闭
 */
const panes = ref([
    {
        key: 'home',
        title: '首页',
        closable: false,
        path: '/home',
        routeName: 'home'
    }
])

const activeKey = ref('home')

/**
 * Tab Map
 *
 * key -> pane
 *
 * 避免每次查找都遍历 panes
 */
const tabMap = new Map()

tabMap.set('home', panes.value[0])

/**
 * 当前路由生成 Tab Key
 *
 * 优先使用 route.name
 *
 * 如果动态路由存在相同 name，
 * 可以改成 route.fullPath
 */
const getTabKey = (route) => {
    return route.name || route.fullPath
}

/**
 * 获取 Tab 标题
 */
const getTabTitle = (route) => {
    return route.meta?.title || '未命名页面'
}

/**
 * 根据路由创建 Tab
 */
const addTab = (route) => {
    const key = getTabKey(route)

    /**
     * 已存在
     */
    if (tabMap.has(key)) {
        return tabMap.get(key)
    }
    console.log(route);

    const pane = {
        key,
        title: getTabTitle(route),
        closable: key !== 'home',
        path: route.fullPath,
        query: route.query,
        params: route.params,
        routeName: route.name
    }

    panes.value.push(pane)
    tabMap.set(key, pane)

    return pane
}

/**
 * 路由变化
 */
watch(() => route.fullPath, () => {
    const pane = addTab(route)
    activeKey.value = pane.key
    document.title = pane.title
}, { immediate: true })

/**
 * 点击 Tab
 */
const onTabClick = (key) => {
    const pane = tabMap.get(key)
    if (!pane) return
    activeKey.value = key
    /**
     * 优先使用 routeName
     */
    if (pane.routeName) {
        router.push({
            name: pane.routeName,
            query: pane.query,
            params: pane.params
        })
        return
    }
    router.push(pane.path)
}

/**
 * Tab 关闭
 *
 * Ant Design Vue:
 *
 * @edit="onEdit"
 *
 * action:
 * - add
 * - remove
 */
const onEdit = (targetKey, action) => {
    if (action === 'remove') {
        removeTab(targetKey)
    }
}

/**
 * 删除 Tab
 */
const removeTab = (targetKey) => {
    /**
     * 首页不能关闭
     */
    if (targetKey === 'home') {
        return
    }

    const index = panes.value.findIndex(pane => pane.key === targetKey)

    if (index === -1) {
        return
    }

    const isActive = activeKey.value === targetKey

    /**
     * 删除
     */
    panes.value.splice(index, 1)

    tabMap.delete(targetKey)

    /**
     * 如果删除的是当前 Tab
     * 自动切换到相邻 Tab
     */
    if (isActive) {
        const nextPane =
            panes.value[index] ||
            panes.value[index - 1] ||
            panes.value[0]

        if (nextPane) {
            activeKey.value = nextPane.key

            if (nextPane.routeName) {
                router.push({
                    name: nextPane.routeName
                })
            } else {
                router.push(nextPane.path)
            }
        }
    }
}
</script>

<style scoped lang="scss">
.chrome-tabs-container {
    background-color: #d9e4ec;
    /* Chrome 标签栏背景灰 */
    padding: 6px 6px 0 6px;
    user-select: none;
}

/* 隐藏 Tab 内容区域，只留 TabBar */
:deep(.ant-tabs-content-holder) {
    display: none !important;
}

:deep(.ant-tabs.chrome-tabs) {
    .ant-tabs-nav {
        margin: 0 !important;
        border-bottom: none !important;

        &::before {
            display: none !important;
        }
    }

    /* 基础 Tab 样式 */
    .ant-tabs-tab {
        position: relative;
        height: 34px;
        margin: 0 2px 0 0 !important;
        padding: 0 16px !important;
        border: none !important;
        background: transparent !important;
        border-radius: 8px 8px 0 0 !important;
        transition: all 0.15s ease;
        font-size: 12px;
        color: #474747;

        /* Hover 状态（类 Chrome 未选中态悬浮效果） */
        &:hover:not(.ant-tabs-tab-active) {
            background-color: rgba(255, 255, 255, 0.5) !important;
            color: #1f1f1f;
        }

        /* 选中态 Tab */
        &.ant-tabs-tab-active {
            background-color: #ffffff !important;
            color: #1677ff !important;
            font-weight: 500;
            box-shadow: 0 -1px 4px rgba(0, 0, 0, 0.05);

            /* Chrome 特有的下角圆弧过渡 */
            &::before,
            &::after {
                content: '';
                position: absolute;
                bottom: 0;
                width: 6px;
                height: 6px;
                border-radius: 50%;
            }

            &::before {
                left: -6px;
                box-shadow: 3px 3px 0 #ffffff;
            }

            &::after {
                right: -6px;
                box-shadow: -3px 3px 0 #ffffff;
            }
        }

        /* 关闭按钮优化 */
        .ant-tabs-tab-remove {
            margin-left: 8px !important;
            margin-right: -4px !important;
            padding: 2px !important;
            border-radius: 50%;
            color: #707070;
            transition: all 0.2s;

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
                color: #ff4d4f;
            }
        }
    }
}

/* Custom Tab Label 内部样式 */
.chrome-tab-item {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 140px;

    .tab-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #ccc;
        transition: background-color 0.2s;

        &.active {
            background-color: #1677ff;
        }
    }

    .tab-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>