import request from ".."
export function getSystemInfo() {
    return request({
        url: '/system/home/info',
        method: 'get',
    })
}


export function getQuickNavs() {
    return request({
        url: '/system/home/quickNavs',
        method: 'get',
    })
}


export function getNotice() {
    return request({
        url: '/system/home/notice',
        method: 'get',
    })
}




export function getStatCards() {
    return request({
        url: '/system/home/statCards',
        method: 'get',
    })
}


