import React, { useState } from 'react';
import axios from 'axios';
import { Form, Input, message, Button, Spin } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import styles from './Login.module.less';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        // 登录完成后 发送请求 调用接口获取用户信息
        setLoading(true);
        axios.post('api/user/login', values)
            .then((res) => {
                message.success("登录成功");
                const token = res.headers.authorization;
                localStorage.setItem('baiyi-admin-system-token', token);
                navigate('/');
            }).catch((error) => {
                console.dir(error);
                setLoading(false);
                message.error(error.message);
            });
    };

    return (
        <div className={styles.loginBox}>
            <div className={styles.loginFormBox}>
                <Spin size="large" spinning={loading}>
                    <Form
                        name="login"
                        initialValues={{ username: 'admin', password: '12345' }}
                        onFinish={onFinish}
                    >
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: '请输入你的用户名!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" rev={undefined} />}
                                placeholder="用户名"
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[{ required: true, message: '请输入你的密码!' }]}
                        >
                            <Input
                                prefix={<LockOutlined rev={undefined} />}
                                type="password"
                                placeholder="密码"
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className={styles.loginButton}>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Spin>
            </div>
        </div>
    );
};

export default Login;
