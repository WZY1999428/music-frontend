<template>
    <a-upload v-model:file-list="fileList" action="/admin-api/upload/avatar" name="avatar" :maxCount="1"
        @change="handleChange" accept=".png, .jpeg, .gif, .webp" :headers="{ authorization: getToken() }"
        list-type="picture-card">
        <div v-if="fileList.length < 1">
            <UploadOutlined />
            <div style="margin-top: 8px">上传图片</div>
        </div>
    </a-upload>
</template>


<script setup>
import { UploadOutlined } from '@ant-design/icons-vue';

const fileList = ref([])

const modelValue = defineModel({ type: String })

watch(() => modelValue.value, setAvatar)

setAvatar();
function setAvatar() {
    if (!modelValue.value) {
        fileList.value = []
        return
    }
    const filename = modelValue.value.split('/').pop() || "avatar.png"
    fileList.value = [{
        uid: Date.now().toString(),
        name: filename,
        status: 'done',
        url: modelValue.value
    }]
}

function handleChange({ file }) {
    if (file.status === "error") {
        message.error(`${file.name} : 上传失败 ${file.response?.msg || '未知错误'}`);
        fileList.value = []
        return;
    }

    if (file.status === 'done') {
        const { code, data } = file.response
        if (code === 0) {
            fileList.value[0].url = data.url
            fileList.value[0].name = data.name
            fileList.value[0].status = 'done'
            fileList.value[0].uid = fileList.value[0].uid
            modelValue.value = data.url
        }
    }
}

</script>