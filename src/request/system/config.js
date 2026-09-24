import request from ".."


export function getConfigSiteInfo() {
    return request({
        url: '/system/config/site/info',
        method: 'get',
    })
}



export function saveConfigSiteInfo(data) {
    return request({
        url: '/system/config/site/save',
        method: 'post',
        data
    })
}


export function getConfigInfo() {
    return request({
        url: '/system/config/info',
        method: 'get',
    })
}

