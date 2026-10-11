<template>
    <div class="w-full h-full bg-white p-6 rounded-lg ">
        <!-- 1. 站点基础设置 -->
        <div class="max-w-2xl px-4 py-2">
            <a-form ref="siteFormRef" :model="formData" :rules="rules" :label-col="{ style: { width: '120px' } }"
                @finish="submit" :wrapper-col="{ span: 20 }">
                <h1>站点信息</h1>

                <a-form-item label="系统Logo" name="logo">
                    <div class="flex gap-4 items-center">
                        <UploadImage v-model="formData.logo" mode="single"></UploadImage>
                    </div>
                </a-form-item>

                <a-form-item label="系统标题" name="systemTitle">
                    <a-input v-model:value="formData.systemTitle" placeholder="例如：后台管理系统" allow-clear
                        :max-length="50" />
                </a-form-item>

                <h1>备案与版权</h1>

                <a-form-item label="版权所属公司" name="copyrightCompany">
                    <a-input v-model:value="formData.copyrightCompany" placeholder="例如：郭德纲科技有限公司" />
                </a-form-item>

                <a-form-item label="版权年份" name="copyrightYear">
                    <a-input v-model:value="formData.copyrightYear" placeholder="例如：2020-2026" />
                </a-form-item>

                <a-divider orientation="left">工信部 ICP 备案</a-divider>
                <a-form-item label="ICP 备案号" name="icpNumber">
                    <a-input v-model:value="formData.icpNumber" placeholder="例如：京ICP备12345678号" />
                </a-form-item>

                <a-form-item label="ICP 跳转链接" name="icpLink">
                    <a-input v-model:value="formData.icpLink" placeholder="默认：https://beian.miit.gov.cn" />
                </a-form-item>

                <a-divider orientation="left">公安联网备案</a-divider>
                <div class="grid grid-cols-2 gap-4">
                    <a-form-item label="公安备案号" name="policeNumber">
                        <a-input v-model:value="formData.policeNumber" placeholder="例如：京公网安备 11010802020001号" />
                    </a-form-item>

                    <a-form-item label="公安备案跳转链接" name="policeLink">
                        <a-input v-model:value="formData.policeLink" placeholder="跳转至全国公安机关互联网站" />
                    </a-form-item>
                </div>

                <a-form-item>
                    <div class=" mt-6 w-full flex items-center justify-center">
                        <a-button type="primary" :loading="saving" html-type="submit" v-permission="'edit:config:site'">保存配置</a-button>
                    </div>
                </a-form-item>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import UploadImage from '@/components/uploadImage/index.vue';
import { message } from 'ant-design-vue';
import useConfigStore from "@/store/system/config"
const configStore = useConfigStore();
import { saveConfigSiteInfo, getConfigSiteInfo } from "@/request/system/config"
const saving = ref(false);
const siteFormRef = ref(null)
const formData = reactive({
    logo: null,
    systemTitle: '',
    copyrightCompany: '',
    copyrightYear: '',
    icpNumber: '',
    icpLink: '',
    policeNumber: '',
    policeLink: '',
});


const rules = {
    logo: [{
        required: true, validator: (_, file) => {
            console.log(file);
            if (!file || typeof file !== 'object' || !file.id) {
                return Promise.reject(new Error('请上传logo'));
            }
            return Promise.resolve();
        }, trigger: 'change'
    }],
    systemTitle: [{ required: true, trigger: 'change' }],
};

// 模拟接口获取并转化 config 数组数据
const fetchSystemConfig = async () => {
    getConfigSiteInfo().then(res => {
        console.log(res);
        formData.logo = res.logo;
        formData.systemTitle = res.systemTitle;
        formData.copyrightCompany = res.copyrightCompany;
        formData.copyrightYear = res.copyrightYear;
        formData.icpNumber = res.icpNumber;
        formData.icpLink = res.icpLink;
        formData.policeNumber = res.policeNumber;
        formData.policeLink = res.policeLink;
    })
};


function submit() {
    siteFormRef.value.validate().then(() => {
        saving.value = true;
        saveConfigSiteInfo(formData).then(() => {
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