<template>
  <div class="login-page">
    <div class="brand-container">
      <div class="brand-content">
        <div class="brand-logo">
          <img src="@/assets/icons/logo_white.svg" alt="星珩科技" width="140">
        </div>
        <h1>星珩 · 企业综合管理系统</h1>
        <p>新质生产力 · 数字新基座 · 智领新纪元</p>
        <div class="brand-features">
          <div class="feature-item">
            <TeamOutlined style="font-size: 24px; margin-bottom: 12px;" />
            <span>高效协同</span>
          </div>
          <div class="feature-item">
            <LockOutlined style="font-size: 24px; margin-bottom: 12px;" />
            <span>安全可靠</span>
          </div>
          <div class="feature-item">
            <BarChartOutlined style="font-size: 24px; margin-bottom: 12px;" />
            <span>智能分析</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="login-container">
      <h2>欢迎回来</h2>
      <p>请登录访问企业综合管理系统</p>
      
      <div class="input-container">
        <a-form :model="formState" @finish="handleSubmit" layout="vertical">
          <a-form-item label="请输入账号" name="username" :rules="[{ required: true, message: '请输入账号' }]">
            <a-input v-model:value="formState.username" placeholder="支持工号/邮箱/手机号登录" @keyup.enter="handleSubmit">
              <template #prefix>
                <UserOutlined class="input-icon" />
              </template>
            </a-input>
          </a-form-item>
          
          <a-form-item label="请输入密码" name="password" :rules="[{ required: true, message: '请输入密码' }]">
            <a-input-password v-model:value="formState.password" placeholder="区分大小写，长度8-20位" @keyup.enter="handleSubmit">
              <template #prefix>
                <LockOutlined class="input-icon" />
              </template>
            </a-input-password>
          </a-form-item>
        </a-form>
      </div>
      
      <div class="action-container">
        <div class="form-actions">
          <a-checkbox v-model:checked="rememberAccount">记住账号</a-checkbox>
          <a @click.prevent="showForgotPasswordModal = true">忘记密码</a>
        </div>
        
        <a-button type="primary" html-type="submit" class="login-btn" @click="handleSubmit">
          <LoginOutlined style="margin-right: 8px;" /> 登录
        </a-button>
        
        <div class="form-footer">
          <a @click.prevent="saveToDesktop">
            <DesktopOutlined style="margin-right: 4px;" /> 保存至桌面
          </a>
          <a @click.prevent="showRegisterModal = true">自助注册</a>
        </div>
      </div>
    </div>
    
    <a-modal
      v-model:open="showForgotPasswordModal"
      title="重置密码"
      @ok="resetPassword"
      @cancel="closeForgotPasswordModal"
      okText="重置"
      cancelText="取消"
      width="550px"
    >
      <a-form :model="forgotPasswordForm" layout="vertical">
        <a-form-item name="email" :rules="[{ required: true, message: '请输入有效的邮箱地址' }]">
          <template #label>邮箱</template>
          <a-input v-model:value="forgotPasswordForm.email" placeholder="请输入您的电子邮箱地址" @keyup.enter="resetPassword">
            <template #prefix>
              <MailOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="verifyCode" :rules="[{ required: true, message: '请输入6位验证码' }]">
          <template #label>验证码</template>
          <a-row :gutter="16">
            <a-col :span="16">
              <a-input v-model:value="forgotPasswordForm.verifyCode" placeholder="请输入6位验证码" @keyup.enter="resetPassword">
                <template #prefix>
                  <CodeOutlined class="input-icon" />
                </template>
              </a-input>
            </a-col>
            <a-col :span="8">
              <a-button 
                :disabled="countdown > 0" 
                @click="sendVerifyCode"
                type="default"
                class="verify-code-btn"
              >
                {{ countdown > 0 ? `${countdown}秒后重发` : '发送验证码' }}
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item name="newPassword" :rules="[{ required: true, message: '请输入新密码' }]">
          <template #label>新密码</template>
          <a-input-password v-model:value="forgotPasswordForm.newPassword" placeholder="请输入新密码（8-20位，包含字母和数字并区分大小写）" @keyup.enter="resetPassword">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="confirmPassword" :rules="[{ required: true, message: '请再次输入新密码' }]">
          <template #label>确认新密码</template>
          <a-input-password v-model:value="forgotPasswordForm.confirmPassword" placeholder="请再次输入新密码" @keyup.enter="resetPassword">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
      </a-form>
    </a-modal>
    
    <a-modal
      v-model:open="showRegisterModal"
      title="自助注册"
      @ok="handleRegister"
      @cancel="closeRegisterModal"
      okText="注册"
      cancelText="取消"
      width="550px"
    >
      <a-form :model="registerForm" layout="vertical">
        <a-form-item name="email" :rules="[{ required: true, message: '请输入有效的电子邮箱地址' }]">
          <template #label>电子邮箱</template>
          <a-input v-model:value="registerForm.email" placeholder="请输入您的电子邮箱地址" @keyup.enter="handleRegister">
            <template #prefix>
              <MailOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="verifyCode" :rules="[{ required: true, message: '请输入6位验证码' }]">
          <template #label>验证码</template>
          <a-row :gutter="16">
            <a-col :span="16">
              <a-input v-model:value="registerForm.verifyCode" placeholder="请输入6位验证码" @keyup.enter="handleRegister">
                <template #prefix>
                  <CodeOutlined class="input-icon" />
                </template>
              </a-input>
            </a-col>
            <a-col :span="8">
              <a-button 
                :disabled="registerCountdown > 0" 
                @click="sendRegisterVerifyCode"
                type="default"
                class="verify-code-btn"
              >
                {{ registerCountdown > 0 ? `${registerCountdown}秒后重发` : '发送验证码' }}
              </a-button>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item name="username" :rules="[{ required: true, message: '请输入您的用户名' }]">
          <template #label>用户名</template>
          <a-input v-model:value="registerForm.username" placeholder="请输入您的用户名" @keyup.enter="handleRegister">
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="name" :rules="[{ required: true, message: '请输入您的姓名' }]">
          <template #label>姓名</template>
          <a-input v-model:value="registerForm.name" placeholder="请输入您的姓名" @keyup.enter="handleRegister">
            <template #prefix>
              <UserOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="phone" :rules="[{ required: true, message: '请输入有效的手机号码' }]">
          <template #label>手机号码</template>
          <a-input v-model:value="registerForm.phone" placeholder="请输入您的手机号码" @keyup.enter="handleRegister">
            <template #prefix>
              <PhoneOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="password" :rules="[{ required: true, message: '请输入登录密码' }]">
          <template #label>登录密码</template>
          <a-input-password v-model:value="registerForm.password" placeholder="请输入登录密码（8-20位，包含字母和数字并区分大小写）" @keyup.enter="handleRegister">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="confirmPassword" :rules="[{ required: true, message: '请再次输入密码' }]">
          <template #label>确认密码</template>
          <a-input-password v-model:value="registerForm.confirmPassword" placeholder="请再次输入密码" @keyup.enter="handleRegister">
            <template #prefix>
              <LockOutlined class="input-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item label="状态">
          <a-input value="未激活" disabled style="background-color: #f5f5f5; color: #999;">
            <template #prefix>
              <InfoCircleOutlined class="input-icon" />
            </template>
          </a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import {
  TeamOutlined,
  LockOutlined,
  BarChartOutlined,
  DesktopOutlined,
  LoginOutlined,
  UserOutlined,
  MailOutlined,
  CodeOutlined,
  PhoneOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue';

const COUNT_DOWN_SECONDS = 60;
const STORAGE_KEYS = {
  REMEMBERED_USERNAME: 'rememberedUsername',
  TOKEN: 'token'
};

const MESSAGE_CONFIG = {
  duration: 2,
  style: { marginTop: '80px' }
};

interface LoginForm {
  username: string;
  password: string;
}

interface ForgotPasswordForm {
  email: string;
  verifyCode: string;
  newPassword: string;
  confirmPassword: string;
}

interface RegisterForm {
  name: string;
  username: string;
  email: string;
  phone: string;
  verifyCode: string;
  password: string;
  confirmPassword: string;
}

const VALIDATORS = {
  email: (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
  phone: (phone: string): boolean => /^1\d{10}$/.test(phone),
  workId: (workId: string): boolean => /^\d{4,20}$/.test(workId),
  password: (password: string): boolean => password.length >= 8 && password.length <= 20 && /[a-zA-Z]/.test(password) && /\d/.test(password)
};

const formState = reactive<LoginForm>({
  username: '',
  password: ''
});

const rememberAccount = ref(false);
const router = useRouter();
const showForgotPasswordModal = ref(false);
const showRegisterModal = ref(false);
const countdown = ref(0);
const registerCountdown = ref(0);

let countdownTimer: number | null = null;
let registerCountdownTimer: number | null = null;

const forgotPasswordForm = ref<ForgotPasswordForm>({
  email: '',
  verifyCode: '',
  newPassword: '',
  confirmPassword: ''
});

const registerForm = ref<RegisterForm>({
  name: '',
  username: '',
  email: '',
  phone: '',
  verifyCode: '',
  password: '',
  confirmPassword: ''
});

const validateAccount = (account: string): boolean => {
  return VALIDATORS.workId(account) || VALIDATORS.email(account) || VALIDATORS.phone(account);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event.key === 'Esc') {
    closeForgotPasswordModal();
    closeRegisterModal();
  }
};

const clearCountdown = (timer: number | null, setter: (val: number) => void) => {
  if (timer) {
    clearInterval(timer);
  }
  setter(0);
};

const startCountdown = (countdownRef: { value: number }, timerRef: { value: number | null }) => {
  countdownRef.value = COUNT_DOWN_SECONDS;
  if (timerRef.value) {
    clearInterval(timerRef.value);
  }
  timerRef.value = window.setInterval(() => {
    if (countdownRef.value > 0) {
      countdownRef.value--;
    } else {
      if (timerRef.value) {
        clearInterval(timerRef.value);
        timerRef.value = null;
      }
    }
  }, 1000);
};

const resetForgotPasswordForm = () => {
  forgotPasswordForm.value = {
    email: '',
    verifyCode: '',
    newPassword: '',
    confirmPassword: ''
  };
};

const resetRegisterForm = () => {
  registerForm.value = {
    name: '',
    username: '',
    email: '',
    phone: '',
    verifyCode: '',
    password: '',
    confirmPassword: ''
  };
};

const closeForgotPasswordModal = () => {
  showForgotPasswordModal.value = false;
  resetForgotPasswordForm();
  clearCountdown(countdownTimer, (val) => { countdown.value = val; });
};

const closeRegisterModal = () => {
  showRegisterModal.value = false;
  resetRegisterForm();
  clearCountdown(registerCountdownTimer, (val) => { registerCountdown.value = val; });
};

const handleSubmit = async () => {
  if (!formState.username) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入账号' });
    return;
  }

  if (!validateAccount(formState.username)) {
    message.error({ ...MESSAGE_CONFIG, content: '账号格式不正确，请输入工号、邮箱或手机号' });
    return;
  }

  if (!formState.password) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入密码' });
    return;
  }

  if (!VALIDATORS.password(formState.password)) {
    if (formState.password.length < 8 || formState.password.length > 20) {
      message.error({ ...MESSAGE_CONFIG, content: '密码长度应在8-20位之间' });
    } else {
      message.error({ ...MESSAGE_CONFIG, content: '密码应包含至少一个字母和一个数字' });
    }
    return;
  }

  if (rememberAccount.value) {
    localStorage.setItem(STORAGE_KEYS.REMEMBERED_USERNAME, formState.username);
  } else {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_USERNAME);
  }

  try {
    const token = 'test-token';
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    message.success({ ...MESSAGE_CONFIG, content: '登录成功，正在跳转到首页...' });
    
    setTimeout(() => {
      router.push('/home');
    }, 1000);
  } catch (error: any) {
    console.error('登录失败:', error);
    const errorMessage = error.response?.data?.detail || error.message || '登录失败，请稍后重试';
    message.error({ ...MESSAGE_CONFIG, content: errorMessage });
  }
};

