import request from "."


export function login(data) {
    return request({
        url: '/user/login',
        method: 'post',
        data
    })
}


export function loginOut() {
    return request({
        url: '/user/logout',
        method: 'get',
    })
}


export function getUserInfo() {
    return request({
        url: '/user/info',
        method: 'get'
    })
}


export function getRoles() {
    return request({
        url: '/user/roles',
        method: 'get'
    })
}


export function switchRole(roleId) {
    return request({
        url: '/user/switchRole',
        method: 'post',
        data: { roleId }
    })
}


export function editPwd(data) {
    return request({
        url: '/user/editPwd',
        method: 'put',
        data
    })
}


export function editUserInfo(data) {
    return request({
        url: '/user/edit',
        method: 'put',
        data
    })
}
