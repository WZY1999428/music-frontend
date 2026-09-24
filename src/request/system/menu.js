import request from ".."
export function getRoutes() {
    return request({
        url: '/system/menu/routes',
        method: 'get'
    })
}



export function getMenuList(params) {
    return request({
        url: '/system/menu/list',
        method: 'get',
        params
    })
}



export function getMenuOptions() {
    return request({
        url: '/system/menu/options',
        method: 'get',
    })
}

export function getMenuTree() {
    return request({
        url: '/system/menu/tree',
        method: 'get',
    })
}


export function getMenuInfo(id) {
    return request({
        url: '/system/menu/' + id,
        method: 'get'
    })
}


export function getSystemApis() {
    return request({
        url: '/system/menu/apis',
        method: 'get'
    })
}



export function saveMenu(data) {
    return request({
        url: '/system/menu/save',
        method: 'post',
        data
    })
}

export function deleteMenu(id) {
    return request({
        url: '/system/menu/del',
        method: 'delete',
        params: {
            id
        }
    })
}


export function savePermissions(data) {
    return request({
        url: '/system/menu/savePermissions',
        method: 'post',
        data
    })
}


export function getPermissions(id) {
    return request({
        url: '/system/menu/permissions',
        method: 'get',
        params: {
            id
        }
    })
}

export function getPermissionsList(params) {
    return request({
        url: '/system/menu/permissionsList',
        method: 'get',
        params
    })
}


export function delPermissions(id) {
    return request({
        url: '/system/menu/delPermissions',
        method: 'delete',
        params: { id }
    })
}