<template>
  <MainLayout>
    <a-config-provider :locale="zhCN">
      <div class="help-container">
        <a-card class="help-card">
          <div class="help-card-header">
            <h3 class="help-card-title"></h3>
            <div class="help-header-right">
              <a-space>
                <a-button type="primary" @click="handleFeedback">
                  <template #icon>
                    <QuestionCircleOutlined />
                  </template>
                  提交反馈
                </a-button>
                <a-button @click="handlePreviewGuide">
                  <template #icon>
                    <EyeOutlined />
                  </template>
                  预览手册
                </a-button>
                <a-dropdown>
                  <a-button>
                    <template #icon>
                      <DownloadOutlined />
                    </template>
                    下载手册
                    <DownOutlined />
                  </a-button>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item @click="downloadAsPDF">
                        <FilePdfOutlined />
                        PDF格式
                      </a-menu-item>
                      <a-menu-item @click="downloadAsWord">
                        <FileWordOutlined />
                        Word格式
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </a-space>
            </div>
          </div>
          
          <div class="help-content">
            <div class="help-section">
              <div class="help-section-header">
                <BookOutlined class="help-section-icon" />
                <span>{{ quickStart.title }}</span>
              </div>
              <div class="help-section-content">
                <p>{{ quickStart.content }}</p>
                
                <template v-for="(section, index) in quickStart.sections" :key="index">
                  <h4>{{ section.title }}</h4>
                  <ul class="help-section-list">
                    <li v-for="(item, itemIndex) in section.items" :key="itemIndex">{{ item }}</li>
                  </ul>
                </template>
              </div>
            </div>
            
            <div class="help-section">
              <div class="help-section-header">
                <QuestionCircleOutlined class="help-section-icon" />
                <span>常见问题</span>
              </div>
              <div class="help-section-content">
                <a-collapse v-model:activeKey="activeFaqKey">
                  <a-collapse-panel 
                    v-for="faq in faqList" 
                    :key="faq.id" 
                    :title="faq.title"
                  >
                    <p v-for="(line, index) in faq.content.split('\n')" :key="index">{{ line }}</p>
                  </a-collapse-panel>
                </a-collapse>
              </div>
            </div>
            
            <div class="help-section">
              <div class="help-section-header">
                <CompassOutlined class="help-section-icon" />
                <span>功能指南</span>
              </div>
              <div class="help-section-content">
                <div class="help-feature-guides">
                  <div class="help-feature-guide-item" v-for="guide in featureGuides" :key="guide.id">
                    <h4>{{ guide.title }}</h4>
                    <p>{{ guide.description }}</p>
                    <ul>
                      <li v-for="(item, index) in guide.items" :key="index">{{ item }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="help-section">
              <div class="help-section-header">
                <PhoneOutlined class="help-section-icon" />
                <span>联系支持</span>
              </div>
              <div class="help-section-content">
                <p>如果您在使用过程中遇到问题，可以通过以下方式联系我们的技术支持团队：</p>
                <div class="help-support-contacts">
                  <div class="help-contact-item" v-for="contact in supportContacts" :key="contact.type">
                    <component :is="CONTACT_ICONS[contact.type]" class="help-contact-icon" />
                    <div>
                      <p class="help-contact-title">{{ contact.title }}</p>
                      <p>{{ contact.value }}</p>
                      <p class="help-contact-desc">{{ contact.description }}</p>
                    </div>
                  </div>
                </div>
                
                <h4>支持范围</h4>
                <ul>
                  <li>系统功能使用问题</li>
                  <li>系统错误和异常处理</li>
                  <li>系统配置和参数调整</li>
                  <li>用户权限和角色设置</li>
                  <li>数据导出和报表生成</li>
                </ul>
                
                <h4>问题处理流程</h4>
                <ol>
                  <li>提交问题：通过上述渠道提交您的问题</li>
                  <li>问题确认：技术支持团队确认问题详情</li>
                  <li>问题处理：根据问题类型和优先级进行处理</li>
                  <li>解决方案：提供问题解决方案或临时 workaround</li>
                  <li>问题验证：确认问题是否已解决</li>
                  <li>问题归档：将问题和解决方案归档</li>
                </ol>
              </div>
            </div>
          </div>
        </a-card>
      </div>
      
      <!-- 反馈表单模态框 -->
      <a-modal
        v-model:visible="feedbackVisible"
        title="提交反馈"
        width="500px"
        @ok="handleFeedbackSubmit"
        @cancel="handleFeedbackCancel"
      >
        <div class="feedback-form">
          <a-form layout="vertical">
            <a-form-item label="反馈类型" required>
              <a-select
                v-model:value="feedbackForm.type"
                placeholder="请选择反馈类型"
                style="width: 100%"
              >
                <a-select-option
                  v-for="type in feedbackTypes"
                  :key="type.value"
                  :value="type.value"
                >
                  {{ type.label }}
                </a-select-option>
              </a-select>
            </a-form-item>
            
            <a-form-item label="主题" required>
              <a-input
                v-model:value="feedbackForm.subject"
                placeholder="请输入反馈主题"
              />
            </a-form-item>
            
            <a-form-item label="详细描述" required>
              <a-textarea
                v-model:value="feedbackForm.description"
                placeholder="请详细描述您的问题或建议"
                rows="4"
              />
            </a-form-item>
            
            <a-form-item label="联系方式（选填）">
              <a-input
                v-model:value="feedbackForm.contact"
                placeholder="请留下您的联系方式，以便我们回复"
              />
            </a-form-item>
          </a-form>
        </div>
      </a-modal>
    </a-config-provider>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, shallowRef, h } from 'vue';
