import request from ".."


export function getAppBannerList(params) {
    return request({
        url: '/app/banner/list',
        method: 'get',
        params
    })
}


export function getAppBannerDetail(id) {
    return request({
        url: '/app/banner/' + id,
        method: 'get',
    })
}



export function getAppBannerInfo(id) {
    return request({
        url: '/app/banner/' + id,
        method: 'get',
    })
}


export function saveAppBanner(data) {
    return request({
        url: '/app/banner/save',
        method: 'post',
        data
    })
}



export function delAppBanner(id) {
    return request({
        url: '/app/banner/del',
        method: 'delete',
        params: { id }
    })
}



