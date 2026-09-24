import { defineStore } from "pinia"
import { getRoutes } from "@/request/system/menu"
import router from "@/router"
const useMenuStore = defineStore('menuStore', () => {
    const menuList = reactive([])
    const permissionsSet = reactive(new Set())
    const fetchMenu = () => {
        getRoutes().then(({ rouets, permissions }) => {
            permissionsSet.clear()
            menuList.splice(0)
            menuList.push(...rouets)
            permissionsSet.add(...permissions)
            setItem("menuList", menuList)
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