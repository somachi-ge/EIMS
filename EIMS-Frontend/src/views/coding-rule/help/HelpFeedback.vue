<template>
  <AppLayout>
    <div class="help-feedback">
      <a-card>
        <a-tabs default-active-key="help" class="help-tabs">
          <a-tab-pane key="help" tab="使用帮助">
            <div class="section-title">使用帮助</div>
            <div class="help-item">
              <h4>1. 如何新增编码规则？</h4>
              <p>进入【规则管理】→【规则列表】→点击【新增规则】，填写规则名称、编码类型、规则格式等信息，点击【保存规则】即可完成新增。</p>
            </div>
            <div class="help-item">
              <h4>2. 如何生成编码？</h4>
              <p>进入【编码生成】页面，选择要使用的编码规则，输入生成数量，点击【生成编码】即可批量生成编码，支持复制和导出生成结果。</p>
            </div>
            <div class="help-item">
              <h4>3. 如何解析编码？</h4>
              <p>进入【编码解析】页面，输入要解析的编码，点击【解析编码】，系统会自动解析编码的各个组成部分（如车间、年月、流水号等）。</p>
            </div>
            <div class="help-item">
              <h4>4. 如何处理编码断号？</h4>
              <p>进入【编码补号】页面，可选择【手动补号】或【自动补号】，手动补号需输入要补录的编码，自动补号可批量补录范围内的断号。</p>
            </div>
          </a-tab-pane>
          <a-tab-pane key="faq" tab="常见问题">
            <div class="section-title">常见问题</div>
            <div class="help-item">
              <h4>Q1：生成编码时提示规则不存在怎么办？</h4>
              <p>A：请检查选择的规则是否有效，或联系管理员确认规则是否已被删除或失效。</p>
            </div>
            <div class="help-item">
              <h4>Q2：编码解析失败的原因有哪些？</h4>
              <p>A：编码格式错误、编码不属于任何规则、编码已被作废等都可能导致解析失败，请检查编码是否正确。</p>
            </div>
            <div class="help-item">
              <h4>Q3：批量导入编码提示格式错误怎么办？</h4>
              <p>A：请下载导入模板，按照模板格式填写编码，确保编码符合对应规则的格式要求。</p>
            </div>
          </a-tab-pane>
          <a-tab-pane key="feedback" tab="意见反馈">
            <div class="section-title">意见反馈</div>
            <a-form @submit="handleSubmit" class="feedback-form">
              <a-form-item label="反馈类型" required>
                <a-select v-model:value="formData.type" placeholder="请选择反馈类型">
                  <a-select-option value="suggestion">功能建议</a-select-option>
                  <a-select-option value="problem">问题反馈</a-select-option>
                  <a-select-option value="experience">使用体验</a-select-option>
                  <a-select-option value="other">其他</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item label="反馈标题" required>
                <a-input v-model:value="formData.title" placeholder="请输入反馈标题（简明扼要）" />
              </a-form-item>
              <a-form-item label="反馈内容" required>
                <a-textarea v-model:value="formData.content" rows="5" placeholder="请详细描述您的问题或建议" />
              </a-form-item>
              <a-form-item label="联系方式（选填）">
                <a-input v-model:value="formData.contact" placeholder="请输入手机号或邮箱，方便回复" />
              </a-form-item>
              <a-form-item>
                <a-button type="primary" html-type="submit">提交反馈</a-button>
              </a-form-item>
            </a-form>
          </a-tab-pane>
          <a-tab-pane key="about" tab="关于系统">
            <div class="section-title">关于系统</div>
            <div class="about-box">
              <div class="logo-icon">编</div>
              <h3>编码规则管理系统</h3>
              <p>版本号：V1.0.0</p>
              <p>更新时间：2026-02-23</p>
              <p>适用场景：智改数转编码管理</p>
              <p>技术支持：xxx科技有限公司</p>
              <p>联系电话：400-xxxx-xxxx</p>
              <p>邮箱：support@xxx.com</p>
            </div>
          </a-tab-pane>
        </a-tabs>
      </a-card>
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '../layout/AppLayout.vue';
import { ref } from 'vue';
import { message } from 'ant-design-vue';

// 表单数据
const formData = ref({
  type: '',
  title: '',
  content: '',
  contact: ''
});

// 提交反馈
const handleSubmit = () => {
  // 这里可以添加表单验证逻辑
  message.success('反馈提交成功！我们会尽快处理您的反馈。');
  // 重置表单
  formData.value = {
    type: '',
    title: '',
    content: '',
    contact: ''
  };
};
</script>

<style scoped>
.help-feedback {
  padding: 20px;
}

.help-tabs {
  margin-top: 16px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 1px solid #e8e8e8;
  padding-bottom: 10px;
}

.help-item {
  margin-bottom: 24px;
}

.help-item h4 {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #333;
}

.help-item p {
  color: #666;
  line-height: 1.5;
  margin: 0;
}

.feedback-form {
  max-width: 600px;
}

.about-box {
  text-align: center;
  padding: 40px 0;
}

.logo-icon {
  display: inline-block;
  width: 80px;
  height: 80px;
  background-color: #1890ff;
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  line-height: 80px;
  border-radius: 50%;
  margin-bottom: 20px;
}

.about-box h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.about-box p {
  color: #666;
  margin-bottom: 8px;
  line-height: 1.5;
}
</style>