<template>
  <a-config-provider :locale="zhCN">
    <AppLayout>
      <div class="api-management">
        <div class="api-page">
          <!-- 页面标题 -->
          <h2 class="page-title">API接口管理</h2>

          <a-card class="api-card">
            <!-- 搜索和操作栏 -->
          <div class="table-toolbar" style="overflow-x: auto;">
            <div style="width: 100%; display: flex; gap: 8px; align-items: center; flex-wrap: nowrap;">
              <div style="flex: 1; min-width: 200px;">
                <a-input
                  v-model:value="searchKeyword"
                  placeholder="请输入接口名称或路径"
                  @keyup.enter="handleSearch"
                  allow-clear
                  style="width: 100%;"
                >
                  <template #prefix>
                    <SearchOutlined />
                  </template>
                </a-input>
              </div>
              <div style="flex: 0.6; min-width: 120px;">
                <a-select
                  v-model:value="searchMethod"
                  placeholder="请求方法"
                  allow-clear
                  style="width: 100%;"
                >
                  <a-select-option value="GET">GET</a-select-option>
                  <a-select-option value="POST">POST</a-select-option>
                  <a-select-option value="PUT">PUT</a-select-option>
                  <a-select-option value="DELETE">DELETE</a-select-option>
                </a-select>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button type="primary" @click="handleSearch" style="width: 100%;">查询</a-button>
              </div>
              <div style="flex: 0.4; min-width: 70px;">
                <a-button @click="handleReset" style="width: 100%;">重置</a-button>
              </div>
              <div style="flex: 0.01;"></div>
              <div class="action-area">
                <a-button type="primary" @click="handleAddApi">
                  <PlusOutlined />
                  新增接口
                </a-button>
              </div>
            </div>
          </div>

            <!-- API列表 -->
            <a-table
              :columns="apiColumns"
              :data-source="filteredApiList"
              row-key="id"
              :loading="loading"
              :pagination="pagination"
              @change="handleTableChange"
            >
              <template #method="{ record }">
                <a-tag :color="getMethodColor(record.method)">
                  {{ record.method }}
                </a-tag>
              </template>
              <template #status="{ record }">
                <a-switch
                  :checked="record.status === 'enabled'"
                  :checked-children="'启用'"
                  :un-checked-children="'停用'"
                  @change="() => toggleApiStatus(record)"
                />
              </template>
              <template #action="{ record }">
                <a-button type="link" size="small" @click="handleViewDetail(record)">
                  详情
                </a-button>
                <a-button type="link" size="small" @click="handleEdit(record)">
                  编辑
                </a-button>
                <a-button type="link" size="small" danger @click="handleDelete(record)">
                  删除
                </a-button>
              </template>
            </a-table>
          </a-card>

          <!-- 新增/编辑接口弹窗 -->
          <a-modal
            v-model:open="modalVisible"
            :title="isEdit ? '编辑接口' : '新增接口'"
            width="700px"
            @ok="handleModalOk"
            @cancel="handleModalCancel"
          >
            <a-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              layout="vertical"
            >
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="接口名称" name="name">
                    <a-input
                      v-model:value="formData.name"
                      placeholder="请输入接口名称"
                    />
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="请求方法" name="method">
                    <a-select v-model:value="formData.method" placeholder="请选择请求方法">
                      <a-select-option value="GET">GET</a-select-option>
                      <a-select-option value="POST">POST</a-select-option>
                      <a-select-option value="PUT">PUT</a-select-option>
                      <a-select-option value="DELETE">DELETE</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item label="接口路径" name="path">
                <a-input
                  v-model:value="formData.path"
                  placeholder="请输入接口路径，如 /api/v1/codes"
                >
                  <template #addonBefore>
                    <a-select v-model:value="formData.version" style="width: 100px">
                      <a-select-option value="/api/v1">/api/v1</a-select-option>
                      <a-select-option value="/api/v2">/api/v2</a-select-option>
                    </a-select>
                  </template>
                </a-input>
              </a-form-item>
              <a-form-item label="接口描述" name="description">
                <a-textarea
                  v-model:value="formData.description"
                  :rows="3"
                  placeholder="请输入接口描述"
                />
              </a-form-item>
              <a-row :gutter="16">
                <a-col :span="12">
                  <a-form-item label="认证方式" name="authType">
                    <a-select v-model:value="formData.authType" placeholder="请选择认证方式">
                      <a-select-option value="none">无认证</a-select-option>
                      <a-select-option value="token">Token认证</a-select-option>
                      <a-select-option value="oauth2">OAuth2.0</a-select-option>
                      <a-select-option value="apikey">API Key</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item label="限流策略" name="rateLimit">
                    <a-select v-model:value="formData.rateLimit" placeholder="请选择限流策略">
                      <a-select-option value="none">不限流</a-select-option>
                      <a-select-option value="100">100次/分钟</a-select-option>
                      <a-select-option value="500">500次/分钟</a-select-option>
                      <a-select-option value="1000">1000次/分钟</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
              </a-row>

              <!-- 请求参数 -->
              <div class="param-section">
                <div class="param-header">
                  <h4>请求参数</h4>
                  <a-button type="link" size="small" @click="addParam('request')">
                    <PlusOutlined />
                    添加参数
                  </a-button>
                </div>
                <div
                  v-for="(param, index) in formData.requestParams"
                  :key="index"
                  class="param-item"
                >
                  <a-row :gutter="8">
                    <a-col :span="6">
                      <a-input v-model:value="param.name" placeholder="参数名" />
                    </a-col>
                    <a-col :span="5">
                      <a-select v-model:value="param.type" placeholder="类型">
                        <a-select-option value="string">字符串</a-select-option>
                        <a-select-option value="number">数字</a-select-option>
                        <a-select-option value="boolean">布尔值</a-select-option>
                        <a-select-option value="array">数组</a-select-option>
                        <a-select-option value="object">对象</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="4">
                      <a-select v-model:value="param.required" placeholder="必填">
                        <a-select-option :value="true">必填</a-select-option>
                        <a-select-option :value="false">选填</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="7">
                      <a-input v-model:value="param.description" placeholder="参数说明" />
                    </a-col>
                    <a-col :span="2">
                      <a-button
                        type="link"
                        danger
                        size="small"
                        @click="removeParam('request', index)"
                      >
                        <DeleteOutlined />
                      </a-button>
                    </a-col>
                  </a-row>
                </div>
              </div>

              <!-- 响应参数 -->
              <div class="param-section">
                <div class="param-header">
                  <h4>响应参数</h4>
                  <a-button type="link" size="small" @click="addParam('response')">
                    <PlusOutlined />
                    添加参数
                  </a-button>
                </div>
                <div
                  v-for="(param, index) in formData.responseParams"
                  :key="index"
                  class="param-item"
                >
                  <a-row :gutter="8">
                    <a-col :span="6">
                      <a-input v-model:value="param.name" placeholder="参数名" />
                    </a-col>
                    <a-col :span="5">
                      <a-select v-model:value="param.type" placeholder="类型">
                        <a-select-option value="string">字符串</a-select-option>
                        <a-select-option value="number">数字</a-select-option>
                        <a-select-option value="boolean">布尔值</a-select-option>
                        <a-select-option value="array">数组</a-select-option>
                        <a-select-option value="object">对象</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="4">
                      <a-select v-model:value="param.required" placeholder="必填">
                        <a-select-option :value="true">必填</a-select-option>
                        <a-select-option :value="false">选填</a-select-option>
                      </a-select>
                    </a-col>
                    <a-col :span="7">
                      <a-input v-model:value="param.description" placeholder="参数说明" />
                    </a-col>
                    <a-col :span="2">
                      <a-button
                        type="link"
                        danger
                        size="small"
                        @click="removeParam('response', index)"
                      >
                        <DeleteOutlined />
                      </a-button>
                    </a-col>
                  </a-row>
                </div>
              </div>
            </a-form>
          </a-modal>

          <!-- 接口详情弹窗 -->
          <a-modal
            v-model:open="detailModalVisible"
            title="接口详情"
            width="800px"
            :footer="null"
          >
            <div v-if="currentApi" class="api-detail">
              <div class="detail-section">
                <h4>基本信息</h4>
                <a-descriptions :column="2">
                  <a-descriptions-item label="接口名称">
                    {{ currentApi.name }}
                  </a-descriptions-item>
                  <a-descriptions-item label="请求方法">
                    <a-tag :color="getMethodColor(currentApi.method)">
                      {{ currentApi.method }}
                    </a-tag>
                  </a-descriptions-item>
                  <a-descriptions-item label="接口路径" :span="2">
                    <code>{{ currentApi.path }}</code>
                  </a-descriptions-item>
                  <a-descriptions-item label="接口描述" :span="2">
                    {{ currentApi.description }}
                  </a-descriptions-item>
                  <a-descriptions-item label="认证方式">
                    {{ getAuthTypeText(currentApi.authType) }}
                  </a-descriptions-item>
                  <a-descriptions-item label="限流策略">
                    {{ getRateLimitText(currentApi.rateLimit) }}
                  </a-descriptions-item>
                </a-descriptions>
              </div>

              <div class="detail-section">
                <h4>请求参数</h4>
                <a-table
                  :columns="paramColumns"
                  :data-source="currentApi.requestParams"
                  :pagination="false"
                  size="small"
                />
              </div>

              <div class="detail-section">
                <h4>响应参数</h4>
                <a-table
                  :columns="paramColumns"
                  :data-source="currentApi.responseParams"
                  :pagination="false"
                  size="small"
                />
              </div>

              <div class="detail-section">
                <h4>调用示例</h4>
                <a-tabs default-active-key="curl">
                  <a-tab-pane key="curl" tab="cURL">
                    <pre class="code-block"><code>{{ generateCurlExample(currentApi) }}</code></pre>
                  </a-tab-pane>
                  <a-tab-pane key="javascript" tab="JavaScript">
                    <pre class="code-block"><code>{{ generateJsExample(currentApi) }}</code></pre>
                  </a-tab-pane>
                  <a-tab-pane key="python" tab="Python">
                    <pre class="code-block"><code>{{ generatePythonExample(currentApi) }}</code></pre>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </a-modal>
        </div>
      </div>
    </AppLayout>
  </a-config-provider>
