import request from ".."


export function getAppUserList(params) {
    return request({
        url: '/app/user/list',
        method: 'get',
        params
    })
}


export function getAppUserDetail(id) {
    return request({
        url: '/app/user/' + id,
        method: 'get',
    })
}



export function getAppUserInfo(id) {
    return request({
        url: '/app/user/info',
        method: 'get',
        params: { id }
    })
}


export function saveAppUser(data) {
    return request({
        url: '/app/user/save',
        method: 'post',
        data
    })
}



export function delAppUser(id) {
    return request({
        url: '/app/user/del',
        method: 'delete',
        params:{id}
    })
}



