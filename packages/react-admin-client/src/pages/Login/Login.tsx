import React,{useState} from 'react';
import {Form, Input, Checkbox, Button} from 'antd';
import {LockOutlined, UserOutlined} from '@ant-design/icons';
import styles from './Login.module.less';
import {reqLogin} from '../../api/login';

const Login = () => {
    const [loading,setLoading] = useState(false);

    const onFinish = (values: any) => {
        console.log('Received values of form: ', values);
        // 登录完成后 发送请求 调用接口获取用户信息
        setLoading(true);
        reqLogin(values)
        .then((res)=>{
            console.log(res);
        })
        .catch((error)=>{
            console.dir(error);
        })
        // login(username, password)
        //   .then((data) => {
        //     message.success("登录成功");
        //     handleUserInfo(data.token);
        //   })
        //   .catch((error) => {
        //     setLoading(false);
        //     message.error(error);
        //   });
    };

    return (
        <div className={styles.loginBox}>
            <Form
                name="login"
                className={styles.loginForm}
                initialValues={{username: 'admin',password:'12345',remember:false}}
                onFinish={onFinish}
            >
                <Form.Item
                    name="username"
                    rules={[{required: true, message: '请输入你的用户名!'}]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" rev={undefined} />}
                        placeholder="用户名"
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{required: true, message: '请输入你的密码!'}]}
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
        </div>
    );
};

export default Login;
