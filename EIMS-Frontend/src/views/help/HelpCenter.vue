<template>
  <MainLayout>
    <a-config-provider :locale="zhCN">
      <div class="help-container">
        <a-card class="help-card">
          <div class="help-card-header">
            <h3 class="help-card-title">帮助中心</h3>
            <div class="help-header-right">
              <a-space>
                <a-button type="primary" @click="handleFeedback">
                  <template #icon>
                    <QuestionCircleOutlined />
                  </template>
                  提交反馈
                </a-button>
                <a-button @click="handleDownloadGuide">
                  <template #icon>
                    <DownloadOutlined />
                  </template>
                  下载手册
                </a-button>
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
    </a-config-provider>
  </MainLayout>
</template>

<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import MainLayout from '../../components/layout/MainLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import {
  BookOutlined,
  QuestionCircleOutlined,
  CompassOutlined,
  PhoneOutlined,
  MailOutlined,
  MessageOutlined,
  DownloadOutlined
} from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

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
  message.info('提交反馈功能即将上线');
};

const handleDownloadGuide = () => {
  message.info('正在准备下载手册...');
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
  justify-content: space-between;
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
</style>
