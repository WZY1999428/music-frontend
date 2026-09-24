import request from ".."
export function getLoggerList(params) {
    return request({
        url: '/system/logger/list',
        method: 'get',
        params
    })
}


export function getLoggerDetail(id) {
    return request({
        url: '/system/logger/' + id,
        method: 'get'
    })
}
