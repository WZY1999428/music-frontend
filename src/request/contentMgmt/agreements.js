import request from ".."


export function getAgreementsList() {
    return request({
        url: '/contentMgmt/agreements/list',
        method: 'get',
    })
}




export function getAgreementsInfo(id) {
    return request({
        url: '/contentMgmt/agreements/' + id,
        method: 'get',
    })
}





export function saveAgreements(data) {
    return request({
        url: '/contentMgmt/agreements/save',
        method: 'post',
        data
    })
}



export function delAgreements(id) {
    return request({
        url: '/contentMgmt/agreements/del',
        method: 'delete',
        params:{id}
    })
}



