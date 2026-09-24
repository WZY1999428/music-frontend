import { defineStore } from "pinia"
import { getConfigInfo } from "@/request/system/config"
const useConfigStore = defineStore('configStore', () => {
    const config = ref(getItem("systemConfig"))
    const fetchConfig = () => {
        getConfigInfo().then(cfg => {
            config.value = cfg
            setItem("systemConfig", cfg)
        })
    }
    return {
        fetchConfig,
        config,
    }
})


export default useConfigStore

