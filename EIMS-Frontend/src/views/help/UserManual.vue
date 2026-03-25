<template>
  <div class="user-manual" ref="manualRef">
    <!-- 封面 -->
    <div class="manual-cover">
      <div class="cover-content">
        <div class="cover-logo">
          <img src="@/assets/icons/logo.svg" alt="星珩科技" />
        </div>
        <h1 class="cover-title">EIMS企业综合管理系统</h1>
        <h2 class="cover-subtitle">用户操作手册</h2>
        <div class="cover-version">版本：V1.0.0</div>
        <div class="cover-date">发布日期：2026年3月</div>
        <div class="cover-company">星珩科技有限公司</div>
      </div>
      <div class="cover-decoration">
        <div class="deco-circle circle-1"></div>
        <div class="deco-circle circle-2"></div>
        <div class="deco-circle circle-3"></div>
      </div>
    </div>

    <!-- 目录 -->
    <div class="manual-section">
      <h2 class="section-title">目录</h2>
      <div class="toc-list">
        <div class="toc-item" v-for="(item, index) in tableOfContents" :key="index">
          <span class="toc-number">{{ item.number }}</span>
          <span class="toc-text">{{ item.title }}</span>
          <span class="toc-page">{{ item.page }}</span>
        </div>
      </div>
    </div>

    <!-- 第一章：系统概述 -->
    <div class="manual-section">
      <h2 class="section-title">第一章 系统概述</h2>
      
      <h3>1.1 系统简介</h3>
      <p>EIMS（Enterprise Information Management System）企业综合管理系统是星珩科技有限公司自主研发的一套面向企业级用户的信息化管理平台。系统采用先进的微服务架构设计，结合人工智能和大数据分析技术，为企业提供全方位的数字化管理解决方案。</p>
      
      <h3>1.2 系统特点</h3>
      <ul>
        <li><strong>高效协同：</strong>支持多部门、多角色的协同办公，提升企业运营效率</li>
        <li><strong>安全可靠：</strong>采用企业级安全防护机制，保障数据安全和系统稳定</li>
        <li><strong>智能分析：</strong>内置数据分析引擎，提供可视化报表和智能决策支持</li>
        <li><strong>灵活配置：</strong>支持自定义配置，满足不同企业的个性化需求</li>
        <li><strong>易于扩展：</strong>模块化设计，支持功能扩展和系统集成</li>
      </ul>

      <h3>1.3 系统架构</h3>
      <p>系统采用前后端分离架构：</p>
      <ul>
        <li><strong>前端：</strong>Vue 3 + TypeScript + Ant Design Vue</li>
        <li><strong>后端：</strong>Python FastAPI + PostgreSQL + Redis</li>
        <li><strong>部署：</strong>支持Docker容器化部署和云原生部署</li>
      </ul>
    </div>

    <!-- 第二章：快速入门 -->
    <div class="manual-section">
      <h2 class="section-title">第二章 快速入门</h2>
      
      <h3>2.1 系统登录</h3>
      <div class="step-list">
        <div class="step-item">
          <span class="step-number">1</span>
          <div class="step-content">
            <strong>打开浏览器</strong>
            <p>推荐使用Chrome、Firefox、Edge等现代浏览器，访问系统地址：https://eims.xingheng.com</p>
          </div>
        </div>
        <div class="step-item">
          <span class="step-number">2</span>
          <div class="step-content">
            <strong>输入账号</strong>
            <p>在登录页面输入您的账号（工号/邮箱/手机号）和密码</p>
          </div>
        </div>
        <div class="step-item">
          <span class="step-number">3</span>
          <div class="step-content">
            <strong>完成登录</strong>
            <p>点击"登录"按钮，验证通过后即可进入系统首页</p>
          </div>
        </div>
      </div>

      <div class="tip-box">
        <strong>温馨提示：</strong>首次登录后建议立即修改默认密码，并绑定手机号或邮箱以便找回密码。
      </div>

      <h3>2.2 界面布局</h3>
      <p>系统界面采用经典的左右布局设计：</p>
      <ul>
        <li><strong>顶部导航栏：</strong>显示系统Logo、主导航菜单、消息通知、用户信息</li>
        <li><strong>左侧菜单栏：</strong>根据当前模块显示功能菜单，支持展开/收起</li>
        <li><strong>内容区域：</strong>显示当前页面的主要内容</li>
        <li><strong>面包屑导航：</strong>显示当前页面路径，支持快速返回</li>
      </ul>

      <h3>2.3 基本操作</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>操作类型</th>
            <th>操作说明</th>
            <th>快捷键</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>新增</td>
            <td>点击"新增"按钮创建新记录</td>
            <td>Ctrl + N</td>
          </tr>
          <tr>
            <td>编辑</td>
            <td>点击"编辑"按钮或行内编辑图标</td>
            <td>Ctrl + E</td>
          </tr>
          <tr>
            <td>删除</td>
            <td>点击"删除"按钮，确认后删除</td>
            <td>Delete</td>
          </tr>
          <tr>
            <td>查询</td>
            <td>输入关键词，按回车或点击搜索</td>
            <td>Ctrl + F</td>
          </tr>
          <tr>
            <td>导出</td>
            <td>点击"导出"按钮，选择导出格式</td>
            <td>Ctrl + Shift + E</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 第三章：功能模块 -->
    <div class="manual-section">
      <h2 class="section-title">第三章 功能模块详解</h2>
      
      <h3>3.1 用户管理</h3>
      <p>用户管理模块用于管理系统用户信息，包括员工档案、账号状态、权限分配等。</p>
      
      <h4>3.1.1 用户列表</h4>
      <ul>
        <li>查看所有系统用户的基本信息</li>
        <li>支持按部门、岗位、状态筛选</li>
        <li>支持关键词搜索（姓名、工号、邮箱）</li>
        <li>支持批量操作（启用/禁用/删除）</li>
      </ul>

      <h4>3.1.2 添加用户</h4>
      <ol>
        <li>点击"新增"按钮打开添加窗口</li>
        <li>填写用户基本信息（姓名、工号、部门、岗位）</li>
        <li>设置登录账号（系统自动生成或手动设置）</li>
        <li>分配角色和权限</li>
        <li>点击"保存"完成添加</li>
      </ol>

      <h4>3.1.3 用户导入</h4>
      <p>支持通过Excel模板批量导入用户：</p>
      <ol>
        <li>下载系统提供的导入模板</li>
        <li>按模板格式填写用户信息</li>
        <li>点击"导入"按钮选择文件</li>
        <li>系统验证数据格式，显示预览</li>
        <li>确认无误后提交导入</li>
      </ol>

      <h3>3.2 角色与权限</h3>
      <p>角色管理用于定义系统中的用户角色及其对应的操作权限。</p>
      
      <h4>3.2.1 角色类型</h4>
      <table class="data-table">
        <thead>
          <tr>
            <th>角色名称</th>
            <th>权限范围</th>
            <th>适用对象</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>系统管理员</td>
            <td>全部功能</td>
            <td>IT管理员</td>
          </tr>
          <tr>
            <td>部门经理</td>
            <td>本部门及下属部门</td>
            <td>部门负责人</td>
          </tr>
          <tr>
            <td>普通员工</td>
            <td>个人相关功能</td>
            <td>一般员工</td>
          </tr>
          <tr>
            <td>访客</td>
            <td>只读权限</td>
            <td>临时用户</td>
          </tr>
        </tbody>
      </table>

      <h3>3.3 部门管理</h3>
      <p>部门管理用于维护企业的组织架构信息。</p>
      
      <h4>3.3.1 部门结构</h4>
      <ul>
        <li>支持多级部门层级（最多5级）</li>
        <li>支持部门排序和拖拽调整</li>
        <li>支持部门合并和拆分</li>
        <li>可视化组织架构图</li>
      </ul>

      <h3>3.4 系统配置</h3>
      
      <h4>3.4.1 基本配置</h4>
      <ul>
        <li>系统名称和Logo设置</li>
        <li>登录页面配置</li>
        <li>密码策略设置</li>
        <li>会话超时设置</li>
      </ul>

      <h4>3.4.2 邮件配置</h4>
      <ul>
        <li>SMTP服务器设置</li>
        <li>发件人信息配置</li>
        <li>邮件模板管理</li>
        <li>邮件发送测试</li>
      </ul>

      <h4>3.4.3 通知配置</h4>
      <ul>
        <li>通知渠道设置（邮件/短信/站内信）</li>
        <li>通知模板管理</li>
        <li>通知触发规则</li>
      </ul>

      <h3>3.5 日志管理</h3>
      
      <h4>3.5.1 操作日志</h4>
      <p>记录用户在系统中的所有操作行为，包括：</p>
      <ul>
        <li>登录/登出记录</li>
        <li>数据增删改查操作</li>
        <li>权限变更记录</li>
        <li>系统配置修改</li>
      </ul>

      <h4>3.5.2 系统日志</h4>
      <p>记录系统运行状态和异常信息，用于故障排查。</p>

      <h3>3.6 数据备份</h3>
      
      <h4>3.6.1 备份策略</h4>
      <ul>
        <li><strong>全量备份：</strong>备份所有数据，建议每周执行一次</li>
        <li><strong>增量备份：</strong>只备份变化的数据，建议每天执行</li>
        <li><strong>手动备份：</strong>根据需要随时执行</li>
      </ul>

      <h4>3.6.2 数据恢复</h4>
      <ol>
        <li>在备份列表中选择要恢复的备份文件</li>
        <li>点击"恢复"按钮</li>
        <li>确认恢复操作（会覆盖当前数据）</li>
        <li>等待恢复完成</li>
      </ol>

      <div class="warning-box">
        <strong>重要提示：</strong>数据恢复操作会覆盖当前数据，请在执行前确认备份文件的完整性和正确性。
      </div>
    </div>

    <!-- 第四章：常见问题 -->
    <div class="manual-section">
      <h2 class="section-title">第四章 常见问题解答</h2>
      
      <div class="faq-list">
        <div class="faq-item" v-for="(faq, index) in faqList" :key="index">
          <h4 class="faq-question">Q{{ index + 1 }}: {{ faq.question }}</h4>
          <div class="faq-answer">
            <p><strong>A:</strong> {{ faq.answer }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 第五章：技术支持 -->
    <div class="manual-section">
      <h2 class="section-title">第五章 技术支持</h2>
      
      <h3>5.1 联系方式</h3>
      <div class="contact-list">
        <div class="contact-item">
          <div class="contact-icon">📞</div>
          <div class="contact-info">
            <h4>电话支持</h4>
            <p>400-123-4567</p>
            <span>工作日 9:00-18:00</span>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">📧</div>
          <div class="contact-info">
            <h4>邮件支持</h4>
            <p>support@xingheng.com</p>
            <span>24小时内回复</span>
          </div>
        </div>
        <div class="contact-item">
          <div class="contact-icon">💬</div>
          <div class="contact-info">
            <h4>在线客服</h4>
            <p>系统内在线聊天</p>
            <span>工作日 9:00-18:00</span>
          </div>
        </div>
      </div>

      <h3>5.2 服务承诺</h3>
      <ul>
        <li>一般问题：2小时内响应</li>
        <li>紧急问题：30分钟内响应</li>
        <li>系统故障：7×24小时支持</li>
        <li>定期巡检：每月一次系统健康检查</li>
      </ul>

      <h3>5.3 培训服务</h3>
      <p>我们提供以下培训服务：</p>
      <ul>
        <li>新用户入门培训（免费）</li>
        <li>管理员高级培训</li>
        <li>定制化功能培训</li>
        <li>在线视频教程</li>
      </ul>
    </div>

    <!-- 附录 -->
    <div class="manual-section">
      <h2 class="section-title">附录</h2>
      
      <h3>附录A：术语表</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>术语</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>EIMS</td>
            <td>Enterprise Information Management System，企业信息管理系统</td>
          </tr>
          <tr>
            <td>RBAC</td>
            <td>Role-Based Access Control，基于角色的访问控制</td>
          </tr>
          <tr>
            <td>SSO</td>
            <td>Single Sign-On，单点登录</td>
          </tr>
          <tr>
            <td>API</td>
            <td>Application Programming Interface，应用程序接口</td>
          </tr>
          <tr>
            <td>LDAP</td>
            <td>Lightweight Directory Access Protocol，轻量级目录访问协议</td>
          </tr>
        </tbody>
      </table>

      <h3>附录B：更新记录</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>版本</th>
            <th>日期</th>
            <th>更新内容</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>V1.0.0</td>
            <td>2026-03-25</td>
            <td>系统正式发布</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 封底 -->
    <div class="manual-back-cover">
      <div class="back-content">
        <div class="back-logo">
          <img src="@/assets/icons/logo.svg" alt="星珩科技" />
        </div>
        <h2>星珩科技有限公司</h2>
        <p>新质生产力 · 数字新基座 · 智领新纪元</p>
        <div class="back-contact">
          <p>官方网站：www.xingheng.com</p>
          <p>服务热线：400-123-4567</p>
          <p>技术支持：support@xingheng.com</p>
        </div>
        <div class="back-copyright">
          <p>© 2026 星珩科技有限公司 版权所有</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const manualRef = ref<HTMLElement>();

const tableOfContents = ref([
  { number: '第一章', title: '系统概述', page: '1' },
  { number: '第二章', title: '快速入门', page: '3' },
  { number: '第三章', title: '功能模块详解', page: '5' },
  { number: '第四章', title: '常见问题解答', page: '12' },
  { number: '第五章', title: '技术支持', page: '14' },
  { number: '附录', title: '术语表与更新记录', page: '15' }
]);

const faqList = ref([
  {
    question: '忘记密码怎么办？',
    answer: '点击登录页面的"忘记密码"链接，输入绑定的邮箱或手机号，按照提示完成密码重置。如果无法自助重置，请联系系统管理员。'
  },
  {
    question: '如何修改个人信息？',
    answer: '登录系统后，点击右上角用户名，选择"个人中心"，在个人信息页面可以修改联系方式、头像等信息。部分信息（如姓名、工号）需要管理员权限才能修改。'
  },
  {
    question: '系统支持哪些浏览器？',
    answer: '推荐使用Chrome 90+、Firefox 88+、Edge 90+、Safari 14+等现代浏览器。IE浏览器不再支持。'
  },
  {
    question: '如何导出数据？',
    answer: '在数据列表页面，点击"导出"按钮，选择导出格式（Excel/CSV/PDF），设置导出范围（当前页/全部/选中项），点击确认即可下载。'
  },
  {
    question: '系统卡顿或加载慢怎么办？',
    answer: '1. 检查网络连接是否正常；2. 清除浏览器缓存；3. 关闭不必要的浏览器标签页；4. 如问题持续，请联系技术支持。'
  },
  {
    question: '如何申请新功能或报告Bug？',
    answer: '在帮助中心点击"提交反馈"按钮，填写反馈内容，选择反馈类型（功能建议/Bug报告/其他），提交后我们的产品经理会跟进处理。'
  }
]);

defineExpose({
  manualRef
});
</script>

<style scoped lang="scss">
.user-manual {
  width: 210mm;
  min-height: 297mm;
  margin: 0 auto;
  background: #fff;
  font-family: "Microsoft YaHei", "PingFang SC", sans-serif;
  font-size: 14px;
  line-height: 1.8;
  color: #333;
}

// 封面样式
.manual-cover {
  height: 297mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  page-break-after: always;
}

.cover-content {
  text-align: center;
  z-index: 10;
}

.cover-logo {
  margin-bottom: 40px;
  
  img {
    width: 120px;
    height: auto;
    filter: brightness(0) invert(1);
  }
}

.cover-title {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: 4px;
}

.cover-subtitle {
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 60px;
  opacity: 0.9;
}

.cover-version {
  font-size: 16px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.cover-date {
  font-size: 16px;
  margin-bottom: 40px;
  opacity: 0.8;
}

.cover-company {
  font-size: 20px;
  font-weight: 600;
  opacity: 0.9;
}

.cover-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;

  .deco-circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);

    &.circle-1 {
      width: 600px;
      height: 600px;
      top: -200px;
      right: -200px;
    }

    &.circle-2 {
      width: 400px;
      height: 400px;
      bottom: -100px;
      left: -100px;
    }

    &.circle-3 {
      width: 300px;
      height: 300px;
      top: 50%;
      right: 10%;
    }
  }
}

