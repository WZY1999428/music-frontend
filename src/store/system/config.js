import { defineStore } from "pinia"
import { getConfigInfo, getReleaseConfig } from "@/request/system/config"
const useConfigStore = defineStore('configStore', () => {
    const config = ref(getItem("systemConfig"))
    const releaseConfig = ref(getItem("releaseConfig"))
    const fetchConfig = () => {
        getConfigInfo().then(cfg => {
            config.value = cfg
            setItem("systemConfig", cfg)
        })

        getReleaseConfig().then(cfg => {
            releaseConfig.value = cfg
            setItem("releaseConfig", cfg)
        })
    }
    return {
        fetchConfig,
        config,
        releaseConfig
    }
})


export default useConfigStore

