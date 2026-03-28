<template>
  <AppLayout>
    <a-config-provider :locale="zhCN">
      <div class="coding-rule-container">
        <!-- 核心数据概览 -->
        <div class="data-overview">
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-icon blue">
                <UnorderedListOutlined />
              </div>
              <div class="stat-content">
                <div class="stat-number">12</div>
                <div class="stat-label">有效编码规则</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon blue">
                <CodeOutlined />
              </div>
              <div class="stat-content">
                <div class="stat-number">1,286</div>
                <div class="stat-label">已生成编码</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon green">
                <LinkOutlined />
              </div>
              <div class="stat-content">
                <div class="stat-number">968</div>
                <div class="stat-label">已绑定编码</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon red">
                <WarningOutlined />
              </div>
              <div class="stat-content">
                <div class="stat-number">3</div>
                <div class="stat-label">待处理异常</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 主要内容区域 -->
        <div class="main-content-area">
          <!-- 左侧内容 -->
          <div class="left-content">
            <!-- 快速操作入口 -->
            <div class="quick-actions">
              <h2 class="section-title">快捷操作</h2>
              <div class="action-grid">
                <div class="action-item blue" @click="navigateToRuleManagement">
                  <div class="action-icon">
                    <UnorderedListOutlined />
                  </div>
                  <span class="action-label">规则管理</span>
                </div>
                <div class="action-item cyan" @click="navigateToCodeGenerate">
                  <div class="action-icon">
                    <CodeOutlined />
                  </div>
                  <span class="action-label">编码生成</span>
                </div>
                <div class="action-item purple" @click="navigateToCodeParse">
                  <div class="action-icon">
                    <SearchOutlined />
                  </div>
                  <span class="action-label">编码解析</span>
                </div>
                <div class="action-item orange" @click="navigateToImportExport">
                  <div class="action-icon">
                    <ImportOutlined />
                  </div>
                  <span class="action-label">批量导入导出</span>
                </div>
                <div class="action-item green" @click="navigateToCodeComplement">
                  <div class="action-icon">
                    <EditOutlined />
                  </div>
                  <span class="action-label">编码补号</span>
                </div>
                <div class="action-item pink" @click="navigateToCodeBind">
                  <div class="action-icon">
                    <LinkOutlined />
                  </div>
                  <span class="action-label">编码绑定/解绑</span>
                </div>
              </div>
            </div>

            <!-- 编码状态分布 -->
            <div class="status-distribution-card">
              <h2 class="section-title">状态分布</h2>
              <div class="status-table">
                <div class="table-header">
                  <span class="header-cell">状态</span>
                  <span class="header-cell">数量</span>
                  <span class="header-cell">占比</span>
                  <span class="header-cell">操作</span>
                </div>
                <div class="table-row">
                  <span class="cell">
                    <a-tag color="green" :bordered="false">有效（已绑定）</a-tag>
                  </span>
                  <span class="cell">968</span>
                  <span class="cell">75.3%</span>
                  <span class="cell">
                    <a-button type="link" size="small" @click="viewCodeByStatus('bound')">查看</a-button>
                  </span>
                </div>
                <div class="table-row">
                  <span class="cell">
                    <a-tag color="green" :bordered="false">有效（未绑定）</a-tag>
                  </span>
                  <span class="cell">318</span>
                  <span class="cell">24.7%</span>
                  <span class="cell">
                    <a-button type="link" size="small" @click="viewCodeByStatus('unbound')">查看</a-button>
                  </span>
                </div>
                <div class="table-row">
                  <span class="cell">
                    <a-tag color="red" :bordered="false">已作废</a-tag>
                  </span>
                  <span class="cell">0</span>
                  <span class="cell">0.0%</span>
                  <span class="cell">
                    <span class="no-data">无数据</span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧内容 - 近期操作日志 -->
          <div class="right-content">
            <div class="operation-logs">
              <h2 class="section-title">操作日志</h2>
              <div class="log-list">
                <div class="log-item">
                  <span class="log-time">2026-02-23 15:30</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">提交编码绑定申请</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-23 14:15</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">批量生成10条设备编码</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-23 10:00</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">提交编码解绑申请</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-23 09:30</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">查询编码断号</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-22 16:45</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">新增设备编码规则</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-22 14:20</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">导出编码数据</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-22 11:00</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">修改编码规则</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-21 16:30</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">批量导入设备编码</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-21 10:15</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">删除过期编码规则</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-20 15:45</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">查询编码使用记录</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-20 09:00</span>
                  <span class="log-content">
                    <span class="log-user">管理员 admin</span>
                    <span class="log-action">启用新的编码规则</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
                <div class="log-item">
                  <span class="log-time">2026-02-19 14:30</span>
                  <span class="log-content">
                    <span class="log-user">操作员 operator</span>
                    <span class="log-action">批量生成产品编码</span>
                  </span>
                  <a-tag color="green" :bordered="false" class="log-status">成功</a-tag>
                </div>
              </div>
              <div class="view-all">
                <a-button type="link" @click="navigateToLogList">查看全部日志</a-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 系统提醒与公告 -->
        <div class="system-notices">
          <h2 class="section-title">提醒公告</h2>
          <div class="notice-list">
            <div class="notice-item">
              <div class="notice-icon warning">
                <BellOutlined />
              </div>
              <div class="notice-content">
                <span class="notice-type">提醒：</span>
                <span class="notice-text">当前有3条编码断号待补录，请及时处理</span>
                <a-button type="link" size="small" class="notice-action" @click="handleComplementCode">立即处理</a-button>
              </div>
            </div>
            <div class="notice-item">
              <div class="notice-icon warning">
                <BellOutlined />
              </div>
              <div class="notice-content">
                <span class="notice-type">提醒：</span>
                <span class="notice-text">编码规则「EQ-RULE-003」将于3天后失效，请检查更新</span>
                <a-button type="link" size="small" class="notice-action" @click="handleCheckRule('EQ-RULE-003')">检查规则</a-button>
              </div>
            </div>
            <div class="notice-item">
              <div class="notice-icon info">
                <InfoCircleOutlined />
              </div>
              <div class="notice-content">
                <span class="notice-type">公告：</span>
                <span class="notice-text">系统将于2026-02-28 22:00-23:00进行维护，期间暂停编码生成功能，请合理安排工作。</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-config-provider>
  </AppLayout>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import AppLayout from './layout/AppLayout.vue'