import MainLayout from '../../components/layout/MainLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {
  BookOutlined,
  QuestionCircleOutlined,
  CompassOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  DownloadOutlined,
  EyeOutlined,
  FilePdfOutlined,
  FileWordOutlined,
  DownOutlined
} from '@ant-design/icons-vue';
import { message, Modal } from 'ant-design-vue';

interface QuickStartSection {
  title: string;
  items: string[];
}

interface QuickStartData {
  title: string;
  content: string;
  sections: QuickStartSection[];
}

interface FaqItem {
  id: string;
  title: string;
  content: string;
}

interface FeatureGuide {
  id: string;
  title: string;
  description: string;
  items: string[];
}

interface SupportContact {
  type: 'phone' | 'email' | 'online';
  title: string;
  value: string;
  description: string;
}

const CONTACT_ICONS = {
  phone: PhoneOutlined,
  email: MailOutlined,
  online: MessageOutlined
} as const;

const activeFaqKey = ref<string[]>(['faq1']);

const feedbackForm = ref({
  type: '',
  subject: '',
  description: '',
  contact: ''
});

const feedbackVisible = ref(false);

const feedbackTypes = [
  { value: 'bug', label: '功能缺陷' },
  { value: 'suggestion', label: '功能建议' },
  { value: 'question', label: '使用问题' },
  { value: 'other', label: '其他' }
];

const quickStart = shallowRef<QuickStartData>({
  title: '快速开始',
  content: 'EIMS（Enterprise Information Management System）是一个企业信息管理系统，旨在帮助企业高效管理员工信息、系统配置和日常运营。以下是系统的快速入门指南：',
  sections: [
    {
      title: '系统登录',
      items: [
        '打开浏览器，输入系统地址',
        '输入用户名和密码',
        '点击登录按钮进入系统',
        '首次登录后建议修改密码'
      ]
    },
    {
      title: '系统导航',
      items: [
        '顶部导航栏：系统主要功能模块入口',
        '左侧菜单：当前模块的具体功能列表',
        '面包屑导航：显示当前位置路径',
        '右侧操作区：当前页面的操作按钮'
      ]
    },
    {
      title: '基本操作',
      items: [
        '添加：点击"添加"按钮创建新记录',
        '编辑：点击"编辑"按钮修改现有记录',
        '删除：点击"删除"按钮移除记录',
        '搜索：使用搜索框查找特定记录',
        '导出：点击"导出"按钮下载数据'
      ]
    }
  ]
});

const faqList = shallowRef<FaqItem[]>([
  {
    id: 'faq1',
    title: '如何重置密码？',
    content: '如果您忘记了密码，可以点击登录页面的"忘记密码"链接，按照提示操作重置密码。如果您是管理员，也可以在用户管理中为其他用户重置密码。'
  },
  {
    id: 'faq2',
    title: '如何添加新员工？',
    content: '在系统管理 -> 用户管理页面，点击"添加"按钮，填写员工的基本信息，包括姓名、工号、部门、岗位等，然后点击"保存"即可。'
  },
  {
    id: 'faq3',
    title: '如何修改系统配置？',
    content: '在系统管理 -> 配置管理页面，您可以修改系统的基本配置、邮件配置和通知配置。修改完成后点击"保存"按钮即可生效。'
  },
  {
    id: 'faq4',
    title: '如何查看系统日志？',
    content: '在系统管理 -> 日志管理页面，您可以查看系统的操作日志和系统日志。您可以通过时间范围、操作类型、操作用户等条件过滤日志。'
  },
  {
    id: 'faq5',
    title: '如何备份系统数据？',
    content: '在系统管理 -> 备份管理页面，您可以手动创建备份或设置自动备份计划。系统会定期自动备份数据，确保数据安全。'
  }
]);