</template>

<script setup lang="ts">
import AppLayout from '../layout/AppLayout.vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import { ref, reactive, computed } from 'vue';
import { message, Modal } from 'ant-design-vue';
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined
} from '@ant-design/icons-vue';

// 搜索条件
const searchKeyword = ref('');
const searchMethod = ref<string | undefined>(undefined);

// 加载状态
const loading = ref(false);

// 分页配置
const pagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total: number) => `共 ${total} 条记录`
});

// API列表数据
const apiList = ref([
  {
    id: 1,
    name: '生成编码',
    method: 'POST',
    path: '/api/v1/codes/generate',
    description: '根据规则生成编码',
    authType: 'token',
    rateLimit: '1000',
    status: 'enabled',
    requestParams: [
      { name: 'ruleCode', type: 'string', required: true, description: '规则编码' },
      { name: 'quantity', type: 'number', required: false, description: '生成数量' }
    ],
    responseParams: [
      { name: 'code', type: 'string', required: true, description: '生成的编码' },
      { name: 'message', type: 'string', required: true, description: '响应消息' }
    ]
  },
  {
    id: 2,
    name: '查询编码',
    method: 'GET',
    path: '/api/v1/codes',
    description: '查询编码列表',
    authType: 'token',
    rateLimit: '1000',
    status: 'enabled',
    requestParams: [
      { name: 'page', type: 'number', required: false, description: '页码' },
      { name: 'pageSize', type: 'number', required: false, description: '每页数量' }
    ],
    responseParams: [
      { name: 'data', type: 'array', required: true, description: '编码列表' },
      { name: 'total', type: 'number', required: true, description: '总数' }
    ]
  },
  {
    id: 3,
    name: '解析编码',
    method: 'POST',
    path: '/api/v1/codes/parse',
    description: '解析编码含义',
    authType: 'token',
    rateLimit: '500',
    status: 'enabled',
    requestParams: [
      { name: 'code', type: 'string', required: true, description: '编码' }
    ],
    responseParams: [
      { name: 'segments', type: 'array', required: true, description: '编码段信息' }
    ]
  },
  {
    id: 4,
    name: '作废编码',
    method: 'PUT',
    path: '/api/v1/codes/{code}/void',
    description: '作废指定编码',
    authType: 'token',
    rateLimit: '100',
    status: 'enabled',
    requestParams: [
      { name: 'code', type: 'string', required: true, description: '编码' },
      { name: 'reason', type: 'string', required: false, description: '作废原因' }
    ],
    responseParams: [
      { name: 'success', type: 'boolean', required: true, description: '是否成功' }
    ]
  },
  {
    id: 5,
    name: '删除编码',
    method: 'DELETE',
    path: '/api/v1/codes/{code}',
    description: '删除指定编码',
    authType: 'oauth2',
    rateLimit: '100',
    status: 'disabled',
    requestParams: [],
    responseParams: [
      { name: 'success', type: 'boolean', required: true, description: '是否成功' }
    ]
  }
]);

