import { Table, Button } from 'antd'
import React from 'react'
// import usePublish from './usePublish'

export default function NewsPublish (props) {
  const dataSource = props.dataSource
  // const { handleDelete, handleOffline, handlePublish } = usePublish()
  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => <a href={`#/news-manage/preview/${item.id}`}>{title}</a>
    },
    {
      title: '作者',
      dataIndex: 'author'
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: '操作',
      dataIndex: '',
      render: (item) => {
        return <div>
          {/* 1是待发布,2是已发布,3是已下线的 */}
          {item.publishState === 1 && <Button type='primary' onClick={() => props.handlePublish(item)}>发布</Button>}
          {item.publishState === 2 && <Button type='primary' onClick={() => props.handleOffline(item)}>下线</Button>}
          {item.publishState === 3 && <Button type='primary' onClick={() => props.handleDelete(item)}>删除</Button>}
        </div>
      }
    },
  ]
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={item => item.id} pagination={{ pageSize: 5 }} />
    </div>
  )
}