// 章节样式
.manual-section {
  padding: 40px 60px;
  page-break-before: always;

  &:first-of-type {
    page-break-before: auto;
  }
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 30px;
  padding-bottom: 15px;
  border-bottom: 3px solid #1890ff;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 30px 0 15px 0;
}

h4 {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin: 20px 0 10px 0;
}

p {
  margin-bottom: 15px;
  text-align: justify;
}

ul, ol {
  margin: 15px 0;
  padding-left: 30px;

  li {
    margin-bottom: 8px;
  }
}

// 目录样式
.toc-list {
  margin-top: 30px;
}

.toc-item {
  display: flex;
  align-items: baseline;
  padding: 12px 0;
  border-bottom: 1px dotted #d9d9d9;

  .toc-number {
    width: 80px;
    font-weight: 600;
    color: #1890ff;
  }

  .toc-text {
    flex: 1;
    font-size: 15px;
  }

  .toc-page {
    width: 50px;
    text-align: right;
    color: #999;
  }
}

// 步骤列表
.step-list {
  margin: 20px 0;
}

.step-item {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 20px;
  background: #f6ffed;
  border-radius: 8px;
  border-left: 4px solid #52c41a;

  .step-number {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #52c41a;
    color: #fff;
    font-weight: 700;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;

    strong {
      display: block;
      margin-bottom: 8px;
      color: #262626;
    }

    p {
      margin: 0;
      color: #666;
    }
  }
}

