<template>
  <a-config-provider :locale="zhCN">
    <div class="profile-center-container">
      <div class="profile-page">
        <a-card class="profile-card">
          <div class="card-header">
            <h3 class="card-title">个人设置</h3>
            <div class="header-right">
              <a-button type="primary" @click="toggleEditMode" :class="{ 'active': isEditMode }">
                {{ isEditMode ? '返回' : '编辑' }}
              </a-button>
            </div>
          </div>
          <div class="card-body">
            <div class="profile-content">
              <div class="profile-avatar-container">
                <div class="profile-avatar">
                  <div class="avatar-container">
                    <img :src="userProfile.avatar" alt="用户头像">
                    <div class="avatar-upload" v-if="isEditMode">
                      <a-upload
                        :show-upload-list="false"
                        :before-upload="beforeUpload"
                        :custom-request="customAvatarUpload"
                        @change="handleAvatarChange"
                      >
                        <a-button type="primary"><UploadOutlined /> 更换头像</a-button>
                      </a-upload>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="profile-form">
                <div class="form-row">
                  <div class="form-item">
                    <label>工号</label>
                    <a-input v-model:value="userProfile.employeeId" disabled />
                  </div>
                  <div class="form-item">
                    <label>姓名</label>
                    <a-input v-model:value="userProfile.name" :disabled="!isEditMode" />
                  </div>
                  <div class="form-item">
                    <label>性别</label>
                    <a-select v-model:value="userProfile.gender" :disabled="!isEditMode" placeholder="请选择">
                      <a-select-option value="男">男</a-select-option>
                      <a-select-option value="女">女</a-select-option>
                    </a-select>
                  </div>
                  <div class="form-item">
                    <label>民族</label>
                    <a-input v-model:value="userProfile.nationality" :disabled="!isEditMode" />
                  </div>
                  <div class="form-item">
                    <label>生日</label>
                    <a-date-picker v-model:value="userProfile.birthday" :disabled="!isEditMode" format="YYYY-MM-DD" />
                  </div>
                </div>
                
                <div class="form-row">
                  <div class="form-item">
                    <label>学历</label>
                    <a-input v-model:value="userProfile.education" :disabled="!isEditMode" />
                  </div>
                  <div class="form-item">
                    <label>学位</label>
                    <a-input v-model:value="userProfile.degree" :disabled="!isEditMode" />
                  </div>
                  <div class="form-item">
                    <label>入职日期</label>
                    <a-date-picker v-model:value="userProfile.joinDate" disabled format="YYYY-MM-DD" />
                  </div>
                  <div class="form-item">
                    <label>邮箱</label>
                    <a-input v-model:value="userProfile.email" :disabled="!isEditMode" />
                  </div>
                  <div class="form-item">
                    <label>电话</label>
                    <a-input v-model:value="userProfile.phone" :disabled="!isEditMode" type="tel" />
                  </div>
                </div>
                
                <div class="form-actions" v-if="isEditMode">
                  <a-button @click="toggleEditMode">取消</a-button>
                  <a-button type="primary" @click="handleSaveProfile">保存</a-button>
                </div>
              </div>
            </div>
          </div>
        </a-card>
        
        <a-card class="profile-card">
          <div class="card-header">
            <h3 class="card-title">账号信息</h3>
            <div class="header-right">
            </div>
          </div>
          <div class="card-body">
            <div class="setting-item">
              <div class="setting-label">
                <span>修改密码</span>
                <p class="setting-desc">定期修改密码以保护账号安全</p>
              </div>
              <a-button type="primary" @click="showChangePasswordModal = true">修改</a-button>
            </div>
            
            <div class="setting-item">
              <div class="setting-label">
                <span>账号安全</span>
                <p class="setting-desc">查看和管理账号安全设置</p>
              </div>
              <a-tag color="green" :bordered="false">安全</a-tag>
            </div>
            
            <div class="setting-item">
              <div class="setting-label">
                <span>登录历史</span>
                <p class="setting-desc">查看最近的登录记录</p>
              </div>
              <a-button @click="handleOpenLoginHistoryModal">查看</a-button>
            </div>
          </div>
        </a-card>
        
        <a-card class="profile-card">
          <div class="card-header">
            <h3 class="card-title">组织信息</h3>
            <div class="header-right">
            </div>
          </div>
          <div class="card-body">
            <div class="profile-form">
                <div class="form-row">
                  <div class="form-item">
                    <label>单位</label>
                    <a-input v-model:value="userProfile.company" disabled />
                  </div>
                  <div class="form-item">
                    <label>部门</label>
                    <a-input v-model:value="userProfile.department" disabled />
                  </div>
                  <div class="form-item">
                    <label>车间</label>
                    <a-input v-model:value="userProfile.workshop" disabled />
                  </div>
                  <div class="form-item">
                    <label>班组</label>
                    <a-input v-model:value="userProfile.team" disabled />
                  </div>
                  <div class="form-item">
                    <label>岗位</label>
                    <a-input v-model:value="userProfile.position" disabled />
                  </div>
                </div>
              </div>
          </div>
        </a-card>
        
        <a-modal
          v-model:open="showChangePasswordModal"
          title="修改密码"
          width="500px"
          :ok-text="'保存'"
          :cancel-text="'取消'"
          @ok="handleChangePassword"
          @cancel="resetPasswordModal"
          class="profile-modal"
        >
          <div class="modal-form">
            <a-form layout="vertical">
              <a-form-item label="当前密码">
                <a-input-password v-model:value="passwordForm.currentPassword" placeholder="请输入当前使用密码" @keyup.enter="handleChangePassword">
                  <template #prefix>
                    <SafetyCertificateOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item label="新密码">
                <a-input-password v-model:value="passwordForm.newPassword" placeholder="请输入新密码（8-20位，包含字母和数字并区分大小写）" @keyup.enter="handleChangePassword">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
              <a-form-item label="确认新密码">
                <a-input-password v-model:value="passwordForm.confirmPassword" placeholder="请再次输入新密码" @keyup.enter="handleChangePassword">
                  <template #prefix>
                    <LockOutlined />
                  </template>
                </a-input-password>
              </a-form-item>
            </a-form>
          </div>
        </a-modal>
        
        <a-modal
          v-model:open="showLoginHistoryModal"
          title="登录历史"
          width="800px"
          :ok-text="'关闭'"
          :cancel-button-props="{ style: { display: 'none' } }"
          @ok="showLoginHistoryModal = false"
          @cancel="showLoginHistoryModal = false"
          class="profile-modal"
        >
          <a-table :data-source="loginHistory" :columns="historyColumns" row-key="id" class="history-table" :scroll="{ x: 650 }" />
        </a-modal>
      </div>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { ref, reactive, shallowRef } from 'vue';
