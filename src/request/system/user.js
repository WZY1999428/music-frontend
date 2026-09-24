import request from ".."


export function getUserList(params) {
    return request({
        url: '/system/users/list',
        method: 'get',
        params
    })
}

export function getAllUser(params) {
    return request({
        url: '/system/users/all',
        method: 'get',
        params
    })
}


export function getUserInfo(id) {
    return request({
        url: '/system/users/' + id,
        method: 'get',
    })
}


export function saveUser(data) {
    return request({
        url: '/system/users/save',
        method: 'post',
        data
    })
}


export function deleteUser(id) {
    return request({
        url: '/system/users/del',
        method: 'delete',
        params: { id }
    })
}



