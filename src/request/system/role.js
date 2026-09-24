import request from ".."
export function getRoleList(params) {
    return request({
        url: '/system/roles/list',
        method: 'get',
        params
    })
}


export function getRoleOptions() {
    return request({
        url: '/system/roles/options',
        method: 'get',
    })
}




export function saveRole(data) {
    return request({
        url: '/system/roles/save',
        method: 'post',
        data
    })
}


export function getRoleInfo(id) {
    return request({
        url: '/system/roles/info',
        method: 'get',
        params: { id }
    })
}

export function delRole(id) {
    return request({
        url: '/system/roles/del',
        method: 'delete',
        params: { id }
    })
}




export function saveRoleMembers(data) {
    return request({
        url: '/system/roles/members/save',
        method: 'post',
        data
    })
}

export function getRoleUsers(id) {
    return request({
        url: '/system/roles/users',
        method: 'get',
        params: { id }
    })
}
export function saveRoleUsers(data) {
    return request({
        url: '/system/roles/saveUsers',
        method: 'post',
        data
    })
}


export function saveRolePermissions(data) {
    return request({
        url: '/system/roles/permissions',
        method: 'post',
        data
    })
}


export function getRolePermissionsIds(roleId) {
    return request({
        url: '/system/roles/permissionsIds',
        method: 'get',
        params:{roleId}
    })
}