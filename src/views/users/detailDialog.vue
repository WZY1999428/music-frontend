<template>
    <a-modal v-model:open="show" title=" " :confirmLoading="confirmLoading" :width="1200" destroyOnClose>
        <a-spin tip="加载中..." :spinning="detailLoading">
            <div class="user-detail">
                <!-- 基本资料 -->
                <section class="detail-section">
                    <div class="section-heading">
                        <div class="section-icon">
                            <iconify-icon icon="lucide:user-round" />
                        </div>
                        <div>
                            <div class="section-title">基本资料</div>
                            <div class="section-description">用户的个人信息与联系方式</div>
                        </div>
                    </div>

                    <a-descriptions :column="3" bordered size="middle" class="user-descriptions">
                        <a-descriptions-item label="用户名">{{ detail.username || '-' }}</a-descriptions-item>

                        <a-descriptions-item label="用户昵称">{{ detail.nickname || '-' }}</a-descriptions-item>

                        <a-descriptions-item label="生日"> {{ detail.birthday || '-' }} </a-descriptions-item>

                        <a-descriptions-item label="手机号"> {{ detail.phone || '-' }}</a-descriptions-item>

                        <a-descriptions-item label="邮箱" :span="2"> {{ detail.email || '-' }}</a-descriptions-item>
                    </a-descriptions>
                </section>

                <!-- 用户行为 -->
                <section class="detail-section activity-section">
                    <div class="section-heading">
                        <div class="section-icon">
                            <iconify-icon icon="lucide:activity" />
                        </div>
                        <div>
                            <div class="section-title">用户活动</div>
                            <div class="section-description">查看用户的音乐内容与行为记录</div>
                        </div>
                    </div>

                    <div class="tabs-container">
                        <a-tabs v-model:activeKey="activeKey" :destroyInactiveTabPane="false" class="user-detail-tabs">
                            <a-tab-pane key="create">
                                <template #tab>
                                    <span class="tab-label">
                                        <iconify-icon icon="lucide:list-music" />
                                        创建歌单
                                    </span>
                                </template>
                                <div class="tab-content">
                                    <CreatePlaylists :userId="id" />
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="collect">
                                <template #tab>
                                    <span class="tab-label">
                                        <iconify-icon icon="lucide:heart" />
                                        收藏歌单
                                    </span>
                                </template>
                                <div class="tab-content">
                                    <CollectPlaylists :userId="id" />
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="album">
                                <template #tab>
                                    <span class="tab-label">
                                        <iconify-icon icon="lucide:disc-3" />
                                        收藏专辑
                                    </span>
                                </template>
                                <div class="tab-content">
                                    <CollectAlbums :userId="id" />
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="artist">
                                <template #tab>
                                    <span class="tab-label">
                                        <iconify-icon icon="lucide:mic-2" />
                                        关注歌手
                                    </span>
                                </template>
                                <div class="tab-content">
                                    <FollowArtists :userId="id" />
                                </div>
                            </a-tab-pane>

                            <a-tab-pane key="history">
                                <template #tab>
                                    <span class="tab-label">
                                        <iconify-icon icon="lucide:history" />
                                        历史播放
                                    </span>
                                </template>
                                <div class="tab-content">
                                    <PlayHistory :userId="id" />
                                </div>
                            </a-tab-pane>
                        </a-tabs>
                    </div>
                </section>
            </div>
        </a-spin>

        <template #footer>
            <div class="modal-footer">
                <a-button @click="show = false">
                    关闭
                </a-button>
            </div>
        </template>
    </a-modal>
</template>


<script setup>
import CreatePlaylists from './components/CreatePlaylists.vue';
import CollectPlaylists from './components/CollectPlaylists.vue';
import CollectAlbums from './components/CollectAlbums.vue';
import FollowArtists from './components/FollowArtists.vue';
import PlayHistory from './components/PlayHistory.vue';
import { getAppUserDetail } from "@/request/app/user"

const activeKey = ref('create')
const props = defineProps({
    id: [Number, String],
    readonly: Boolean,
})
const detail = ref({})
const emits = defineEmits(["saveSuccess"])

const show = defineModel({
    type: Boolean,
    default: false
})
const detailLoading = ref(false)
const confirmLoading = ref(false)

