/* 
  审核列表组件,属于审核管理模块下的二级路由组件,审核状态auditState不为0的新闻会出现在此组件中
  publishState:0(草稿箱)||1(待发布)||2(已发布)||3(已下线)
*/

import { Button, Table, Tag, notification, Modal } from 'antd'
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
const { confirm } = Modal;
export default function AuditList (props) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))
  // 获取审核列表的集合
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username])
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => {
        return <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category.title
    },
    {
      title: '审核状态',
      dataIndex: 'auditState',
      key: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["草稿箱", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },

    {
      title: '操作',
      dataIndex: '',
      render: (item) => {
        return <div>
          {item.auditState === 1 && <Button onClick={() => handleRervert(item)}>撤销</Button>}
          {item.auditState === 2 && <Button danger onClick={() => handlePublish(item)}>发布</Button>}
          {item.auditState === 3 && <Button type='primary' onClick={() => handleUpdate(item)}>更新</Button>}
        </div>
      }
    },
  ]
  // 撤销的按钮的回调
  const handleRervert = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState: 0
    }).then(res => {
      // props.history.push("/audit-manage/list")
      notification.info({
        message: `通知`,
        description:
          `您可以到草稿箱中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  // 更新的按钮的回调
  const handleUpdate = (item) => {
    props.history.push(`/news-manage/update/${item.id}`)
  }

  // 点击发布的按钮回调
  const handlePublish = (item) => {
    confirm({
      title: '您确定要发布此新闻吗?',
      icon: <ExclamationCircleOutlined />,
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk () {
        axios.patch(`/news/${item.id}`, {
          publishState: 2,
          publishTime: Date.now()
        }).then(res => {
          props.history.push("/publish-manage/published")
          notification.info({
            message: `通知`,
            description:
              `您可以到【发布管理/已发布】中查看您的新闻`,
            placement: 'bottomRight',
          });
        })
      },
      onCancel () {
        console.log('Cancel');
      },
    });
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