import { useRouter } from 'vue-router'
import {
  UnorderedListOutlined,
  CodeOutlined,
  LinkOutlined,
  WarningOutlined,
  SearchOutlined,
  ImportOutlined,
  EditOutlined,
  BellOutlined,
  InfoCircleOutlined
} from '@ant-design/icons-vue'

// 路由
const router = useRouter();

// 导航到规则管理页面
const navigateToRuleManagement = () => {
  router.push('/coding-rule/rule-management/list');
};

// 导航到编码生成页面
const navigateToCodeGenerate = () => {
  router.push('/coding-rule/generator');
};

// 导航到编码解析页面
const navigateToCodeParse = () => {
  router.push('/coding-rule/parse');
};

// 导航到批量导入导出页面
const navigateToImportExport = () => {
  router.push('/coding-rule/rule-management/import-export');
};

// 导航到编码补号页面
const navigateToCodeComplement = () => {
  router.push('/coding-rule/generator/complement');
};

// 导航到编码绑定/解绑页面
const navigateToCodeBind = () => {
  router.push('/coding-rule/generator/bind');
};

// 导航到日志查询页面
const navigateToLogList = () => {
  router.push('/coding-rule/log');
};

// 按状态查看编码列表
const viewCodeByStatus = (status: string) => {
  router.push({
    path: '/coding-rule/generator',
    query: { status }
  });
};

// 处理编码断号补录
const handleComplementCode = () => {
  router.push('/coding-rule/generator/complement');
};

