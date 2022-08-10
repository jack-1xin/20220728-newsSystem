import { Button, Table, notification } from 'antd'
import React, { useEffect, useState } from 'react'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'
import axios from 'axios'
export default function Audit (props) {
  const [dataSource, setDataSource] = useState([])
  const { username, roleId, region } = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    const roleObj = {
      "1": 'superadmin',
      "2": "admin",
      "3": "editor"
    }
    axios.get(`/news?auditState=1&_expand=category`).then(res => {
      const list = res.data
      setDataSource(roleObj[roleId] === 'superadmin' ? list : [
        ...list.filter(item => item.username === username),
        ...list.filter(item => item.region === region && roleObj[roleId] === 'editor')
      ])
    })
  }, [region, roleId, username])
  const handleCheck = (item, auditState, publishState) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      auditState,
      publishState
    }).then(res => {
      // props.history.push("/audit-manage/list")
      notification.info({
        message: `通知`,
        description:
          `您可以到审核列表中查看您的新闻的审核状态`,
        placement: 'bottomRight',
      });
    })
  }
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: "author"
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' shape="circle" icon={<CheckOutlined />} onClick={() => handleCheck(item, 2, 1)}></Button>
          <Button danger shape="circle" icon={<CloseOutlined />} onClick={() => handleCheck(item, 3, 0)}></Button>
        </div>
      }
    }
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} rowKey={(item) => item.id} />
    </div>
  )
}
