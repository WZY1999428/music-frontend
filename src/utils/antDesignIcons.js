import * as icons from '@ant-design/icons-vue'
const excludedIcons = new Set(["default", "getTwoToneColor", "setTwoToneColor", "createFromIconfontCN"])

export const antDesignIcons = Object.entries(icons)
    .filter(([name]) => !excludedIcons.has(name))
    .map(([name, component]) => ({ name, component }))

const antDesignIconsMap = new Map(antDesignIcons.map(i => ([i.name, i.component])))

export function checkIcon(name) {
    return antDesignIconsMap.has(name)
}

export function getAntDesignIcon(name) {
    return antDesignIconsMap.get(name)
}


