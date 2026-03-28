<script setup lang="ts">
import { reactive, ref } from 'vue'
import {
    Card,
    Form,
    FormItem,
    Input,
    InputPassword,
    Select,
    SelectOption,
    Switch,
    Button,
    Space,
    message
} from 'ant-design-vue'

// 加密方式选项
const encryptionOptions = [
    { label: 'SSL', value: 'SSL' },
    { label: 'TLS', value: 'TLS' },
    { label: '无', value: 'NONE' }
]

// 表单数据
const formState = reactive({
    // 邮件服务开关
    enabled: true,
    smtpServer: 'smtp.163.com',
    smtpPort: '465',
    encryption: 'SSL',
    // 账号认证
    senderEmail: 'system@163.com',
    authCode: 'abcdef1234567890',
    senderName: '编码规则引擎系统',
    // 邮件发送测试
    testEmail: ''
})

// 表单验证规则
const rules = {
    smtpServer: [{ required: true, message: '请输入SMTP服务器', trigger: 'blur' }],
    smtpPort: [{ required: true, message: '请输入SMTP端口', trigger: 'blur' }],
    senderEmail: [
        { required: true, message: '请输入发件人邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
    ],
    authCode: [{ required: true, message: '请输入授权码/密码', trigger: 'blur' }],
    senderName: [{ required: true, message: '请输入发件人名称', trigger: 'blur' }]
}

const formRef = ref()

// 保存配置
const handleSave = async () => {
    try {
        await formRef.value.validate()
        message.success('邮件配置保存成功！')
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

// 发送测试邮件
const handleSendTest = () => {
    if (!formState.testEmail) {
        message.warning('请输入测试接收邮箱')
        return
    }
    message.success(`测试邮件已发送至 ${formState.testEmail}`)
}
</script>

<template>
    <div class="email-config-container">
        <Card title="邮件服务" class="config-card">
            <Form
                ref="formRef"
                :model="formState"
                :rules="rules"
                layout="horizontal"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
            >
                <FormItem label="邮件服务开关">
                    <Switch
                        v-model:checked="formState.enabled"
                        checked-children="开启"
                        un-checked-children="关闭"
                    />
                </FormItem>

                <FormItem label="SMTP服务器" name="smtpServer">
                    <Input v-model:value="formState.smtpServer" placeholder="请输入SMTP服务器地址" />
                </FormItem>

                <FormItem label="SMTP端口" name="smtpPort">
                    <Input v-model:value="formState.smtpPort" placeholder="请输入SMTP端口" />
                </FormItem>

                <FormItem label="加密方式">
                    <Select v-model:value="formState.encryption" style="width: 200px">
                        <SelectOption
                            v-for="option in encryptionOptions"
                            :key="option.value"
                            :value="option.value"
                        >
                            {{ option.label }}
                        </SelectOption>
                    </Select>
                </FormItem>
            </Form>
        </Card>

        <Card title="账号认证" class="config-card">
            <Form
                :model="formState"
                :rules="rules"
                layout="horizontal"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
            >
                <FormItem label="发件人邮箱" name="senderEmail">
                    <Input v-model:value="formState.senderEmail" placeholder="请输入发件人邮箱" />
                </FormItem>

                <FormItem label="授权码" name="authCode">
                    <InputPassword
                        v-model:value="formState.authCode"
                        placeholder="请输入授权码或密码"
                    />
                </FormItem>

                <FormItem :wrapper-col="{ offset: 4, span: 20 }" style="margin-top: -18px; margin-bottom: 12px;">
                    <span class="form-tip">使用SMTP时请填写授权码，而非登录密码</span>
                </FormItem>

                <FormItem label="发件人名称" name="senderName">
                    <Input v-model:value="formState.senderName" placeholder="请输入发件人名称" />
                </FormItem>
            </Form>
        </Card>

        <Card title="邮件发送测试" class="config-card">
            <Form layout="horizontal" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
                <FormItem label="测试接收邮箱">
                    <Space>
                        <Input
                            v-model:value="formState.testEmail"
                            placeholder="请输入测试邮箱"
                            style="width: 300px"
                        />
                        <Button @click="handleSendTest">发送测试邮件</Button>
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
.email-config-container {
    padding: 20px;
    background-color: #d9d9d9;
    min-height: 100vh;
}

.config-card {
    margin-bottom: 20px;
    background-color: #fff;
    border-radius: 4px;
}

.form-tip {
    font-size: 12px;
    color: #999;
}

.form-actions {
    text-align: right;
}
</style>
