import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import ReactCanvasNest from 'react-canvas-nest'
import axios from 'axios'
import './Login.css'


export default function Login (props) {

  //提交表单的回调
  const onFinish = (values) => {
    console.log(values);
    const { username, password } = values
    //发送ajax请求校验登录信息
    axios.get(`/users?username=${username}&password=${password}&roleState=true&_expand=role`).then(res => {
      console.log(res.data);
      if (res.data.length === 0) {
        message.error("用户名、密码不匹配或用户已被禁用");
      } else {
        //将用户的相关信息存储到localStorage中
        localStorage.setItem('token', JSON.stringify(res.data[0]))
        //跳转到后台页面
        props.history.push(`/home`)
      }
    })
  };
  return (
    <div className='login-container'>
      <ReactCanvasNest
        className='canvasNest'
        config={{
          pointColor: ' 255, 255, 255 ',
          lineColor: '255,255,255',
          pointOpacity: 0.5,
          pointR: 2,
          count: 100
        }}
        style={{ zIndex: 1 }}
      />

      <div className='card-container'>
        <div className="login-title">全球新闻发布管理系统</div>
        <Form
          name="normal_login"
          className="login-form"
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: '请填写用户名!',
              },
            ]}
          >
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="用户名" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: '请填写密码!',
              },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登录
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
