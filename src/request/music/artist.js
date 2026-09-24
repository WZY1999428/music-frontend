import request from ".."


export function getArtistList() {
    return request({
        url: '/music/artist/list',
        method: 'get',
    })
}




export function getArtistInfo(id) {
    return request({
        url: '/music/artist/' + id,
        method: 'get',
    })
}





export function saveArtist(data) {
    return request({
        url: '/music/artist/save',
        method: 'post',
        data
    })
}



export function delArtist(id) {
    return request({
        url: '/music/artist/del',
        method: 'delete',
        params: { id }
    })
}




export function searchArtist(keyword) {
    return request({
        url: '/music/artist/search',
        method: 'get',
        params: { keyword }
    })
}



