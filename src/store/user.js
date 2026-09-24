import { defineStore } from "pinia"
import { getUserInfo, getRoles, loginOut, switchRole } from "@/request/user.js"
import useMenuStore from "./system/menu"
const useUserStore = defineStore('userStore', () => {

    const userInfo = reactive(getItem("userInfo") || {});
    const roles = ref(getItem("roles") || [])

    const fetchUserInfo = async () => {
        await getUserInfo().then(info => {
            Object.assign(userInfo, info);
            setItem("userInfo", info);
        });
        if (!userInfo.isSuperAdmin) {
            getRoles().then(rolesData => {
                roles.value = rolesData;
                setItem("roles", rolesData);
            })
        }
    }


    const switchUserRole = async (roleId) => {
        // 调用切换角色的API
        const menuStore = useMenuStore()
        await switchRole(roleId);
        fetchUserInfo();
        menuStore.fetchMenu();
    }



    const logout = () => {
        userInfo.value = null;
        loginOut();
        removeToken();
    }


    return {
        fetchUserInfo,
        switchUserRole,
        roles,
        userInfo,
        logout
    }
})

export default useUserStore;