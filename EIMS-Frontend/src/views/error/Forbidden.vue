<template>
    <div class="forbidden-page">
        <div class="forbidden-content">
            <div class="error-icon">
                <SafetyCertificateOutlined />
            </div>
            <div class="error-code">403</div>
            <h1 class="error-title">禁止访问</h1>
            <p class="error-desc">抱歉，您没有权限访问此页面</p>
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
            <div class="shield-decoration">
                <div class="shield-ring ring-1"></div>
                <div class="shield-ring ring-2"></div>
                <div class="shield-ring ring-3"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { HomeOutlined, RollbackOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';

const router = useRouter();

const goHome = () => {
    router.push('/home');
};

const goBack = () => {
    router.back();
};
</script>

<style scoped lang="scss">
.forbidden-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #fff7e6 0%, #ffe7ba 100%);
    position: relative;
    overflow: hidden;
}

.forbidden-content {
    text-align: center;
    z-index: 10;
    padding: 40px;
}

.error-icon {
    font-size: 120px;
    color: #fa8c16;
    margin-bottom: 24px;
    animation: shake 0.5s ease-in-out;

    :deep(.anticon) {
        filter: drop-shadow(0 4px 12px rgba(250, 140, 22, 0.3));
    }
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
}

.error-code {
    font-size: 100px;
    font-weight: 700;
    color: #fa8c16;
    line-height: 1;
    margin-bottom: 24px;
    text-shadow: 4px 4px 0 rgba(250, 140, 22, 0.1);
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
            background: linear-gradient(135deg, #fa8c16 0%, #ffa940 100%);
            border: none;

            &:hover {
                background: linear-gradient(135deg, #ffa940 0%, #ffc069 100%);
            }
        }
    }
}

.error-decoration {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;

    .shield-decoration {
        position: relative;
        width: 500px;
        height: 500px;

        .shield-ring {
            position: absolute;
            border: 2px solid rgba(250, 140, 22, 0.1);
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            &.ring-1 {
                width: 400px;
                height: 400px;
                animation: ripple 3s ease-out infinite;
            }

            &.ring-2 {
                width: 500px;
                height: 500px;
                animation: ripple 3s ease-out infinite 0.5s;
            }

            &.ring-3 {
                width: 600px;
                height: 600px;
                animation: ripple 3s ease-out infinite 1s;
            }
        }
    }
}

@keyframes ripple {
    0% {
        transform: translate(-50%, -50%) scale(0.8);
        opacity: 0.5;
    }
    100% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0;
    }
}

@media (max-width: 768px) {
    .error-icon {
        font-size: 80px;
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

    .error-actions {
        flex-direction: column;
        align-items: center;

        :deep(.ant-btn) {
            width: 200px;
        }
    }

    .shield-decoration {
        width: 300px !important;
        height: 300px !important;

        .shield-ring {
            &.ring-1 { width: 200px; height: 200px; }
            &.ring-2 { width: 260px; height: 260px; }
            &.ring-3 { width: 320px; height: 320px; }
        }
    }
}
</style>
