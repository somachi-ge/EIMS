<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
    Card,
    Form,
    FormItem,
    Input,
    Select,
    SelectOption,
    Switch,
    Button,
    Space,
    message
} from 'ant-design-vue'
import type { RuleObject } from 'ant-design-vue/es/form'

// 短信服务商选项
const providerOptions = [
    { label: '阿里云短信', value: 'aliyun' },
    { label: '腾讯云短信', value: 'tencent' },
    { label: '华为云短信', value: 'huawei' }
]

// 表单数据
const formState = reactive({
    // 短信服务开关
    enabled: true,
    provider: 'aliyun',
    accessKeyId: 'LTAI5xxxxxxxxxQrD',
    accessKeySecret: 'xxxxxxxxxQrDxxxx',
    signName: '编码规则引擎',
    // 模板配置
    loginTemplate: 'SMS_12345678',
    codeExpire: '5',
    ipLimit: '10',
    // 测试发送
    testPhone: ''
})

// 表单验证规则
const rules: Record<string, RuleObject[]> = {
    provider: [{ required: true, message: '请选择短信服务商', trigger: 'change' }],
    accessKeyId: [{ required: true, message: '请输入AccessKey ID', trigger: 'blur' }],
    accessKeySecret: [{ required: true, message: '请输入AccessKey Secret', trigger: 'blur' }],
    signName: [{ required: true, message: '请输入短信签名', trigger: 'blur' }],
    loginTemplate: [{ required: true, message: '请输入登录验证码模板', trigger: 'blur' }],
    codeExpire: [{ required: true, message: '请输入验证码有效期', trigger: 'blur' }],
    ipLimit: [{ required: true, message: '请输入单IP每日上限', trigger: 'blur' }]
}

const formRef = ref()

// 保存配置
const handleSave = async () => {
    try {
        await formRef.value.validate()
        message.success('保存成功！')
        console.log('保存的配置：', formState)
    } catch (error) {
        console.error('表单验证失败：', error)
    }
}

// 重置表单
const handleReset = () => {
    formRef.value.resetFields()
    message.info('表单已重置')
}

// 发送测试验证码
const handleSendTest = () => {
    if (!formState.testPhone) {
        message.warning('请输入测试手机号')
        return
    }
    message.success(`测试验证码已发送至 ${formState.testPhone}`)
}
</script>

<template>
    <div class="sms-config-container">
        <Card title="短信服务商配置" class="config-card">
            <Form
                ref="formRef"
                :model="formState"
                :rules="rules"
                layout="horizontal"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
            >
                <FormItem label="短信服务开关">
                    <Switch
                        v-model:checked="formState.enabled"
                        checked-children="开启"
                        un-checked-children="关闭"
                    />
                </FormItem>

                <FormItem label="短信服务商" name="provider">
                    <Select v-model:value="formState.provider" style="width: 200px">
                        <SelectOption
                            v-for="option in providerOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </SelectOption>
                    </Select>
                </FormItem>

                <FormItem label="AccessKey ID" name="accessKeyId">
                    <Input v-model:value="formState.accessKeyId" placeholder="请输入AccessKey ID" />
                </FormItem>

                <FormItem label="AccessKey Secret" name="accessKeySecret">
                    <Input v-model:value="formState.accessKeySecret" placeholder="请输入AccessKey Secret" />
                </FormItem>

                <FormItem label="短信签名" name="signName">
                    <Input v-model:value="formState.signName" placeholder="请输入短信签名" />
                </FormItem>
            </Form>
        </Card>

        <Card title="模板配置" class="config-card">
            <Form
                :model="formState"
                :rules="rules"
                layout="horizontal"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
            >
                <FormItem label="登录验证码模板" name="loginTemplate">
                    <Input v-model:value="formState.loginTemplate" placeholder="请输入登录验证码模板" />
                </FormItem>

                <FormItem label="验证码有效期" name="codeExpire">
                    <Space>
                        <Input v-model:value="formState.codeExpire" placeholder="请输入验证码有效期" style="width: 100px" />
                        <span>分钟</span>
                    </Space>
                </FormItem>
                
                <FormItem :wrapper-col="{ offset: 4, span: 20 }" style="margin-top: -18px; margin-bottom: 12px;">
                    <span class="form-tip">单位：分钟</span>
                </FormItem>

                <FormItem label="单IP每日上限" name="ipLimit">
                    <Input v-model:value="formState.ipLimit" placeholder="请输入单IP每日上限" />
                </FormItem>
                
                <FormItem :wrapper-col="{ offset: 4, span: 20 }" style="margin-top: -18px; margin-bottom: 12px;">
                    <span class="form-tip">防止恶意刷短信</span>
                </FormItem>
            </Form>
        </Card>

        <Card title="测试发送" class="config-card">
            <Form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <FormItem label="测试手机号">
                    <Space>
                        <Input
                            v-model:value="formState.testPhone"
                            placeholder="请输入接收短信的手机号"
                            style="width: 300px"
                        />
                        <Button @click="handleSendTest">发送测试验证码</Button>
                    </Space>
                </FormItem>

                <FormItem :wrapper-col="{ span: 24 }">
                    <div class="form-actions">
                        <Space>
                            <Button @click="handleReset">重置</Button>
                            <Button type="primary" @click="handleSave">保存</Button>
                        </Space>
                    </div>
                </FormItem>
            </Form>
        </Card>
    </div>
</template>

<style scoped>
.sms-config-container {
    padding: 20px;
    background-color: #d9d9d9;
    min-height: 100vh;
}

.config-card {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.05);
}

.form-tip {
    font-size: 12px;
    color: #999;
}

.form-actions {
    text-align: right;
}
</style>