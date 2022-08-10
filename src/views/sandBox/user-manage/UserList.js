/* 
  用户列表组件,属于用户管理模块下的二级路由组件
*/
import React, { useEffect, useRef, useState } from 'react'
import { Table, Button, Switch, Modal } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import UserForm from '../../../components/user-manage/UserForm'
const { confirm } = Modal
export default function UserList () {
  //用户列表状态
  const [userList, setUserList] = useState([])
  //区域列表状态
  const [regionsList, setRegionsList] = useState([])
  //角色列表状态
  const [roleList, setRoleList] = useState([]);
  //保存添加用户的状态
  const [current, setCurrent] = useState()
  //添加用户的模态框显示状态
  const [isAddVisible, setIsAddVisible] = useState(false)
  //更新用户的模态框显示状态
  const [isUpdateVisible, setIsUpdateVisible] = useState(false)
  //设置父子通信禁用select框的状态
  const [isUpdateDisabled, setIsUpdateDisabled] = useState(false)
  //创建添加用户表单的ref
  const addForm = useRef(null);
  // 创建更新用户表单的ref
  const updateForm = useRef(null)
  // 获取登录用户的数据
  const { roleId, region, username, id: { UserId } } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    const roleObj = {
      "1": "superadmin",
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/users?_expand=role`).then(res => {
      const list = res.data
      list.map(item => {
        if (item.id === UserId) {
          item.default = true
        }
        return item
      })
      setUserList(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[item.roleId] === "editor")
      ])
    })
  }, [roleId, region, username, UserId])
  useEffect(() => {
    axios.get(`/regions`).then(res => {
      setRegionsList(res.data)
    })
  }, [])
  useEffect(() => {
    axios.get(`/roles`).then(res => {
      // console.log(res.data);
      setRoleList(res.data)
    })
  }, [])
  // 添加用户的方法
  const handleOk = () => {
    addForm.current.validateFields().then(value => {
      //隐藏添加用户的表单
      setIsAddVisible(false)
      //清空表单中的残留数据
      addForm.current.resetFields();
      // 先post到后端，生成id，在设置userList,方便后面的删除与更新
      axios.post(`/users`, {
        ...value,
        "roleState": true,
        "default": false,
      }).then(res => {
        // 前端数据同步
        setUserList([...userList, {
          ...res.data,
          role: roleList.filter(item => item.id === value.roleId)[0]
        }])
      })
    })
      .catch(err => {
        console.log(err);
      })
  }
  // 删除用户的按钮回调
  const handleDelete = (item) => {
    console.log(item);
    confirm({
      title: `您确定要删除${item.username}`,
      icon: <ExclamationCircleOutlined />,
      // 确定
      onOk () {
        deleteMethod(item)
      },
      // 取消
      onCancel () {
        console.log('cancel');
      }
    })
  }
  // 删除用户的方法
  const deleteMethod = (item) => {
    console.log(item);
    setUserList(userList.filter(data => data.id !== item.id))
    axios.delete(`/users/${item.id}`)
  }

  // 定义点击更改用户状态按钮的回调(修改roleState的值)
  const handleChangeSwitch = (item) => {
    console.log(item);
    item.roleState = !item.roleState
    setUserList([...userList])
    // 发请求更改用户状态
    axios.patch(`/users/${item.id}`, {
      roleState: item.roleState
    })
  }
  // 定义更新用户的模态框数据
  const handleUpdate = (item) => {
    // 使用异步的方式同步显示
    setTimeout(() => {
      setIsUpdateVisible(true)
      if (item.roleId === 1) {
        //禁用
        setIsUpdateDisabled(true)
      } else {
        // 取消禁用
        setIsUpdateDisabled(false)
      }
      updateForm.current.setFieldsValue({
        username: item.username,
        password: item.password,
        region: item.region,
        roleId: item.roleId
      })
    }, 0);
    setCurrent(item)
  }
  // 更新用户的方法
  const updateFormOk = () => {
    updateForm.current.validateFields().then(value => {
      //隐藏添加用户的表单
      setIsUpdateVisible(false)
      // 更新前端数据
      setUserList(userList.map(item => {
        if (item.id === current.id) {
          return {
            ...item,
            ...value,
            role: roleList.filter(data => data.id === value.roleId)[0]
          }
        }
        return item
      }))
      setIsUpdateDisabled(!isUpdateDisabled)
      // 发请求
      axios.patch(`/users/${current.id}`, { ...value })
    })
      .catch(err => {
        console.log(err);
      })
  }


  //定义Table表格的列
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      key: 'region',
      render: (region) => <b>{region === "" ? "全球" : region}</b>,
      filters: [
        ...regionsList.map(item => ({
          text: item.title,
          value: item.value
        })),
        {
          text: '全球',
          value: '全球'
        }
      ],
      onFilter: (value, item) => {
        if (value === '全球') {
          return item.region === ''
        } else {
          return item.region === value
        }
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      key: 'role',
      render: (role) => <span>{role?.roleName}</span>
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      key: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={() => handleChangeSwitch(item)}></Switch>
    },
    {
      title: '操作',
      dataIndex: '',
      render: (data) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} disabled={data.default} onClick={() => handleDelete(data)} ></Button>

          <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={data.default} onClick={() => handleUpdate(data)}></Button>
        </div>
      },
    },
  ]
  return (
    <div>
      {/* 通过控制isAddVisible的true值来让Modal组件显示与否 */}
      <Button type='primary' onClick={() => {
        setIsAddVisible(true)
      }}>添加用户</Button>
      <Table dataSource={userList} columns={columns} pagination={{ pageSize: 4 }} rowKey={(item) => item.id} />
      {/* 添加用户的表单 */}
      <Modal
        title="添加用户信息"
        visible={isAddVisible}
        onOk={handleOk}
        onCancel={() => {
          setIsAddVisible(false)
        }}
        cancelText="取消"
        okText="保存" >
        <UserForm regionsList={regionsList} roleList={roleList} ref={addForm}></UserForm>
      </Modal>
      {/* 更新用户表单 */}
      <Modal
        title="更新用户信息"
        visible={isUpdateVisible}
        onOk={() => updateFormOk()}
        onCancel={() => {
          setIsUpdateVisible(false)
          setIsUpdateDisabled(!isUpdateDisabled)
        }}
        cancelText="取消"
        okText="更新" >
        <UserForm regionsList={regionsList} roleList={roleList} ref={updateForm} isUpdateDisabled={isUpdateDisabled} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
