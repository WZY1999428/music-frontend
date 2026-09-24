import request from ".."
export function getDictList(params) {
    return request({
        url: '/system/dictionary/list',
        method: 'get',
        params
    })
}

export function getDictInfo(id) {
    return request({
        url: '/system/dictionary/' + id,
        method: 'get',
    })
}



export function delDict(id) {
    return request({
        url: '/system/dictionary/del',
        method: 'delete',
        params: { id }
    })
}

export function saveDict(data) {
    return request({
        url: '/system/dictionary/save',
        method: 'post',
        data
    })
}




export function getDictItemList(params) {
    return request({
        url: '/system/dictionary/dictItem/list',
        method: 'get',
        params
    })
}

export function getDictItemInfo(id) {
    return request({
        url: '/system/dictionary/dictItem/' + id,
        method: 'get',
    })
}



export function delDictItem(id) {
    return request({
        url: '/system/dictionary/dictItem/del',
        method: 'delete',
        params: { id }
    })
}


export function saveDictItem(data) {
    return request({
        url: '/system/dictionary/dictItem/save',
        method: 'post',
        data
    })
}



export function getDicts() {
    return request({
        url: '/system/dictionary/dicts',
        method: 'get',
    })
}
