<template>
    <div class="not-found-page">
        <div class="not-found-content">
            <div class="error-code">
                <span class="digit">4</span>
                <div class="zero-container">
                    <div class="zero-ring"></div>
                    <div class="zero-inner"></div>
                </div>
                <span class="digit">4</span>
            </div>
            <h1 class="error-title">页面未找到</h1>
            <p class="error-desc">抱歉，您访问的页面不存在或已被移除</p>
            <div class="error-actions">
                <a-button type="primary" size="large" @click="goHome">
                    <HomeOutlined />
                    返回首页
                </a-button>
                <a-button size="large" @click="goBack">
                    <RollbackOutlined />
                    返回上一页
                </a-button>
            </div>
        </div>
        <div class="error-decoration">
            <div class="decoration-circle circle-1"></div>
            <div class="decoration-circle circle-2"></div>
            <div class="decoration-circle circle-3"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const goHome = () => {
    router.push('/home');
};

const goBack = () => {
    router.back();
};
</script>

<style scoped lang="scss">
.not-found-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
    position: relative;
    overflow: hidden;
}

.not-found-content {
    text-align: center;
    z-index: 10;
    padding: 40px;
}

.error-code {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-bottom: 40px;

    .digit {
        font-size: 180px;
        font-weight: 700;
        color: #1890ff;
        line-height: 1;
        text-shadow: 4px 4px 0 rgba(24, 144, 255, 0.1);
    }
}

.zero-container {
    position: relative;
    width: 140px;
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;

    .zero-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        border: 12px solid #1890ff;
        border-radius: 50%;
        animation: pulse 2s ease-in-out infinite;
    }

    .zero-inner {
        position: absolute;
        width: 60%;
        height: 60%;
        background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
        border-radius: 50%;
        opacity: 0.2;
    }
}

@keyframes pulse {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.05);
        opacity: 0.8;
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
            background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
            border: none;

            &:hover {
                background: linear-gradient(135deg, #40a9ff 0%, #69c0ff 100%);
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

    .decoration-circle {
        position: absolute;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(24, 144, 255, 0.08) 0%, rgba(24, 144, 255, 0.02) 100%);

        &.circle-1 {
            width: 400px;
            height: 400px;
            top: -100px;
            right: -100px;
        }

        &.circle-2 {
            width: 300px;
            height: 300px;
            bottom: -50px;
            left: -50px;
        }

        &.circle-3 {
            width: 200px;
            height: 200px;
            top: 50%;
            left: 10%;
            transform: translateY(-50%);
        }
    }
}

@media (max-width: 768px) {
    .error-code {
        gap: 12px;

        .digit {
            font-size: 100px;
        }
    }

    .zero-container {
        width: 80px;
        height: 80px;

        .zero-ring {
            border-width: 8px;
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
}
</style>