// 过滤后的API列表
const filteredApiList = computed(() => {
  let result = apiList.value;
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(api =>
      api.name.toLowerCase().includes(keyword) ||
      api.path.toLowerCase().includes(keyword)
    );
  }
  
  if (searchMethod.value) {
    result = result.filter(api => api.method === searchMethod.value);
  }
  
  return result;
});

// 表格列配置
const apiColumns = [
  { title: '接口名称', dataIndex: 'name', key: 'name', width: 180 },
  { title: '请求方法', key: 'method', width: 100, slots: { customRender: 'method' } },
  { title: '接口路径', dataIndex: 'path', key: 'path' },
  { title: '接口描述', dataIndex: 'description', key: 'description', ellipsis: true },
  { title: '认证方式', dataIndex: 'authType', key: 'authType', width: 120, customRender: ({ text }: { text: string }) => getAuthTypeText(text) },
  { title: '限流策略', dataIndex: 'rateLimit', key: 'rateLimit', width: 120, customRender: ({ text }: { text: string }) => getRateLimitText(text) },
  { title: '状态', key: 'status', width: 100, slots: { customRender: 'status' } },
  { title: '操作', key: 'action', width: 180, slots: { customRender: 'action' } }
];

// 参数表格列配置
const paramColumns = [
  { title: '参数名', dataIndex: 'name', key: 'name' },
  { title: '类型', dataIndex: 'type', key: 'type' },
  { title: '必填', dataIndex: 'required', key: 'required', customRender: ({ text }: { text: boolean }) => text ? '是' : '否' },
  { title: '说明', dataIndex: 'description', key: 'description' }
];