watch(() => show.value, (newVal) => {
    if (newVal && props.id) {
        detailLoading.value = true
        getAppUserDetail(props.id).then(data => {
            detail.value = data
        }).finally(() => {
            detailLoading.value = false
        })
    }
});

</script>

<style lang="scss" scoped>
/* 用户详情弹窗 */
.user-detail {
    padding: 0 4px 8px;
    color: #1f2937;
}

/* 顶部用户卡片 */
.user-header {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 24px;
    margin-bottom: 24px;
    border: 1px solid #e8eaf0;
    border-radius: 12px;
    background:
        radial-gradient(circle at 100% 0%,
            rgba(99, 102, 241, 0.09),
            transparent 36%),
        linear-gradient(135deg, #fafbff 0%, #ffffff 100%);
}

.user-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 64px;
    height: 64px;
    border-radius: 18px;
    color: #fff;
    font-size: 26px;
    font-weight: 600;
    background: linear-gradient(135deg, #818cf8, #6366f1);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.2);
}

.user-header-info {
    flex: 1;
    min-width: 0;
}

.user-name {
    overflow: hidden;
    color: #111827;
    font-size: 20px;
    font-weight: 650;
    line-height: 1.5;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-subtitle {
    display: flex;
    align-items: center;
    gap: 9px;
    margin-top: 5px;
    color: #8b93a5;
    font-size: 13px;
}

.user-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #c0c5d0;
}

.user-status {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 6px 11px;
    border: 1px solid #e0e7ff;
    border-radius: 20px;
    color: #6366f1;
    background: #eef2ff;
    font-size: 12px;
    white-space: nowrap;
}

.status-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #818cf8;
}

/* 内容分区 */
.detail-section {
    margin-bottom: 26px;
}

.section-heading {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
}

.section-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
    border-radius: 10px;
    color: #6366f1;
    background: #eef2ff;
    font-size: 19px;
}

.section-title {
    color: #1f2937;
    font-size: 15px;
    font-weight: 650;
}

.section-description {
    margin-top: 3px;
    color: #9ca3af;
    font-size: 12px;
}

/* 基本资料表格 */
.user-descriptions {
    overflow: hidden;
    border-radius: 10px;
}

.user-descriptions .ant-descriptions-item-label {
    color: #6b7280;
    background: #f8f9fc !important;
    font-size: 13px;
    white-space: nowrap;
}

.user-descriptions .ant-descriptions-item-content {
    color: #374151;
    font-size: 13px;
    overflow-wrap: anywhere;
}

/* 活动记录 Tabs */
.tabs-container {
    overflow: hidden;
    min-height: 360px;
    border: 1px solid #e8eaf0;
    border-radius: 12px;
    background: #fff;
}

.user-detail-tabs {
    padding: 0 20px;
}

.user-detail-tabs .ant-tabs-nav {
    margin-bottom: 0;
}

.user-detail-tabs .ant-tabs-tab {
    padding: 17px 2px;
    color: #6b7280;
    font-size: 13px;
    transition: color 0.2s ease;
}

.user-detail-tabs .ant-tabs-tab:hover {
    color: #6366f1;
}

.user-detail-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #6366f1;
    font-weight: 600;
}

.user-detail-tabs .ant-tabs-ink-bar {
    height: 3px;
    border-radius: 3px 3px 0 0;
    background: #6366f1;
}

.tab-label {
    display: inline-flex;
    align-items: center;
    gap: 7px;
}

.tab-label>* {
    font-size: 15px;
}

.tab-content {
    min-height: 320px;
    padding: 20px 0;
}

/* 底部操作栏 */
.modal-footer {
    display: flex;
    justify-content: flex-end;
    padding-top: 4px;
}

/* 窄屏适配 */
@media (max-width: 768px) {
    .user-header {
        gap: 12px;
        padding: 16px;
    }

    .user-avatar {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        font-size: 20px;
    }

    .user-name {
        font-size: 17px;
    }

    .user-status {
        display: none;
    }

    .user-detail-tabs {
        padding: 0 12px;
    }

    .user-detail-tabs .ant-tabs-tab {
        margin-right: 16px;
    }
}
</style>