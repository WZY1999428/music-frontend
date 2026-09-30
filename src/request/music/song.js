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



export function getAlbumSongList(params) {
    return request({
        url: '/music/song/selectSong',
        method: 'get',
        params
    })
}



export function getLyricsList(params) {
    return request({
        url: '/music/song/lyrics/list',
        method: 'get',
        params
    })
}




export function getLyricsInfo(id) {
    return request({
        url: '/music/song/lyrics/' + id,
        method: 'get',
    })
}


export function saveLyrics(data) {
    return request({
        url: '/music/song/lyrics/save',
        method: 'post',
        data
    })
}



export function delLyrics(id) {
    return request({
        url: '/music/song/lyrics/del',
        method: 'delete',
        params: { id }
    })
}