// 弹窗相关
const modalVisible = ref(false);
const isEdit = ref(false);
const formRef = ref();

// 表单数据
const formData = reactive({
  id: null as number | null,
  name: '',
  method: 'GET',
  version: '/api/v1',
  path: '',
  description: '',
  authType: 'token',
  rateLimit: '1000',
  requestParams: [] as any[],
  responseParams: [] as any[]
});

// 表单校验规则
const formRules = {
  name: [{ required: true, message: '请输入接口名称', trigger: 'blur' }],
  method: [{ required: true, message: '请选择请求方法', trigger: 'change' }],
  path: [{ required: true, message: '请输入接口路径', trigger: 'blur' }]
};

// 详情弹窗
const detailModalVisible = ref(false);
const currentApi = ref<any>(null);

// 获取请求方法颜色
const getMethodColor = (method: string): string => {
  const colorMap: Record<string, string> = {
    GET: 'blue',
    POST: 'green',
    PUT: 'orange',
    DELETE: 'red'
  };
  return colorMap[method] || 'default';
};

// 获取认证方式文本
const getAuthTypeText = (type: string): string => {
  const textMap: Record<string, string> = {
    none: '无认证',
    token: 'Token认证',
    oauth2: 'OAuth2.0',
    apikey: 'API Key'
  };
  return textMap[type] || type;
};

