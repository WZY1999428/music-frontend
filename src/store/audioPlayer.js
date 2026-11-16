
import { defineStore } from "pinia"
import { ref, computed } from "vue"
import {message} from "ant-design-vue"

const useAudioPlayerStore = defineStore("audioPlayerStore", () => {
    const audioId = ref(null)
    const audioPlayer = ref(null)

    const isPlaying = ref(false)
    const isLoading = ref(false)

    const currentTime = ref(0)
    const duration = ref(0)
    const volume = ref(1)

    // 是否静音
    const isMuted = ref(false)

    // 播放进度
    const progress = computed(() => {
        if (!duration.value) return 0
        return (currentTime.value / duration.value) * 100
    })

    // 创建 Audio 实例
    function initAudio() {
        if (audioPlayer.value != null) return
        const audio = new Audio()
        audio.preload = "metadata"
        audio.volume = volume.value

        audio.addEventListener("play", () => {
            isPlaying.value = true
        })

        audio.addEventListener("pause", () => {
            isPlaying.value = false
        })

        audio.addEventListener("ended", () => {
            isPlaying.value = false
            currentTime.value = 0
        })

        audio.addEventListener("timeupdate", () => {
            currentTime.value = audio.currentTime
        })

        audio.addEventListener("loadedmetadata", () => {
            duration.value = audio.duration || 0
        })

        audio.addEventListener("loadstart", () => {
            isLoading.value = true
        })

        audio.addEventListener("canplay", () => {
            isLoading.value = false
        })

        audio.addEventListener("error", () => {
            isLoading.value = false
            isPlaying.value = false
            message.error("音频加载失败")
            console.error("音频加载失败")
        })

        audioPlayer.value = audio

    }

    // 播放音频
    async function play(id, url) {
        const audioUrl = `${import.meta.env.PUBLIC_BASE_URL}/${url}`
        const audio = audioPlayer.value
        if (!audio) {
            message.error("音频播放器未初始化")
            console.error("音频播放器未初始化")
            return
        }

        // 相同音频直接恢复播放
        if (audioId.value === id && audio.src) {
            if (audio.ended) {
                audio.currentTime = 0
            }
            await audio.play()
            return
        }
        audioId.value = id
        currentTime.value = 0
        duration.value = 0
        audio.src = audioUrl
        audio.load()

        await audio.play()
    }

    // 暂停
    function pause() {
        audioPlayer.value?.pause()
    }

    // 播放 / 暂停切换
    async function toggle() {
        const audio = audioPlayer.value

        if (!audio || !audio.src) return

        if (audio.paused) {
            await audio.play()
        } else {
            audio.pause()
        }
    }

    // 停止播放
    function stop() {
        const audio = audioPlayer.value

        if (!audio) return

        audio.pause()
        audio.currentTime = 0

        audioId.value = null
        currentTime.value = 0
        duration.value = 0
        isPlaying.value = false
    }

    // 设置音量 0 ~ 1
    function setVolume(value) {
        const audio = audioPlayer.value

        volume.value = Math.max(0, Math.min(1, value))

        if (audio) {
            audio.volume = volume.value
        }
    }

    // 静音切换
    function toggleMute() {
        const audio = audioPlayer.value

        if (!audio) return

        isMuted.value = !isMuted.value
        audio.muted = isMuted.value
    }

    // 跳转播放位置（秒）
    function seek(time) {
        const audio = audioPlayer.value

        if (!audio || !Number.isFinite(audio.duration)) return

        audio.currentTime = Math.max(
            0,
            Math.min(audio.duration, time)
        )
    }

    // 释放资源
    function destroy() {
        const audio = audioPlayer.value

        if (!audio) return

        audio.pause()
        audio.removeAttribute("src")
        audio.load()

        audioPlayer.value = null
        audioId.value = null

        isPlaying.value = false
        isLoading.value = false
        currentTime.value = 0
        duration.value = 0
    }

    return {
        audioId,
        audioPlayer,
        isPlaying,
        isLoading,
        currentTime,
        duration,
        volume,
        isMuted,
        progress,

        initAudio,
        play,
        pause,
        toggle,
        stop,
        setVolume,
        toggleMute,
        seek,
        destroy
    }
})

export default useAudioPlayerStore
