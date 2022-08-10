/* 
  权限列表组件,属于权限管理模块下的二级路由组件
  根据当前的item.pagepermisson来控制组件的显示与否
*/
import React, { useEffect, useState } from 'react'
import { Table, Tag, Button, Modal, Popover, Switch } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
const { confirm } = Modal;


export default function RightList () {
  //保存Table表格的数据(权限列表数据)
  const [dataSource, setDataSource] = useState([])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(res => {
      const list = res.data
      // 将没有children的数组赋值为字符串
      list.forEach(item => {
        if (item.children.length === 0) {
          item.children = ""
        }
      })
      setDataSource(list)
    })
  }, [])


  //定义点击删除权限按钮的回调
  const onConfirm = (data) => {
    confirm({
      title: `您确定要删除${data.title}?`,
      icon: <ExclamationCircleOutlined />,
      content: `权限路径${data.key}`,
      onOk () {
        deleteMethod(data)
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }
  // 
  const deleteMethod = (item) => {
    console.log(item);
    // 当前页面同步状态+后端同步
    //处理一级导航项
    if (item.grade === 1) {
      //删除前端数据,更新页面
      setDataSource(dataSource.filter(data => data.id !== item.id))
      //删除后台数据,同步数据
      // axios.delete(`/rights/${item.id}`)
    } else {  //处理子导航项
      /* 
        删除前端数据
        1.查找子导航项的父级导航
        2.通过父级导航过滤掉要删除的子导航
      */
      let list = dataSource.filter(data => data.id === item.rightId)
      list[0].children = list[0].children.filter(data => data.id !== item.id)
      setDataSource([...dataSource]);
      //删除后台数据
      // axios.delete(`/children/${item.id}`)
    }
  }

  const switchMethod = (item) => {
    //前端数据同步
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    // 更新dataSource的数据
    setDataSource([...dataSource])

    //修改后台数据
    if (item.grade === 1) {//处理一级导航项
      axios.patch(`/rights/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    } else {//处理二级导航项
      axios.patch(`/children/${item.id}`, {
        pagepermisson: item.pagepermisson
      })
    }
  }
  //定义Table表格的列
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => <Tag color="success">{key}</Tag>
    },
    {
      title: '操作',
      dataIndex: '',
      render: (data) => {
        return <div>
          <Button danger shape='circle' icon={<DeleteOutlined />} onClick={() => onConfirm(data)}></Button>
          <Popover content={
            <div style={{ textAlign: 'center' }}>
              <Switch checked={data.pagepermisson} onChange={() => switchMethod(data)} ></Switch>
            </div>
          } title="页面配置项" trigger={data.pagepermisson === undefined ? "" : "click"}>
            <Button type='primary' shape='circle' icon={<EditOutlined />} disabled={data.pagepermisson === undefined}></Button>
          </Popover>
        </div>
      },
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 4 }} />
    </div>
  )
}