// 提示框
.tip-box {
  margin: 20px 0;
  padding: 16px 20px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 8px;
  color: #096dd9;
}

.warning-box {
  margin: 20px 0;
  padding: 16px 20px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 8px;
  color: #cf1322;
}

// 数据表格
.data-table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;

  th, td {
    padding: 12px 16px;
    text-align: left;
    border: 1px solid #f0f0f0;
  }

  th {
    background: #fafafa;
    font-weight: 600;
    color: #262626;
  }

  tr:nth-child(even) {
    background: #fafafa;
  }
}

// FAQ样式
.faq-list {
  margin-top: 20px;
}

.faq-item {
  margin-bottom: 25px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;

  .faq-question {
    color: #1890ff;
    margin: 0 0 12px 0;
    font-size: 16px;
  }

  .faq-answer {
    color: #555;

    p {
      margin: 0;
    }
  }
}

// 联系方式
.contact-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin: 20px 0;
}

.contact-item {
  display: flex;
  gap: 15px;
  padding: 20px;
  background: #f6ffed;
  border-radius: 8px;

  .contact-icon {
    font-size: 32px;
  }

  .contact-info {
    h4 {
      margin: 0 0 8px 0;
      color: #262626;
    }

    p {
      margin: 0 0 4px 0;
      font-size: 16px;
      font-weight: 600;
      color: #52c41a;
    }

    span {
      font-size: 12px;
      color: #999;
    }
  }
}

// 封底样式
.manual-back-cover {
  height: 297mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f5f5f5;
  text-align: center;
  page-break-before: always;
}

.back-content {
  .back-logo {
    margin-bottom: 30px;

    img {
      width: 100px;
      height: auto;
    }
  }

  h2 {
    font-size: 28px;
    color: #1890ff;
    margin-bottom: 15px;
  }

  p {
    font-size: 16px;
    color: #666;
    margin-bottom: 40px;
  }
}

.back-contact {
  margin-bottom: 60px;

  p {
    margin: 8px 0;
    font-size: 14px;
    color: #666;
  }
}

.back-copyright {
  p {
    font-size: 12px;
    color: #999;
    margin: 0;
  }
}

// 打印样式
@media print {
  .user-manual {
    width: 100%;
    margin: 0;
  }

  .manual-section {
    page-break-before: always;
  }
}

// 屏幕预览样式
@media screen {
  .user-manual {
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    margin: 40px auto;
  }
}
</style>
