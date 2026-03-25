<template>
    <div class="server-error-page">
        <div class="server-error-content">
            <div class="error-icon">
                <ExceptionOutlined />
            </div>
            <div class="error-code">
                <span class="digit">5</span>
                <span class="digit">0</span>
                <span class="digit">0</span>
            </div>
            <h1 class="error-title">服务器错误</h1>
            <p class="error-desc">抱歉，服务器遇到了问题，请稍后重试</p>
            <div class="error-actions">
                <a-button type="primary" size="large" @click="reload">
                    <ReloadOutlined />
                    刷新页面
                </a-button>
                <a-button size="large" @click="goHome">
                    <HomeOutlined />
                    返回首页
                </a-button>
            </div>
        </div>
        <div class="error-decoration">
            <div class="gear gear-1">
                <SettingOutlined />
            </div>
            <div class="gear gear-2">
                <SettingOutlined />
            </div>
            <div class="gear gear-3">
                <SettingOutlined />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HomeOutlined, ReloadOutlined, ExceptionOutlined, SettingOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const reload = () => {
    window.location.reload();
};

const goHome = () => {
    router.push('/home');
};
</script>

<style scoped lang="scss">
.server-error-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff1f0 0%, #ffccc7 100%);
    position: relative;
    overflow: hidden;
}

.server-error-content {
    text-align: center;
    z-index: 10;
    padding: 40px;
}

.error-icon {
    font-size: 100px;
    color: #ff4d4f;
    margin-bottom: 24px;

    :deep(.anticon) {
        filter: drop-shadow(0 4px 12px rgba(255, 77, 79, 0.3));
        animation: pulse-icon 2s ease-in-out infinite;
    }
}

@keyframes pulse-icon {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

.error-code {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;

    .digit {
        font-size: 100px;
        font-weight: 700;
        color: #ff4d4f;
        line-height: 1;
        text-shadow: 4px 4px 0 rgba(255, 77, 79, 0.1);
        animation: glitch 2s ease-in-out infinite;

        &:nth-child(2) {
            animation-delay: 0.2s;
        }

        &:nth-child(3) {
            animation-delay: 0.4s;
        }
    }
}

@keyframes glitch {
    0%, 90%, 100% {
        transform: translateX(0);
    }
    92% {
        transform: translateX(-3px);
    }
    94% {
        transform: translateX(3px);
    }
    96% {
        transform: translateX(-2px);
    }
    98% {
        transform: translateX(2px);
    }
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
    margin-bottom: 40px;
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
            background: linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%);
            border: none;

            &:hover {
                background: linear-gradient(135deg, #ff7875 0%, #ffa39e 100%);
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

    .gear {
        position: absolute;
        font-size: 60px;
        color: rgba(255, 77, 79, 0.1);

        &.gear-1 {
            top: 10%;
            right: 15%;
            animation: rotate 10s linear infinite;
        }

        &.gear-2 {
            bottom: 20%;
            left: 10%;
            font-size: 80px;
            animation: rotate-reverse 15s linear infinite;
        }

        &.gear-3 {
            top: 50%;
            right: 5%;
            font-size: 40px;
            animation: rotate 8s linear infinite;
        }
    }
}

@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

@keyframes rotate-reverse {
    from {
        transform: rotate(360deg);
    }
    to {
        transform: rotate(0deg);
    }
}

@media (max-width: 768px) {
    .error-icon {
        font-size: 70px;
    }

    .error-code {
        gap: 8px;

        .digit {
            font-size: 60px;
        }
    }

    .error-title {
        font-size: 24px;
    }

    .error-desc {
        font-size: 14px;
    }

    .error-actions {
        flex-direction: column;
        align-items: center;

        :deep(.ant-btn) {
            width: 200px;
        }
    }

    .gear {
        &.gear-1 { font-size: 40px; }
        &.gear-2 { font-size: 50px; }
        &.gear-3 { display: none; }
    }
}
</style>
