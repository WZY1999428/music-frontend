import { defineStore } from "pinia"
import { getRoutes } from "@/request/system/menu"
import router from "@/router"
const useMenuStore = defineStore('menuStore', () => {
    const menuList = reactive([])
    const olderPermission = getItem("permission") || []
    const permissionsSet = reactive(new Set(olderPermission))
    const fetchMenu = () => {
        getRoutes().then(({ rouets, permissions }) => {
            permissionsSet.clear()
            menuList.splice(0)
            menuList.push(...rouets)
            permissions.forEach(permission => permissionsSet.add(permission))
            setItem("menuList", menuList)
            setItem("permission", permissions)
            registerRoutes(router, menuList)
        })
    }
    return {
        menuList,
        permissionsSet,
        fetchMenu,
    }
})





export default useMenuStore