const featureGuides = shallowRef<FeatureGuide[]>([
  {
    id: 'guide1',
    title: '员工管理',
    description: '管理企业员工信息',
    items: [
      '员工信息维护',
      '部门和岗位分配',
      '员工状态管理',
      '员工信息查询和导出'
    ]
  },
  {
    id: 'guide2',
    title: '部门管理',
    description: '管理企业部门结构',
    items: [
      '部门信息维护',
      '部门层级管理',
      '部门负责人设置',
      '部门信息查询'
    ]
  },
  {
    id: 'guide3',
    title: '角色管理',
    description: '管理用户角色和权限',
    items: [
      '角色创建和编辑',
      '权限分配',
      '角色成员管理',
      '预设角色使用'
    ]
  },
  {
    id: 'guide4',
    title: '系统配置',
    description: '配置系统各项参数',
    items: [
      '基本配置设置',
      '邮件服务器配置',
      '通知设置',
      '系统参数调整'
    ]
  },
  {
    id: 'guide5',
    title: '数据备份',
    description: '保障系统数据安全',
    items: [
      '手动备份创建',
      '自动备份计划设置',
      '备份文件管理',
      '数据恢复操作'
    ]
  },
  {
    id: 'guide6',
    title: '系统监控',
    description: '监控系统运行状态',
    items: [
      '服务状态监控',
      '用户活动追踪',
      '系统性能分析',
      '异常情况预警'
    ]
  },
  {
    id: 'guide7',
    title: '日志管理',
    description: '记录和分析系统操作日志',
    items: [
      '操作日志查询',
      '系统日志分析',
      '日志导出和归档',
      '异常日志告警'
    ]
  },
  {
    id: 'guide8',
    title: '通知管理',
    description: '管理系统通知和消息',
    items: [
      '通知模板设置',
      '消息发送管理',
      '通知记录查询',
      '通知偏好设置'
    ]
  },
  {
    id: 'guide9',
    title: '报表管理',
    description: '生成和导出系统报表',
    items: [
      '报表模板配置',
      '数据统计分析',
      '报表导出格式',
      '定时报表生成'
    ]
  },
  {
    id: 'guide10',
    title: '系统安全',
    description: '保障系统安全运行',
    items: [
      '安全策略配置',
      '访问控制管理',
      '安全审计日志',
      '漏洞扫描和修复'
    ]
  }
]);

const supportContacts = shallowRef<SupportContact[]>([
  {
    type: 'phone',
    title: '电话支持',
    value: '400-123-4567',
    description: '工作日 9:00-18:00'
  },
  {
    type: 'email',
    title: '邮件支持',
    value: 'support@eims.com',
    description: '24小时内回复'
  },
  {
    type: 'online',
    title: '在线客服',
    value: '系统内在线聊天',
    description: '工作日 9:00-18:00'
  }
]);

const handleFeedback = () => {
  feedbackVisible.value = true;
};

const handleFeedbackSubmit = () => {
  // 验证表单
  if (!feedbackForm.value.type || !feedbackForm.value.subject || !feedbackForm.value.description) {
    message.error('请填写必填项');
    return;
  }
  
  // 模拟提交反馈
  message.loading('正在提交反馈...', 1.5);
  setTimeout(() => {
    message.success('反馈提交成功，我们会尽快处理');
    feedbackVisible.value = false;
    // 重置表单
    feedbackForm.value = {
      type: '',
      subject: '',
      description: '',
      contact: ''
    };
  }, 1500);
};

const handleFeedbackCancel = () => {
  feedbackVisible.value = false;
  // 重置表单
  feedbackForm.value = {
    type: '',
    subject: '',
    description: '',
    contact: ''
  };
};

