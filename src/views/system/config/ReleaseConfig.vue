<template>
    <div class="w-full h-full bg-white p-6 rounded-lg ">
        <!-- 1. 站点基础设置 -->
        <div class="max-w-2xl px-4 py-2">
            <a-form ref="siteFormRef" :model="formData" :rules="rules" :label-col="{ style: { width: '120px' } }"
                @finish="submit" :wrapper-col="{ span: 20 }">
                <h1>app发布管理</h1>
                <a-form-item label="appUrl" name="appUrl">
                    <UploadFile v-model="formData.appUrl" mode="single" accept=".apk"></UploadFile>
                </a-form-item>

                <a-form-item label="app版本" name="appVersion">
                    <a-input v-model:value="formData.appVersion" placeholder="例如：1.0.0" allow-clear :max-length="50" />
                </a-form-item>
                <a-form-item label="发布描述" name="appDescription">
                    <a-textarea v-model:value="formData.appDescription" placeholder="例如：修复了一些bug" allow-clear
                        :max-length="200" :rows="4" />
                </a-form-item>
                <a-form-item>
                    <div class=" mt-6 w-full flex items-center justify-center">
                        <a-button type="primary" :loading="saving" html-type="submit"
                            v-permission="'edit:config:site'">保存配置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import UploadFile from '@/components/uploadFile/index.vue';
import { message } from 'ant-design-vue';
import useConfigStore from "@/store/system/config"
const configStore = useConfigStore();
import { saveReleaseConfig, getReleaseConfig } from "@/request/system/config"
const saving = ref(false);
const siteFormRef = ref(null)
const formData = reactive({
    appUrl: null,
    appVersion: '',
    appDescription: ""
});


const rules = {
    appUrl: [{
        required: true, validator: (_, file) => {
            console.log(file);
            if (!file || typeof file !== 'object' || !file.id) {
                return Promise.reject(new Error('请上传APP'));
            }
            return Promise.resolve();
        }, trigger: 'change'
    }],
    appVersion: [{
        required: true,
        trigger: 'change',
        validator: (_, value) => {
            const reg = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
            if (!reg.test(value)) {
                return Promise.reject(new Error('版本号格式必须为 x.x.x，例如 1.1.1'));
            }
            return Promise.resolve();
        }
    }],
};

const fetchSystemConfig = async () => {
    getReleaseConfig().then(res => {
        formData.appUrl = res.appUrl;
        formData.appVersion = res.appVersion;
        formData.appDescription = res.appDescription
    })
};


function submit() {
    siteFormRef.value.validate().then(() => {
        saving.value = true;
        saveReleaseConfig(formData).then(() => {
            configStore.fetchConfig();
            message.success('保存成功');
        }).finally(() => {
            saving.value = false;
        });
    });
}


onMounted(() => {
    fetchSystemConfig();
});
</script>

<style scoped>
.config-tabs :deep(.ant-tabs-nav) {
    min-width: 140px;
}

.config-tabs :deep(.ant-divider-inner-text) {
    font-size: 13px;
    color: #8c8c8c;
    font-weight: normal;
}
</style>