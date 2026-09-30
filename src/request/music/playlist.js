import request from ".."


export function getPlaylist() {
    return request({
        url: '/music/playlist/list',
        method: 'get',
    })
}


export function getPlaylistInfo(id) {
    return request({
        url: '/music/playlist/' + id,
        method: 'get',
    })
}


export function savePlaylist(data) {
    return request({
        url: '/music/playlist/save',
        method: 'post',
        data
    })
}


export function delPlaylist(id) {
    return request({
        url: '/music/playlist/del',
        method: 'delete',
        params: { id }
    })
}


export function getPlaylistSongList(params) {
    return request({
        url: '/music/playlist/song',
        method: 'get',
        params
    })
}


export function savePlaylistSong(data) {
    return request({
        url: '/music/playlist/saveSong',
        method: 'post',
        data
    })
}

export function removePlaylistSong(params) {
    return request({
        url: '/music/playlist/song',
        method: 'delete',
        params
    })
}