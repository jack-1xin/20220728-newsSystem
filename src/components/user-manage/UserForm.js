import React, { forwardRef, useState, useEffect } from 'react'
import { Form, Input, Select } from 'antd'
const UserForm = forwardRef((props, ref) => {

  // 是否禁用
  const [isDisabled, setIsDisabled] = useState(false)

  const { roleId, region } = JSON.parse(localStorage.getItem("token"));
  // 监听更新用户时是否禁用区域选择框,超级管理员时需要禁用的状态
  // 当接收的属性发生改变时,区域选择框的禁用状态发生响应的改变
  useEffect(() => {
    setIsDisabled(props.isUpdateDisabled)
  }, [props.isUpdateDisabled])
  //定义一个角色的映射表
  const roleObj = {
    1: "superAdmin",
    2: "admin",
    3: "editor"
  };
  // 处理当前角色可以创建或更新哪个区域的用户
  const checkRegionDisabled = (item) => {
    // 如果是更新用户信息状态时
    if (props.isUpdate) {
      if (roleObj[roleId] === 'superAdmin') {
        //如果是超级管理员,则拥有所有的权限
        return false;
      } else {
        //如果是区域管理员或者区域编辑则不能也不需要修改区域
        return true;
      }
    } else {
      if (roleObj[roleId] === 'superAdmin') {
        //如果是超级管理员,则可以创建任何区域的用户
        return false
      } else {
        //如果是区域管理员则只能创建自己区域的用户
        return item.value !== region
      }
    }
  }

  //处理当前角色可以创建或更新用户的角色
  const checkRoleDisabled = (item) => {
    if (props.isUpdate) {
      //更新用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则可以创建任意角色
        return false;
      } else {
        //如果是区域管理员或者区域编辑则不能也不需要更改角色
        return true;
      }
    } else {
      //创建用户时
      if (roleObj[roleId] === "superAdmin") {
        //如果是超级管理员,则可以创建任何等级的角色
        return false;
      } else {
        //如果是区域管理员则只能创建自己区域的区域编辑
        return roleObj[item.id] !== 'editor'
      }
    }
  }
  return (
    <Form
      ref={ref}
      layout='vertical'
    >
      <Form.Item
        label="用户名"
        name="username"
        rules={[
          {
            required: true,
            message: '请填写用户名!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请填写密码!',
          },
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        label="区域"
        name="region"
        rules={isDisabled ? [] : [
          { required: true, message: '请选择区域!' },
        ]}
      >
        <Select disabled={isDisabled}>
          {
            props.regionsList.map(item => {
              return <Select.Option value={item.value} key={item.id} disabled={checkRegionDisabled(item)}>{item.title}</Select.Option>
            })
          }
        </Select>
      </Form.Item>

      <Form.Item
        label="角色"
        name="roleId"
        rules={[
          {
            required: true,
            message: '请选择角色!',
          },
        ]}
      >
        <Select onChange={(value) => {
          // 设置超级管理员禁用
          if (value === 1) {
            setIsDisabled(true)
            // 重新置空
            ref.current.setFieldsValue({
              region: ""
            })
          } else {
            setIsDisabled(false)
          }
        }}>
          {
            props.roleList.map(item => {
              return <Select.Option value={item.id} key={item.id} disabled={checkRoleDisabled(item)}>{item.roleName}</Select.Option>
            })
          }
        </Select>
      </Form.Item>
    </Form>
  )
})
export default UserForm