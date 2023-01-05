import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, message } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import './index.css'

const Login = () => {
    const navigate = useNavigate();
    const onFinish = (values) => {
        accountModel.login(values.username, values.password).then(()=>{
            setTimeout(function () {
                if (sessionStorage.getItem('islogin') == 'true') {
                    navigate('/GDUT-nft')
                }
            },100)
        })
    };
    const register = () => {
        navigate('/register');
    }

    return (
        <div className="wrapper">
        <Form
            name="normal_login"
            className="login-form"
            initialValues={{
            remember: true,
            }}
            onFinish={onFinish}
        >
            <div className="header">GDUT-NFT</div>
            <Form.Item
            name="username"
            rules={[
                {
                required: true,
                message: "请输入用户名!",
                },
            ]}
            >
            <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="Username"
            />
            </Form.Item>
            <Form.Item
            name="password"
            rules={[
                {
                required: true,
                message: "请输入密码!",
                },
            ]}
            >
            <Input
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
            />
            </Form.Item>
            <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>记住我</Checkbox>
            </Form.Item>
            </Form.Item>

            <Form.Item>
            <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
            >
                登录
            </Button>
            <Button
                type="link"
                htmlType="button"
                onClick={register}
                style={{marginLeft:'100px'}}>
            注册
            </Button>
            </Form.Item>
        </Form>
        </div>
    );
    };

export default Login;