// 获取限流策略文本
const getRateLimitText = (limit: string): string => {
  const textMap: Record<string, string> = {
    none: '不限流',
    '100': '100次/分钟',
    '500': '500次/分钟',
    '1000': '1000次/分钟'
  };
  return textMap[limit] || limit;
};

// 查询
const handleSearch = () => {
  pagination.current = 1;
};

// 重置
const handleReset = () => {
  searchKeyword.value = '';
  searchMethod.value = undefined;
  pagination.current = 1;
};

// 新增接口
const handleAddApi = () => {
  isEdit.value = false;
  resetForm();
  modalVisible.value = true;
};

// 编辑接口
const handleEdit = (record: any) => {
  isEdit.value = true;
  Object.assign(formData, {
    id: record.id,
    name: record.name,
    method: record.method,
    version: record.path.substring(0, record.path.indexOf('/', 5)),
    path: record.path.substring(record.path.indexOf('/', 5)),
    description: record.description,
    authType: record.authType,
    rateLimit: record.rateLimit,
    requestParams: [...record.requestParams],
    responseParams: [...record.responseParams]
  });
  modalVisible.value = true;
};

// 删除接口
const handleDelete = (record: any) => {
  Modal.confirm({
    title: '确认删除',
    content: `确定要删除接口 "${record.name}" 吗？`,
    okText: '确认',
    cancelText: '取消',
    okType: 'danger',
    onOk: () => {
      const index = apiList.value.findIndex(api => api.id === record.id);
      if (index !== -1) {
        apiList.value.splice(index, 1);
        message.success('接口删除成功');
      }
    }
  });
};

// 查看详情
const handleViewDetail = (record: any) => {
  currentApi.value = record;
  detailModalVisible.value = true;
};

// 切换接口状态
const toggleApiStatus = (record: any) => {
  record.status = record.status === 'enabled' ? 'disabled' : 'enabled';
  message.success(`接口已${record.status === 'enabled' ? '启用' : '停用'}`);
};

// 表格变化
const handleTableChange = (pag: any) => {
  pagination.current = pag.current;
  pagination.pageSize = pag.pageSize;
};

// 重置表单
const resetForm = () => {
  formData.id = null;
  formData.name = '';
  formData.method = 'GET';
  formData.version = '/api/v1';
  formData.path = '';
  formData.description = '';
  formData.authType = 'token';
  formData.rateLimit = '1000';
  formData.requestParams = [];
  formData.responseParams = [];
};

// 添加参数
const addParam = (type: 'request' | 'response') => {
  const param = { name: '', type: 'string', required: false, description: '' };
  if (type === 'request') {
    formData.requestParams.push(param);
  } else {
    formData.responseParams.push(param);
  }
};

// 删除参数
const removeParam = (type: 'request' | 'response', index: number) => {
  if (type === 'request') {
    formData.requestParams.splice(index, 1);
  } else {
    formData.responseParams.splice(index, 1);
  }
};

// 弹窗确认
const handleModalOk = async () => {
  try {
    await formRef.value.validate();
    
    const apiData = {
      id: formData.id || Date.now(),
      name: formData.name,
      method: formData.method,
      path: formData.version + formData.path,
      description: formData.description,
      authType: formData.authType,
      rateLimit: formData.rateLimit,
      status: 'enabled',
      requestParams: formData.requestParams,
      responseParams: formData.responseParams
    };
    
    if (isEdit.value) {
      const index = apiList.value.findIndex(api => api.id === formData.id);
      if (index !== -1) {
        apiList.value[index] = apiData;
      }
      message.success('接口更新成功');
    } else {
      apiList.value.push(apiData);
      message.success('接口创建成功');
    }
    
    modalVisible.value = false;
  } catch (error) {
    console.error('表单校验失败:', error);
  }
};

// 弹窗取消
const handleModalCancel = () => {
  modalVisible.value = false;
};

