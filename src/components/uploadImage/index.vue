<template>
    <a-upload v-model:file-list="fileList" action="/admin-api/upload/public" :headers="{ authorization: getToken() }"
        :accept="accept" list-type="picture-card" :max-count="maxCount" :before-upload="beforeUpload"
        @change="handleChange" @preview="handlePreview" @remove="handleRemove" :data="{ path: savePath }">
        <div v-if="(fileList.length < maxCount && mode === 'array') || (fileList.length === 0 && mode === 'single')">
            <UploadOutlined />
            <div style="margin-top: 8px">
                上传图片
            </div>
        </div>
    </a-upload>
    <div style="position: fixed; top: 0; left: 0; z-index: 9999;">
        <a-image :width="200" :style="{ display: 'none' }" :preview="{ visible, onVisibleChange }" :src="previewImage" />
    </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined } from '@ant-design/icons-vue';

const props = defineProps({
    /**
     * object:
     * {
     *     id: 1,
     *     url: '/uploads/xxx.png'
     * }
     *
     * array:
     * [
     *     {
     *         id: 1,
     *         url: '/uploads/xxx.png'
     *     }
     * ]
     */

    // single: 单图
    // array: 多图
    mode: {
        type: String,
        default: 'array',
        validator: value => ['single', 'array'].includes(value)
    },
    savePath: {
        type: String,
        default: ''
    },
    // 单个文件最大大小，单位 MB
    size: {
        type: Number,
        default: 5
    },

    maxCount: {
        type: Number,
        default: 8
    }
});


const modelValue = defineModel({
    type: [Array, Object],
    default: undefined
});
/**
 * 支持的图片类型
 */
const accept = 'image/png,image/jpeg,image/jpg,image/gif,image/webp';

const allowTypes = new Set([
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp'
]);

const fileList = ref([]);

const visible = ref(false);
const previewImage = ref(null);

/**
 * =========================
 * modelValue 校验
 * =========================
 */

function isValidFileValue(value) {
    if (!value || typeof value !== 'object') {
        return false;
    }

    return (
        Object.prototype.hasOwnProperty.call(value, 'id') &&
        Object.prototype.hasOwnProperty.call(value, 'url') &&
        value.id !== null &&
        value.id !== undefined &&
        value.url
    );
}

function validateModelValue(value) {
    if (props.mode === 'single') {
        if (value === undefined || value === null || value === '') {
            return true;
        }

        if (!isValidFileValue(value)) {
            console.warn('图片数据格式错误，需要 { id, url } 格式', value);
            return false;
        }

        return true;
    }

    if (value === undefined || value === null || value === '') {
        return true;
    }

    if (!Array.isArray(value)) {
        console.warn('图片数据格式错误，多图模式需要传入数组', value);
        return false;
    }

    const invalid = value.some(item => !isValidFileValue(item));

    if (invalid) {
        message.warning(
            '图片数据格式错误，数组中的每一项都需要 { id, url } 格式'
        );

        return false;
    }

    return true;
}

/**
 * =========================
 * modelValue -> fileList
 * =========================
 */
syncFileList();
function syncFileList() {
    if (!validateModelValue(modelValue.value)) {
        fileList.value = [];
        return;
    }

    if (props.mode === 'single') {
        if (!modelValue.value) {
            fileList.value = [];
            return;
        }

        fileList.value = [createFileItem(modelValue.value, 0)];

        return;
    }
    fileList.value = (modelValue.value || []).map(
        (item, index) => createFileItem(item, index)
    );
}

function createFileItem(item, index) {
    return {
        uid: `uploaded-${item.id}-${index}`,
        name: getFileName(item.url),
        status: 'done',
        url: item.url,
        response: {
            id: item.id,
            url: item.url
        }
    };
}

function getFileName(url) {
    if (!url) {
        return 'image';
    }

    return url.split('/').pop() || 'image';
}

/**
 * 初始化 + 外部修改同步
 */
watch(() => modelValue.value, syncFileList, {
    immediate: true,
    deep: true
});

/**
 * =========================
 * fileList -> modelValue
 * =========================
 */

function updateModelValue() {
    const values = fileList.value
        .filter(file => file.status === 'done')
        .map(file => {
            const data = file.response.data;

            return {
                id: data?.id,
                url: data?.url || file.url
            };
        })
        .filter(item => item.id !== undefined && item.url);

    if (props.mode === 'single') {
        modelValue.value = values.length > 0 ? values[0] : null;
    } else {
        modelValue.value = values;
    }
}

/**
 * =========================
 * 上传前校验
 * =========================
 */

function beforeUpload(file) {
    /**
     * 文件类型
     */
    if (!allowTypes.has(file.type)) {
        message.warning(
            `不支持 ${file.type || '该'} 文件类型，请上传 PNG、JPG、GIF 或 WEBP 图片`
        );

        return false;
    }

    /**
     * 文件大小
     */
    const maxSize = props.size * 1024 * 1024;

    if (file.size > maxSize) {
        message.warning(
            `图片大小不能超过 ${props.size}MB`
        );

        return false;
    }

    /**
     * 单图模式
     */
    if (props.mode === 'single' && fileList.value.length >= 1) {
        message.warning('只能上传一张图片');

        return false;
    }

    /**
     * 最大数量
     */
    if (fileList.value.length >= props.maxCount) {
        message.warning(
            `最多只能上传 ${props.maxCount} 张图片`
        );

        return false;
    }

    return true;
}

/**
 * =========================
 * 上传状态变化
 * =========================
 */

function handleChange({ file, fileList: list }) {
    fileList.value = list;

    if (file.status === 'done') {
        const response = file.response;
        /**
         * 根据你的后端实际返回结构调整
         *
         * 推荐：
         * {
         *     id: 123,
         *     url: "/uploads/xxx.png"
         * }
         */


        if (response.code == 1) {
            message.warning(response.message);
            file.status = 'error';
        }

        if (!response || response.data.id === undefined || !response.data.url) {
            message.warning(
                '上传成功，但服务器返回的文件信息格式错误，需要 { id, url }'
            );

            file.status = 'error';

            return;
        }


        /**
         * 保存后端返回的数据
         */
        file.url = response.data.url;
        file.id = response.data.id;
        updateModelValue();
    }

    if (file.status === 'error') {
        message.warning(
            `图片「${file.name}」上传失败`
        );
    }
}

/**
 * =========================
 * 删除
 * =========================
 */

function handleRemove() {
    /**
     * Ant Design 会自动从 v-model:file-list 中移除
     * 下一次 tick 后同步 modelValue
     */
    setTimeout(() => {
        updateModelValue();
    });

    return true;
}

/**
 * =========================
 * 预览
 * =========================
 */

function handlePreview(file) {
    previewImage.value = file.url || file.response?.data?.url;
    console.log(previewImage.value);
    if (!previewImage.value) {
        message.warning('图片地址不存在，无法预览');
        return;
    }

    onVisibleChange(true)
}

function onVisibleChange(value) {
    visible.value = value;
    console.log(visible.value);

}
</script>
