import request from ".."
export function getDeptList(params) {
    return request({
        url: '/system/dept/list',
        method: 'get',
        params
    })
}


export function saveDept(data) {
    return request({
        url: '/system/dept/save',
        method: 'post',
        data
    })
}

export function getDeptTree() {
    return request({
        url: '/system/dept/deptTree',
        method: 'get',
    })
}


export function getDeptusers(params) {
    return request({
        url: '/system/dept/users',
        method: 'get',
        params
    })
}



export function getDeptInfo(id) {
    return request({
        url: '/system/dept/' + id,
        method: 'get',
    })
}



export function delDept(id) {
    return request({
        url: '/system/dept/del',
        method: 'delete',
        params: { id }
    })
}


export function getSelectUserList(params) {
    return request({
        url: '/system/dept/selectUser',
        method: 'get',
        params
    })
}

export function addDeptUsers(data) {
    return request({
        url: '/system/dept/addUsers',
        method: 'post',
        data
    })
}

export function delDeptUser(params) {
    return request({
        url: '/system/dept/delUser',
        method: 'delete',
        params
    })
}
