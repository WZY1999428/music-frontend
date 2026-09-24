/**
 * 
 * 事件触发后等待 n 秒再执行。如果在此期间再次触发，则重新开始计时。
 * @param {Function} fn - 要防抖的函数
 * @param {number} delay - 延迟时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(fn, delay = 300) {
    let timer = null
    let lastArgs = null
    let lastThis = null
    let result

    const debounced = function (...args) {
        lastArgs = args
        lastThis = this

        if (timer) {
            clearTimeout(timer)
        }

        timer = setTimeout(() => {
            timer = null

            result = fn.apply(lastThis, lastArgs)

            lastArgs = null
            lastThis = null
        }, delay)

        return result
    }

    /**
     * 取消待执行任务
     */
    debounced.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }

        lastArgs = null
        lastThis = null
    }

    /**
     * 立即执行最后一次
     */
    debounced.flush = () => {
        if (!timer) return result

        clearTimeout(timer)
        timer = null

        result = fn.apply(lastThis, lastArgs)

        lastArgs = null
        lastThis = null

        return result
    }

    return debounced
}

/**
 *  定义：规定在一个单位时间内，只能触发一次函数。如果在该单位时间内多次触发，只有一次生效。
 * 
 */
function throttle(fn, delay = 300) {
    let lastTime = 0
    let timer = null
    let lastArgs = null
    let lastThis = null
    let result

    const throttled = function (...args) {
        const now = Date.now()

        lastArgs = args
        lastThis = this

        const remaining = delay - (now - lastTime)

        if (remaining <= 0) {
            if (timer) {
                clearTimeout(timer)
                timer = null
            }

            lastTime = now

            result = fn.apply(lastThis, lastArgs)

            lastArgs = null
            lastThis = null

            return result
        }

        if (!timer) {
            timer = setTimeout(() => {
                timer = null
                lastTime = Date.now()

                result = fn.apply(lastThis, lastArgs)

                lastArgs = null
                lastThis = null
            }, remaining)
        }

        return result
    }

    /**
     * 取消待执行任务
     */
    throttled.cancel = () => {
        if (timer) {
            clearTimeout(timer)
            timer = null
        }

        lastArgs = null
        lastThis = null
    }

    /**
     * 立即执行最后一次
     */
    throttled.flush = () => {
        if (!timer) return result

        clearTimeout(timer)
        timer = null

        lastTime = Date.now()

        result = fn.apply(lastThis, lastArgs)

        lastArgs = null
        lastThis = null

        return result
    }

    return throttled
}


export {
    debounce,
    throttle
}