const handlePreviewGuide = () => {
  Modal.info({
    title: '用户操作手册',
    width: 600,
    maskClosable: true,
    content: h('div', { style: { padding: '20px' } }, [
      h('h3', { style: { marginBottom: '16px', color: '#1890ff' } }, 'EIMS企业综合管理系统用户手册'),
      h('p', { style: { marginBottom: '16px' } }, '本手册包含系统的完整使用指南，涵盖以下内容：'),
      h('ul', { style: { marginBottom: '20px', paddingLeft: '20px' } }, [
        h('li', { style: { marginBottom: '8px' } }, '系统概述与架构'),
        h('li', { style: { marginBottom: '8px' } }, '快速入门指南'),
        h('li', { style: { marginBottom: '8px' } }, '功能模块详解'),
        h('li', { style: { marginBottom: '8px' } }, '常见问题解答'),
        h('li', { style: { marginBottom: '8px' } }, '技术支持联系方式')
      ]),
      h('p', { style: { color: '#666' } }, '请通过下载功能获取完整的PDF或Word格式手册。')
    ]),
    onOk() {},
  });
};

const downloadAsPDF = () => {
  message.loading('正在生成PDF文件...', 1.5);
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = '/manuals/EIMS_User_Manual_V1.0.0.pdf';
    link.download = 'EIMS用户操作手册_V1.0.0.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('PDF手册下载已开始');
  }, 1500);
};

const downloadAsWord = () => {
  message.loading('正在生成Word文件...', 1.5);
  setTimeout(() => {
    const link = document.createElement('a');
    link.href = '/manuals/EIMS_User_Manual_V1.0.0.docx';
    link.download = 'EIMS用户操作手册_V1.0.0.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('Word手册下载已开始');
  }, 1500);
};
</script>

<style scoped>
.help-container {
  width: 100%;
  padding: 1.5%;
}

.help-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  transition: all 0.3s ease;
}

.help-card-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #d9d9d9;
}

.help-card-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
  margin: 0;
}

.help-header-right {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 0;
}

.help-content {
  max-width: 100%;
}

.help-section {
  margin-bottom: 24px;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
}

.help-section-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-left: 8px;
  border-left: 4px solid #1890ff;
}

.help-section-icon {
  font-size: 18px;
  color: #1890ff;
}

.help-section-header span {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.help-section-content {
  padding: 0;
}

.help-section-content p {
  color: #333;
  line-height: 1.5;
  margin-bottom: 16px;
}

.help-section-list {
  margin: 16px 0;
  padding-left: 24px;
}

.help-section-list li {
  margin-bottom: 8px;
  color: #333;
  line-height: 1.5;
}

.help-feature-guides {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.help-feature-guide-item {
  padding: 16px;
  background-color: #fff;
  border-radius: 6px;
  border: 1px solid #f0f0f0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.help-feature-guide-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.help-feature-guide-item h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}

.help-feature-guide-item p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.help-support-contacts {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.help-contact-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.help-contact-item:last-child {
  border-bottom: none;
}

.help-contact-icon {
  font-size: 18px;
  color: #1890ff;
  width: 24px;
  margin-top: 4px;
}

.help-contact-item p {
  margin: 0 0 4px 0;
}

.help-contact-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.help-contact-desc {
  font-size: 12px;
  color: #999;
}

.help-section-content h4 {
  margin: 20px 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.help-section-content ul,
.help-section-content ol {
  margin: 12px 0 16px 0;
  padding-left: 24px;
}

.help-section-content ul li,
.help-section-content ol li {
  margin-bottom: 6px;
  color: #333;
  line-height: 1.4;
}

@media (max-width: 1024px) {
  .help-feature-guides {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .help-container {
    padding: 16px;
  }
  
  .help-card {
    margin-bottom: 16px;
  }
  
  .help-feature-guides {
    grid-template-columns: 1fr;
  }
  
  .help-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .help-header-right {
    width: 100%;
    justify-content: flex-end;
  }
  
  .help-section {
    padding: 12px;
  }
}

@media (max-width: 576px) {
  .help-container {
    padding: 12px;
  }
  
  .help-section {
    padding: 12px;
  }
  
  .help-section-header {
    margin-bottom: 12px;
  }
  
  .help-section-header span {
    font-size: 14px;
  }
  
  .help-feature-guide-item {
    padding: 12px;
  }
  
  .help-feature-guide-item h4 {
    font-size: 14px;
  }
  
  .help-feature-guide-item p {
    font-size: 13px;
  }
}

/* 反馈表单样式 */
.feedback-form {
  padding: 10px 0;
}

.feedback-form .ant-form-item {
  margin-bottom: 16px;
}

.feedback-form .ant-form-item-label {
  font-weight: 500;
  color: #333;
}

.feedback-form .ant-input,
.feedback-form .ant-select-selector,
.feedback-form .ant-input-textarea {
  border-radius: 4px;
}

.feedback-form .ant-input:focus,
.feedback-form .ant-select-selector:focus,
.feedback-form .ant-input-textarea:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}
</style>