// 生成cURL示例
const generateCurlExample = (api: any): string => {
  const method = api.method;
  const url = `https://api.example.com${api.path}`;
  
  let curl = `curl -X ${method} \\\n  '${url}' \\\n  -H 'Authorization: Bearer YOUR_TOKEN' \\\n  -H 'Content-Type: application/json'`;
  
  if (method === 'POST' || method === 'PUT') {
    const body: Record<string, any> = {};
    api.requestParams.forEach((param: any) => {
      if (param.required) {
        body[param.name] = param.type === 'number' ? 0 : 'string';
      }
    });
    curl += ` \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }
  
  return curl;
};

// 生成JavaScript示例
const generateJsExample = (api: any): string => {
  const method = api.method.toLowerCase();
  const url = `https://api.example.com${api.path}`;
  
  let code = `const axios = require('axios');\n\n`;
  code += `const config = {\n`;
  code += `  method: '${method}',\n`;
  code += `  url: '${url}',\n`;
  code += `  headers: {\n`;
  code += `    'Authorization': 'Bearer YOUR_TOKEN',\n`;
  code += `    'Content-Type': 'application/json'\n`;
  code += `  }`;
  
  if (method === 'post' || method === 'put') {
    const body: Record<string, any> = {};
    api.requestParams.forEach((param: any) => {
      if (param.required) {
        body[param.name] = param.type === 'number' ? 0 : 'string';
      }
    });
    code += `,\n  data: ${JSON.stringify(body, null, 2).replace(/\n/g, '\n  ')}`;
  }
  
  code += `\n};\n\n`;
  code += `axios(config)\n`;
  code += `  .then(response => console.log(response.data))\n`;
  code += `  .catch(error => console.error(error));`;
  
  return code;
};

// 生成Python示例
const generatePythonExample = (api: any): string => {
  const method = api.method.toLowerCase();
  const url = `https://api.example.com${api.path}`;
  
  let code = `import requests\n\n`;
  code += `url = "${url}"\n`;
  code += `headers = {\n`;
  code += `    "Authorization": "Bearer YOUR_TOKEN",\n`;
  code += `    "Content-Type": "application/json"\n`;
  code += `}\n\n`;
  
  if (method === 'post' || method === 'put') {
    const body: Record<string, any> = {};
    api.requestParams.forEach((param: any) => {
      if (param.required) {
        body[param.name] = param.type === 'number' ? 0 : 'string';
      }
    });
    code += `payload = ${JSON.stringify(body, null, 4).replace(/\n/g, '\n    ')}\n\n`;
    code += `response = requests.${method}(url, headers=headers, json=payload)\n`;
  } else {
    code += `response = requests.${method}(url, headers=headers)\n`;
  }
  
  code += `print(response.json())`;
  
  return code;
};
</script>

<style scoped>
.api-management {
  width: 100%;
  padding: 1.5%;
}

.api-page {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.09);
  padding: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

/* 卡片样式 - 与RuleList一致 */
.api-card {
  border-radius: 8px;
  box-shadow: none;
  border: none;
  transition: all 0.3s ease;
}

.api-card:hover {
  box-shadow: none;
}

/* 工具栏样式 - 与RuleList一致 */
.table-toolbar {
  margin-bottom: 20px;
  padding: 16px;
  background-color: #f5f5f5;
  border-radius: 4px;
}

.action-area {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.action-area :deep(.ant-btn) {
  transition: all 0.3s ease;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
}

.action-area :deep(.ant-btn:hover) {
  opacity: 0.8;
  transform: translateY(-1px);
}

/* 参数区域样式 */
.param-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

.param-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.param-header h4 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.param-item {
  margin-bottom: 8px;
}

/* 详情样式 */
.api-detail {
  max-height: 600px;
  overflow-y: auto;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f0f0f0;
}

.code-block {
  background-color: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 16px;
  overflow-x: auto;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  line-height: 1.6;
  color: #24292e;
}

code {
  background-color: #f6f8fa;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 13px;
  color: #24292e;
}
</style>