// 检查规则详情
const handleCheckRule = (ruleCode: string) => {
  router.push({
    path: '/coding-rule/rule-management/list',
    query: { ruleCode }
  });
};
</script>

<style scoped>
.coding-rule-container {
  width: 100%;
  padding: 1.5%;
}

/* 核心数据概览 */
.data-overview {
  margin-bottom: 24px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 16px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.stat-card:hover {
  opacity: 0.8;
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.stat-icon.blue {
  background-color: #e6f7ff;
  color: #1890ff;
}

.stat-icon.green {
  background-color: #f6ffed;
  color: #52c41a;
}

.stat-icon.red {
  background-color: #fff2f0;
  color: #ff4d4f;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #262626;
  line-height: 1.2;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

/* 主要内容区域 */
.main-content-area {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
  align-items: stretch;
}

.left-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.right-content {
  display: flex;
  flex-direction: column;
}

/* 快速操作入口 */
.quick-actions {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
}

.action-item:hover {
  opacity: 0.8;
  transform: translateY(-2px);
}

/* 蓝色 - 规则管理 */
.action-item.blue {
  background-color: #e6f7ff;
  border-color: #91d5ff;
}

.action-item.blue .action-icon {
  background-color: #1890ff;
  color: #fff;
}

/* 青色 - 编码生成 */
.action-item.cyan {
  background-color: #e6fffb;
  border-color: #87e8de;
}

.action-item.cyan .action-icon {
  background-color: #13c2c2;
  color: #fff;
}

/* 紫色 - 编码解析 */
.action-item.purple {
  background-color: #f9f0ff;
  border-color: #d3adf7;
}

.action-item.purple .action-icon {
  background-color: #722ed1;
  color: #fff;
}

/* 橙色 - 批量导入导出 */
.action-item.orange {
  background-color: #fff7e6;
  border-color: #ffd591;
}

.action-item.orange .action-icon {
  background-color: #fa8c16;
  color: #fff;
}

/* 绿色 - 编码补号 */
.action-item.green {
  background-color: #f6ffed;
  border-color: #b7eb8f;
}

.action-item.green .action-icon {
  background-color: #52c41a;
  color: #fff;
}

/* 粉色 - 编码绑定/解绑 */
.action-item.pink {
  background-color: #fff0f6;
  border-color: #ffadd2;
}

.action-item.pink .action-icon {
  background-color: #eb2f96;
  color: #fff;
}

.action-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
  font-size: 20px;
  transition: all 0.3s ease;
}

.action-label {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

/* 编码状态分布 */
.status-distribution-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.status-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.cell {
  font-size: 14px;
  color: #262626;
}

.status-text {
  color: #262626;
}

.no-data {
  color: #8c8c8c;
}

/* 近期操作日志 */
.operation-logs {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.log-list {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 16px;
  max-height: 440px;
}

.log-list::-webkit-scrollbar {
  width: 6px;
}

.log-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.log-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.log-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 14px;
}

.log-item:last-child {
  border-bottom: none;
}

.log-time {
  font-size: 12px;
  color: #8c8c8c;
  white-space: nowrap;
  flex-shrink: 0;
}

.log-content {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
  overflow: hidden;
}

.log-user {
  color: #262626;
}

.log-action {
  color: #595959;
}

.log-status {
  font-size: 12px;
  flex-shrink: 0;
}

.view-all {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  flex-shrink: 0;
}

/* 系统提醒与公告 */
.system-notices {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.notice-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.notice-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  flex-shrink: 0;
  margin-top: 2px;
}

.notice-icon.warning {
  color: #faad14;
}

.notice-icon.info {
  color: #1890ff;
}

.notice-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
}

.notice-type {
  color: #262626;
  font-weight: 500;
}

.notice-text {
  color: #595959;
}

.notice-action {
  padding: 0 4px;
  height: auto;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-content-area {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-cards {
    grid-template-columns: 1fr;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 80px;
    font-size: 12px;
  }
}

@media (max-width: 576px) {
  .action-grid {
    grid-template-columns: 1fr;
  }
}
</style>