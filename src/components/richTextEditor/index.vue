<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" v-if="!disabled" :editor="editorRef"
            :defaultConfig="toolbarConfig" />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml" :readOnly="disabled"
            :defaultConfig="editorConfig" @onCreated="handleCreated" />
    </div>
</template>


<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { message } from "ant-design-vue"
const UPLOAD_URL = '/admin-api/upload/public'
const valueHtml = defineModel({
    type: String,
    default: ''
})

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    }
})

const editorRef = shallowRef()
const toolbarConfig = {
    excludeKeys: [
        'fullScreen'
    ]
}

const editorConfig = {
    placeholder: '请输入内容...',
    MENU_CONF: {
        uploadImage: {
            server: UPLOAD_URL,
            fieldName: 'file',
            maxFileSize: 2 * 1024 * 1024, // 1M
            maxNumberOfFiles: 10,
            allowedFileTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'],
            metaWithUrl: false,
            headers: {
                authorization: getToken()
            },
            onError,
            // 自定义插入图片
            customInsert(res, insertFn) {
                const data = res.data;
                insertFn(data.url, data.filename, data.url)
            },
            withCredentials: true,
            timeout: 30 * 1000, // 5 秒
        },
        uploadVideo: {
            server: UPLOAD_URL,
            fieldName: 'file',
            maxFileSize: 100 * 1024 * 1024, // 100M
            maxNumberOfFiles: 1,
            allowedFileTypes: ['video/mp4', 'image/webm', 'image/ogg'],
            metaWithUrl: false,
            headers: {
                authorization: getToken()
            },
            onError,
            customInsert(res, insertFn) {
                const data = res.data;
                insertFn(data.url)
            },
            withCredentials: true,
            timeout: 30 * 1000, // 5 秒 
        }
    }
}


function onError(_file, err, res) {
    message.error(err)
    if (res && res.status == 401) {
        message.error("登录已过期，请重新登录");
        removeToken();
        window.location.replace('/login');
    }
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    valueHtml.value = ""
    if (editor == null) return
    editor.destroy()
})



const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

watch(() => props.disabled, setEditReadOnly)

setEditReadOnly(props.disabled)
function setEditReadOnly(disabled) {
    editorConfig.readOnly = disabled

}

</script>