<template>
    <a-modal v-model:open="show" :title="title" :confirmLoading="confirmLoading" :width="600" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <a-form ref="formRef" :rules="rulesRef" :model="formData" :label-col="{ style: { width: '90px' } }"
                :disabled="readonly">
                <a-form-item name="title" label="歌词名称">
                    <a-input v-model:value.trim="formData.title" placeholder="请输入歌曲名称" />
                </a-form-item>
                <a-form-item name="lang" label="歌词语言">
                    <DictSelect dictKey="LYRICS_LANGUAGE" v-model="formData.lang" />
                </a-form-item>
                <a-form-item name="sort" label="排序">
                    <a-input-number style="width:100%" v-model:value="formData.sort" placeholder="请输入排序" />
                </a-form-item>
                <a-form-item name="content" label="歌词内容">
                    <a-textarea v-model:value.trim="formData.content" placeholder="请输入歌词内容" :rows="10" />
                </a-form-item>
                <a-form-item name="enabled" label="是否启用">
                    <a-switch v-model:checked="formData.enabled" :checkedValue="1" :unCheckedValue="0" />
                </a-form-item>
            </a-form>
        </a-spin>
        <template #footer>
            <template v-if="!readonly">
                <a-button @click="show = false">取消</a-button>
                <a-button type="primary" :loading="confirmLoading" @click="submit">保存</a-button>
            </template>
        </template>
    </a-modal>
</template>


<script setup>
import { message } from 'ant-design-vue';
import { getLyricsInfo, saveLyrics } from "@/request/music/song.js"
import DictSelect from "@/components/dictSelect"
import { reactive } from "vue"
const props = defineProps({
    id: [Number, String],
    songId: [Number, String],
    readonly: Boolean,
})

const show = defineModel({
    type: Boolean,
    default: false
})

const formData = ref({})
const formRef = ref(null)
const rulesRef = reactive({
    name: { required: true, message: '请输入歌手名称', },
})

const title = computed(() => (props.id && props.readonly) ? '歌词详情' : props.id ? '编辑歌词' : '新增歌词')
const emits = defineEmits(["saveSuccess"])

const detailLoading = ref(false)
const confirmLoading = ref(false)

function submit() {
    formRef.value?.validate().then(() => {
        confirmLoading.value = true;
        saveLyrics({ id: props.id, ...formData.value }).then(() => {
            message.success("保存成功")
            show.value = false
            emits("saveSuccess");
        }).finally(() => confirmLoading.value = false)
    })
}


function fetchInfo() {
    detailLoading.value = true;
    getLyricsInfo(props.id).then(initForm).finally(() => detailLoading.value = false)
}



watch(() => show.value, (newVal) => {
    initForm()
    if (newVal) {
        if (props.id) fetchInfo()
    }
});

function initForm(data = {}) {
    formData.value = {
        songId: props.songId,
        title: data.title,
        lang: data.lang,
        content: data.content,
        sort: data.sort ?? 1,
        enabled: data.enabled ?? 1,
        format: data.format
    }
}

</script>