import request from ".."

export function getannounceMgmtList(params) {
    return request({
        url: '/contentMgmt/announceMgmt/list',
        method: 'get',
        params
    })
}

export function getAnnounceMgmtInfo(id) {
    return request({
        url: '/contentMgmt/announceMgmt/' + id,
        method: 'get',
    })
}





export function saveAnnounceMgmt(data) {
    return request({
        url: '/contentMgmt/announceMgmt/save',
        method: 'post',
        data
    })
}



export function delAnnounceMgmt(id) {
    return request({
        url: '/contentMgmt/announceMgmt/del',
        method: 'delete',
        params:{id}
    })
}



