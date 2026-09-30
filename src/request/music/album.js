import request from ".."


export function getAlbumList() {
    return request({
        url: '/music/album/list',
        method: 'get',
    })
}


export function getAlbumInfo(id) {
    return request({
        url: '/music/album/' + id,
        method: 'get',
    })
}


export function saveAlbum(data) {
    return request({
        url: '/music/album/save',
        method: 'post',
        data
    })
}


export function delAlbum(id) {
    return request({
        url: '/music/album/del',
        method: 'delete',
        params: { id }
    })
}




export function searchAlbum(keyword) {
    return request({
        url: '/music/album/search',
        method: 'get',
        params: { keyword }
    })
}

export function getAlbumSongList(albumId) {
    return request({
        url: '/music/album/albumSong',
        method: 'get',
        params: { albumId }
    })
}


export function saveAlbumSong(data) {
    return request({
        url: '/music/album/saveAlbumSong',
        method: 'post',
        data
    })
}

export function removeAlbumSong(params) {
    return request({
        url: '/music/album/albumSong',
        method: 'delete',
        params
    })
}