import { message } from 'ant-design-vue';
import { UploadOutlined, LockOutlined, SafetyCertificateOutlined } from '@ant-design/icons-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';


dayjs.locale('zh-cn');

interface UserProfile {
  avatar: string;
  id: number;
  employeeId: string;
  name: string;
  gender: string;
  nationality: string;
  birthday: dayjs.Dayjs | null;
  education: string;
  degree: string;
  joinDate: dayjs.Dayjs | null;
  email: string;
  phone: string;
  company: string;
  department: string;
  workshop: string;
  team: string;
  position: string;
}

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface LoginHistoryItem {
  id: number;
  time: string;
  ip: string;
  device: string;
  location: string;
}

interface UploadOptions {
  file: File;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

const MIN_PASSWORD_LENGTH = 8;
const MAX_FILE_SIZE = 2 * 1024 * 1024;

const isEditMode = ref(false);
const showChangePasswordModal = ref(false);
const showLoginHistoryModal = ref(false);

const userProfile = reactive<UserProfile>({
  avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20business%20user%20avatar%20portrait%2C%20friendly%20face%2C%20corporate%20style&image_size=square',
  id: 1,
  employeeId: 'EMP001',
  name: '江东',
  gender: '男',
  nationality: '汉族',
  birthday: dayjs('1990-01-01'),
  education: '本科',
  degree: '学士',
  joinDate: dayjs('2020-01-01'),
  email: 'jiangdong@example.com',
  phone: '13800138000',
  company: '翼航智能',
  department: '技术部',
  workshop: '研发车间',
  team: '前端开发组',
  position: '高级前端工程师'
});

const passwordForm = reactive<PasswordForm>({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const loginHistory = shallowRef<LoginHistoryItem[]>([
  {
    id: 1,
    time: '2026-03-15 10:30:00',
    ip: '192.168.1.100',
    device: 'Windows 10 / Chrome 96.0',
    location: '北京市'
  },
  {
    id: 2,
    time: '2026-03-14 16:45:00',
    ip: '192.168.1.101',
    device: 'MacOS / Safari 15.0',
    location: '上海市'
  },
  {
    id: 3,
    time: '2026-03-13 09:15:00',
    ip: '192.168.1.102',
    device: 'iOS / Safari',
    location: '广州市'
  }
]);

const historyColumns = shallowRef([
  {
    title: '登录时间',
    dataIndex: 'time',
    key: 'time',
    width: 180
  },
  {
    title: 'IP地址',
    dataIndex: 'ip',
    key: 'ip',
    width: 150
  },
  {
    title: '设备信息',
    dataIndex: 'device',
    key: 'device',
    width: 200
  },
  {
    title: '登录地点',
    dataIndex: 'location',
    key: 'location',
    width: 120
  }
]);

const toggleEditMode = () => {
  isEditMode.value = !isEditMode.value;
};

const handleSaveProfile = async () => {
  try {
    setTimeout(() => {
      message.success('个人资料保存成功');
      isEditMode.value = false;
    }, 500);
  } catch (error) {
    message.error('保存个人资料失败，请稍后重试');
    console.error('Error saving profile:', error);
  }
};

const handleAvatarChange = (info: any) => {
  if (info.file.status === 'done') {
    message.success('头像上传成功');
  } else if (info.file.status === 'error') {
    message.error('头像上传失败');
  }
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const customAvatarUpload = async (options: UploadOptions) => {
  const { file, onSuccess, onError } = options;
  
  try {
    const base64Avatar = await fileToBase64(file);
    
    setTimeout(() => {
      userProfile.avatar = base64Avatar;
      onSuccess();
    }, 500);
  } catch (error) {
    console.error('Error uploading avatar:', error);
    onError(new Error('头像上传失败'));
  }
};

const beforeUpload = (file: File) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  const isLt2M = file.size < MAX_FILE_SIZE;
  
  if (!isJpgOrPng) {
    message.error('只能上传JPG或PNG格式的图片');
  }
  if (!isLt2M) {
    message.error('图片大小不能超过2MB');
  }
  
  return isJpgOrPng && isLt2M;
};

const resetPasswordModal = () => {
  showChangePasswordModal.value = false;
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
};

const handleChangePassword = async () => {
  if (!passwordForm.currentPassword) {
    message.error('请输入当前密码');
    return;
  }
  
  if (!passwordForm.newPassword || passwordForm.newPassword.length < MIN_PASSWORD_LENGTH) {
    message.error(`新密码长度不能少于${MIN_PASSWORD_LENGTH}位`);
    return;
  }
  
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    message.error('两次输入的密码不一致');
    return;
  }
  
  try {
    setTimeout(() => {
      message.success('密码修改成功，请使用新密码登录');
      resetPasswordModal();
    }, 500);
  } catch (error) {
    message.error('修改密码失败，请稍后重试');
    console.error('Error changing password:', error);
  }
};

const handleOpenLoginHistoryModal = () => {
  showLoginHistoryModal.value = true;
};
</script>

<style scoped>
.profile-center-container {
  width: 100%;
  padding: 1.5%;
}

.profile-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
  margin-bottom: 24px;
}

.profile-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
}

