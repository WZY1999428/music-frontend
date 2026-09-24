import request from ".."


export function getSongList(params) {
    return request({
        url: '/music/song/list',
        method: 'get',
        params
    })
}




export function getSongInfo(id) {
    return request({
        url: '/music/song/' + id,
        method: 'get',
    })
}


export function saveSong(data) {
    return request({
        url: '/music/song/save',
        method: 'post',
        data
    })
}



export function delSong(id) {
    return request({
        url: '/music/song/del',
        method: 'delete',
        params: { id }
    })
}


export function uploadAudio(data) {
    return request({
        url: '/upload/audio',
        method: 'post',
        timeout: 1000 * 60,
        headers: {
            'Content-Type': 'multipart/form-data'
        },
        data
    })
}
