import request from ".."


export function getUploadFiles(params) {
    return request({
        url: '/upload/files',
        method: 'get',
        params
    })
}




export function delUploadFiles(fileId) {
    return request({
        url: '/upload/files',
        method: 'delete',
        params: { fileId }
    })
}