.card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.card-body {
  padding: 20px 0;
}

.profile-content {
  display: flex;
  align-items: flex-start;
  gap: 32px;
  flex-wrap: wrap;
}

.profile-avatar-container {
  flex-shrink: 0;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.profile-avatar {
  text-align: center;
}

.profile-form {
  flex: 1;
  min-width: 300px;
}

.avatar-container {
  position: relative;
  text-align: center;
}

.avatar-container img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #f0f0f0;
  transition: all 0.3s ease;
}

.avatar-container img:hover {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.avatar-upload {
  margin-top: 16px;
}

.avatar-upload :deep(.ant-btn) {
  transition: all 0.3s ease;
}

.avatar-upload :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 24px;
  margin-bottom: 20px;
}

.form-item {
  min-width: 0;
}

.form-item label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.form-item :deep(.ant-input),
.form-item :deep(.ant-input-textarea) {
  border-radius: 4px;
  transition: all 0.3s ease;
}

.form-item :deep(.ant-input:focus),
.form-item :deep(.ant-input-textarea:focus) {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.form-item :deep(.ant-picker),
.form-item :deep(.ant-select),
.form-item :deep(.ant-input[type="tel"]) {
  width: 100%;
}

.modal-form :deep(.ant-input-password .anticon) {
  color: rgba(0, 0, 0, 0.45);
  transition: color 0.3s;
}

.modal-form :deep(.ant-input-password:focus-within .anticon) {
  color: #1890ff;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.form-actions :deep(.ant-btn) {
  transition: all 0.3s ease;
}

.form-actions :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.form-actions :deep(.ant-btn-primary:hover) {
  background-color: #40a9ff;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  transition: all 0.3s ease;
}

.setting-item:hover {
  background-color: #fafafa;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  flex: 1;
}

.setting-label span {
  display: block;
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.setting-item :deep(.ant-btn) {
  transition: all 0.3s ease;
}

.setting-item :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

.setting-item :deep(.ant-tag) {
  font-size: 14px;
  padding: 4px 12px;
}

.profile-modal {
  border-radius: 8px;
}

.modal-form {
  max-width: 100%;
}

.modal-form :deep(.ant-form-item) {
  margin-bottom: 16px;
}

.history-table {
  border-radius: 4px;
}

.history-table :deep(.ant-table-thead > tr > th) {
  background-color: #fafafa;
  font-weight: 600;
  font-size: 14px;
}

.history-table :deep(.ant-table-tbody > tr > td) {
  font-size: 13px;
  padding: 10px;
}

.history-table :deep(.ant-table-tbody > tr:hover) {
  background-color: #fafafa;
}

@media (max-width: 1200px) {
  .profile-page {
    padding: 20px;
  }
}

@media (max-width: 992px) {
  .profile-page {
    padding: 16px;
  }
  
  .profile-content {
    flex-direction: column;
    align-items: center;
  }
  
  .profile-form {
    width: 100%;
  }
}

@media (max-width: 768px) {
  .profile-page {
    padding: 12px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .header-right {
    width: 100%;
    justify-content: flex-end;
  }
  
  .form-actions {
    flex-direction: column;
  }
  
  .form-actions :deep(.ant-btn) {
    width: 100%;
  }
  
  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .setting-item :deep(.ant-btn) {
    align-self: flex-end;
  }
}

@media (max-width: 576px) {
  .profile-modal {
    width: 90% !important;
  }
  
  .card-title {
    font-size: 14px;
  }
  
  .avatar-container img {
    width: 100px;
    height: 100px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