const saveToDesktop = () => {
  const url = window.location.origin;
  const title = '星珩·企业综合管理系统';
  
  if ('beforeinstallprompt' in window) {
    alert('请使用浏览器的"添加到主屏幕"功能来保存此应用');
  } else {
    const shortcutText = `[InternetShortcut]\nURL=${url}\nIconFile=${url}/favicon.ico\nIconIndex=0\n[{000214A0-0000-0000-C000-000000000046}]`;
    const blob = new Blob([shortcutText], { type: 'application/internet-shortcut' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title}.url`;
    link.click();
    URL.revokeObjectURL(link.href);
  }
};

const sendVerifyCode = async () => {
  const email = forgotPasswordForm.value.email;
  
  if (!VALIDATORS.email(email)) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入有效的邮箱地址' });
    return;
  }

  try {
    message.success({ ...MESSAGE_CONFIG, content: '验证码已发送到您的邮箱，请查收' });
    startCountdown(countdown, { get value() { return countdownTimer; }, set value(v) { countdownTimer = v; } });
  } catch (error) {
    message.error({ ...MESSAGE_CONFIG, content: '发送验证码失败，请稍后重试' });
    console.error('发送验证码失败:', error);
  }
};

const resetPassword = async () => {
  const form = forgotPasswordForm.value;
  
  if (!VALIDATORS.email(form.email)) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入有效的电子邮箱地址' });
    return;
  }

  if (!form.verifyCode) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入验证码' });
    return;
  }

  if (!VALIDATORS.password(form.newPassword)) {
    if (form.newPassword.length < 8 || form.newPassword.length > 20) {
      message.error({ ...MESSAGE_CONFIG, content: '新密码长度应在8-20位之间' });
    } else {
      message.error({ ...MESSAGE_CONFIG, content: '新密码应包含至少一个字母和一个数字' });
    }
    return;
  }

  if (form.newPassword !== form.confirmPassword) {
    message.error({ ...MESSAGE_CONFIG, content: '两次输入的密码不一致' });
    return;
  }

  try {
    message.success({ ...MESSAGE_CONFIG, content: '密码重置成功，请使用新密码登录' });
    closeForgotPasswordModal();
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || '重置密码失败，请稍后重试';
    message.error({ ...MESSAGE_CONFIG, content: errorMessage });
    console.error('重置密码失败:', error);
  }
};

const sendRegisterVerifyCode = async () => {
  const email = registerForm.value.email;
  
  if (!VALIDATORS.email(email)) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入有效的邮箱地址' });
    return;
  }

  try {
    message.success({ ...MESSAGE_CONFIG, content: '验证码已发送到您的邮箱，请查收' });
    startCountdown(registerCountdown, { get value() { return registerCountdownTimer; }, set value(v) { registerCountdownTimer = v; } });
  } catch (error) {
    message.error({ ...MESSAGE_CONFIG, content: '发送验证码失败，请稍后重试' });
    console.error('发送验证码失败:', error);
  }
};

const handleRegister = async () => {
  const form = registerForm.value;
  
  if (!VALIDATORS.email(form.email)) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入有效的电子邮箱地址' });
    return;
  }

  if (!form.verifyCode) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入验证码' });
    return;
  }

  if (!form.username) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入您的用户名' });
    return;
  }

  if (!form.name) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入您的姓名' });
    return;
  }

  if (!VALIDATORS.phone(form.phone)) {
    message.error({ ...MESSAGE_CONFIG, content: '请输入有效的手机号码' });
    return;
  }

  if (!VALIDATORS.password(form.password)) {
    if (form.password.length < 8 || form.password.length > 20) {
      message.error({ ...MESSAGE_CONFIG, content: '密码长度应在8-20位之间' });
    } else {
      message.error({ ...MESSAGE_CONFIG, content: '密码应包含至少一个字母和一个数字' });
    }
    return;
  }

  if (form.password !== form.confirmPassword) {
    message.error({ ...MESSAGE_CONFIG, content: '两次输入的密码不一致' });
    return;
  }

  try {
    message.success({
      ...MESSAGE_CONFIG,
      content: '注册成功，请联系/等待管理员进行账号激活，激活后使用您的工号/邮箱/手机号进行登录',
      duration: 5
    });
    closeRegisterModal();
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || '注册失败，请稍后重试';
    message.error({ ...MESSAGE_CONFIG, content: errorMessage });
    console.error('注册失败:', error);
  }
};

onMounted(() => {
  const savedUsername = localStorage.getItem(STORAGE_KEYS.REMEMBERED_USERNAME);
  if (savedUsername) {
    formState.username = savedUsername;
    rememberAccount.value = true;
  }
  
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
  clearCountdown(countdownTimer, (val) => { countdown.value = val; });
  clearCountdown(registerCountdownTimer, (val) => { registerCountdown.value = val; });
});
</script>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  max-width: 1180px;
  margin: 0 auto;
}

.brand-container {
  width: 100%;
  max-width: 590px;
  height: 535px;
  padding: 43px 48px;
  background-color: #1890ff;
  border-radius: 12px 0 0 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-right: -1px;
}

.brand-content {
  text-align: center;
  
  .brand-logo {
    margin-bottom: 60px;
    
    img {
      max-width: 100%;
      height: auto;
    }
  }
  
  h1 {
    font-size: 32px;
    font-weight: 600;
    margin-bottom: 16px;
    line-height: 1.2;
  }
  
  p {
    font-size: 18px;
    margin-bottom: 60px;
    opacity: 0.9;
  }
}

.brand-features {
  display: flex;
  flex-direction: row;
  gap: 30px;
  justify-content: center;
  
  .feature-item {
    font-size: 14px;
    padding: 20px 40px;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 140px;
  }
}

.login-container {
  width: 100%;
  max-width: 590px;
  height: 535px;
  padding: 43px 48px;
  background-color: #ffffff;
  border-radius: 0 12px 12px 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  h2 {
    font-size: 26px;
    font-weight: 600;
    color: #333;
    text-align: center;
    margin-bottom: 8px;
  }
  
  p {
    font-size: 16px;
    color: #999;
    text-align: center;
    margin-bottom: 24px;
  }
  
  .input-container {
    margin-bottom: 24px;
    margin-top: 16px;
  }
  
  .action-container {
    margin-top: 8px;
  }
  
  :deep(.ant-form-item) {
    margin-bottom: 20px;
    
    label {
      font-size: 14px;
      color: #666;
      margin-bottom: 8px;
    }
  }
  
  :deep(.ant-input-wrapper) {
    width: 100%;
    
    .input-icon {
      color: #999;
      font-size: 16px;
    }
    
    input {
      height: 44px;
      border-radius: 8px;
      font-size: 14px;
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    
    :deep(.ant-checkbox-wrapper) {
      font-size: 14px;
      color: #666;
    }
    
    a {
      color: #666;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }
  }
  
  .login-btn {
    width: 100%;
    height: 44px;
    font-size: 16px;
    font-weight: 600;
    border-radius: 8px;
  }
  
  .form-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 24px;
    
    a {
      color: #666;
      text-decoration: none;
      font-size: 14px;
      cursor: pointer;
    }
  }
}

.verify-code-btn {
  width: 100%;
  height: 36px;
  border-radius: 8px;
  background-color: #1890ff;
  color: #ffffff;
  border: 1px solid #1890ff;
  
  &:hover:not(:disabled) {
    background-color: #40a9ff;
    border-color: #40a9ff;
    color: #ffffff;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    color: #999;
  }
}

:deep(.ant-modal) {
  .ant-modal-content {
    border-radius: 16px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  }
  
  .ant-modal-header {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid #f0f0f0;
  }
  
  .ant-modal-footer {
    border-top: 1px solid #f0f0f0;
    background-color: #fafafa;
  }
  
  .ant-modal-body {
    padding: 30px;
  }
  
  .ant-form-item {
    margin-bottom: 24px;
    
    label {
      font-weight: 500;
      color: #555;
      margin-bottom: 10px;
    }
  }
  
  .ant-input-wrapper {
    .input-icon {
      color: #999;
      font-size: 16px;
    }
  }
}

@media (max-width: 1024px) {
  .login-page {
    flex-direction: column;
    padding: 20px;
  }
  
  .brand-container {
    max-width: 100%;
    height: auto;
    border-radius: 12px 12px 0 0;
    margin-right: 0;
    margin-bottom: -1px;
    padding: 32px 24px;
  }
  
  .brand-content {
    .brand-logo {
      margin-bottom: 32px;
    }
    
    h1 {
      font-size: 24px;
    }
    
    p {
      font-size: 16px;
      margin-bottom: 32px;
    }
  }
  
  .brand-features {
    gap: 16px;
    
    .feature-item {
      padding: 12px 24px;
      min-width: auto;
    }
  }
  
  .login-container {
    max-width: 100%;
    height: auto;
    border-radius: 0 0 12px 12px;
    padding: 32px 24px;
  }
}

@media (max-width: 640px) {
  .login-page {
    padding: 12px;
  }
  
  .brand-container {
    padding: 24px 16px;
  }
  
  .brand-content {
    h1 {
      font-size: 20px;
    }
    
    p {
      font-size: 14px;
      margin-bottom: 24px;
    }
  }
  
  .brand-features {
    flex-direction: column;
    gap: 12px;
    
    .feature-item {
      width: 100%;
      padding: 16px;
    }
  }
  
  .login-container {
    padding: 24px 16px;
  }
  
  .login-container {
    h2 {
      font-size: 22px;
    }
    
    p {
      font-size: 14px;
    }
  }
}
</style>