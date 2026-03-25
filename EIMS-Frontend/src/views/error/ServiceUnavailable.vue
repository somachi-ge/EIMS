<template>
    <div class="service-unavailable-page">
        <div class="service-unavailable-content">
            <div class="error-icon">
                <ToolOutlined />
            </div>
            <div class="error-code">503</div>
            <h1 class="error-title">服务维护中</h1>
            <p class="error-desc">系统正在维护升级，请稍后再试</p>
            <div class="maintenance-info">
                <div class="info-item">
                    <ClockCircleOutlined />
                    <span>预计维护时间：{{ maintenanceTime }}</span>
                </div>
            </div>
            <div class="error-actions">
                <a-button type="primary" size="large" @click="reload">
                    <ReloadOutlined />
                    刷新重试
                </a-button>
                <a-button size="large" @click="contactSupport">
                    <CustomerServiceOutlined />
                    联系客服
                </a-button>
            </div>
        </div>
        <div class="error-decoration">
            <div class="progress-ring">
                <div class="progress-circle"></div>
                <div class="progress-mask"></div>
            </div>
            <div class="floating-tools">
                <div class="tool tool-1"><WrenchOutlined /></div>
                <div class="tool tool-2"><ThunderboltOutlined /></div>
                <div class="tool tool-3"><BugOutlined /></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    ReloadOutlined,
    CustomerServiceOutlined,
    ToolOutlined,
    ClockCircleOutlined,
    ThunderboltOutlined,
    BugOutlined,
    ToolOutlined as WrenchOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const maintenanceTime = ref('2小时');

const reload = () => {
    window.location.reload();
};

const contactSupport = () => {
    message.info('客服功能即将上线，请拨打热线：400-888-8888');
};
</script>

<style scoped lang="scss">
.service-unavailable-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%);
    position: relative;
    overflow: hidden;
}

.service-unavailable-content {
    text-align: center;
    z-index: 10;
    padding: 40px;
}

.error-icon {
    font-size: 100px;
    color: #52c41a;
    margin-bottom: 24px;

    :deep(.anticon) {
        filter: drop-shadow(0 4px 12px rgba(82, 196, 26, 0.3));
        animation: bounce 2s ease-in-out infinite;
    }
}

@keyframes bounce {
    0%, 100% {
        transform: translateY(0);
    }
    50% {
        transform: translateY(-10px);
    }
}

.error-code {
    font-size: 100px;
    font-weight: 700;
    color: #52c41a;
    line-height: 1;
    margin-bottom: 24px;
    text-shadow: 4px 4px 0 rgba(82, 196, 26, 0.1);
}

.error-title {
    font-size: 32px;
    font-weight: 600;
    color: #262626;
    margin-bottom: 16px;
}

.error-desc {
    font-size: 16px;
    color: #8c8c8c;
    margin-bottom: 24px;
}

.maintenance-info {
    margin-bottom: 40px;

    .info-item {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: rgba(82, 196, 26, 0.1);
        border-radius: 8px;
        color: #52c41a;
        font-size: 14px;

        :deep(.anticon) {
            font-size: 16px;
        }
    }
}

.error-actions {
    display: flex;
    gap: 16px;
    justify-content: center;

    :deep(.ant-btn) {
        min-width: 140px;
        height: 44px;
        border-radius: 8px;
        font-size: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;

        &.ant-btn-primary {
            background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
            border: none;

            &:hover {
                background: linear-gradient(135deg, #73d13d 0%, #95de64 100%);
            }
        }
    }
}

.error-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;

    .progress-ring {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 400px;
        height: 400px;

        .progress-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border: 4px solid rgba(82, 196, 26, 0.1);
            border-top-color: #52c41a;
            border-radius: 50%;
            animation: spin 2s linear infinite;
        }

        .progress-mask {
            position: absolute;
            top: 10px;
            left: 10px;
            right: 10px;
            bottom: 10px;
            border: 4px solid rgba(82, 196, 26, 0.05);
            border-radius: 50%;
        }
    }

    .floating-tools {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;

        .tool {
            position: absolute;
            font-size: 32px;
            color: rgba(82, 196, 26, 0.2);

            &.tool-1 {
                top: 15%;
                left: 10%;
                animation: float 4s ease-in-out infinite;
            }

            &.tool-2 {
                top: 25%;
                right: 15%;
                animation: float 5s ease-in-out infinite 0.5s;
            }

            &.tool-3 {
                bottom: 20%;
                left: 20%;
                animation: float 6s ease-in-out infinite 1s;
            }
        }
    }
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes float {
    0%, 100% {
        transform: translateY(0) rotate(0deg);
    }
    50% {
        transform: translateY(-20px) rotate(10deg);
    }
}

@media (max-width: 768px) {
    .error-icon {
        font-size: 70px;
    }

    .error-code {
        font-size: 72px;
    }

    .error-title {
        font-size: 24px;
    }

    .error-desc {
        font-size: 14px;
    }

    .maintenance-info {
        .info-item {
            padding: 10px 16px;
            font-size: 13px;
        }
    }

    .error-actions {
        flex-direction: column;
        align-items: center;

        :deep(.ant-btn) {
            width: 200px;
        }
    }

    .progress-ring {
        width: 280px !important;
        height: 280px !important;
    }

    .tool {
        font-size: 24px !important;
    }
}
</style>
