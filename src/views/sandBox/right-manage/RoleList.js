/* 
  角色列表组件,属于权限管理模块下的二级路由组件
  该系统总共分为三种角色:超级管理员、区域管理员、区域编辑
  1. 使用currentRights去匹配rightList树形结构中应该被勾选的部分，
  2. 使用setCurrentRights可以去更改权限，
  3. 然后通过当前的currentRights来控制roleList中角色的权限
*/

import React, { useEffect, useState } from 'react'
import { Button, Table, Modal, Tree } from 'antd'
import { UnorderedListOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import axios from 'axios'
const { confirm } = Modal;

export default function RoleList () {
  //Table表格数据(角色列表)
  const [roleList, setRoleList] = useState([])
  //Tree树形控件的数据(权限列表)
  const [rightList, setRightList] = useState([]);
  //当前角色的权限列表
  const [currentRights, setCurrentRights] = useState([]);
  //点击的当前角色的ID
  const [currentId, setCurrentId] = useState();
  //模态框是否显示状态
  const [isModalVisible, setIsModalVisible] = useState(false)
  // 获取角色列表数据
  useEffect(() => {
    axios.get('/roles').then(res => {
      console.log(res.data);
      setRoleList(res.data)
    })
  }, [])
  // 获取左侧菜单栏的数据
  useEffect(() => {
    axios.get(`/rights?_embed=children`).then(res => {
      console.log(res.data);
      setRightList(res.data)
    })
  }, [])
  // 点击删除按钮弹出对话框的回调
  const confirmMethod = (item) => {
    confirm({
      title: `您确定要删除${item.roleName}?`,
      icon: <ExclamationCircleOutlined />,
      onOk () {
        deleteMethod(item)
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }
  const deleteMethod = (item) => {
    console.log(item);
  }
  // 点击编辑角色权限按钮弹出对话框的回调
  const showModal = (item) => {
    setIsModalVisible(true);
    setCurrentRights(item.rights)
    setCurrentId(item.id)
  };
  //点击模态框Modal中确认按钮的回调,隐藏模态框,且同步当前角色的权限列表数据(前后端)
  const handleOk = () => {
    setIsModalVisible(false);
    //前端数据同步 roleList
    setRoleList(roleList.map(item => {
      // 匹配当前点击的角色id
      if (item.id === currentId) {
        return {
          ...item,
          rights: currentRights
        }
      }
      return item
    }))
    console.log(roleList);
    // 向后端发请求更新数据
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
  };
  //点击模态框Modal中取消按钮的回调,隐藏模态框
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  //当点击树形控件中复选框的回调,将当前角色最新的权限列表保存到状态中,便于后面的数据同步
  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked)
  };
  //定义Table表格的列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      dataIndex: '',
      render: (item) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => confirmMethod(item)}></Button>
          <Button type='primary' shape='circle' icon={<UnorderedListOutlined />} onClick={() => showModal(item)}></Button>
        </div>
      }
    },
  ];
  return (
    <>
      <Table dataSource={roleList} columns={columns} rowKey={(item) => item.id} />
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} cancelText="取消" okText="保存" >
        <Tree
          checkable
          checkStrictly
          checkedKeys={currentRights}
          treeData={rightList}
          onCheck={onCheck}
        />
      </Modal>
    </>

  )
}
