import React, { useEffect, useState } from 'react'
import { PageHeader, Descriptions, Divider, message } from 'antd'
import axios from 'axios'
import moment from 'moment'
import { HeartTwoTone } from '@ant-design/icons'
export default function Detail (props) {
  // console.log(props);
  const [detailList, setDetailList] = useState(null)
  const [msg, setmsg] = useState(false)
  const { id } = props.match.params
  useEffect(() => {
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(res => {
      setDetailList({
        ...res.data,
        view: res.data.view + 1
      });
      // 同步后端
      return res.data
    }).then(res => {
      axios.patch(`/news/${id}?_expand=category&_expand=role`, {
        view: res.view + 1
      })
    })
  }, [id])
  // 点赞的回调
  const handleStar = () => {
    if (msg) {
      return message.error('已经点过赞了')
    }
    setDetailList({
      ...detailList,
      star: detailList.star + 1
    })
    axios.patch(`/news/${id}?_expand=category&_expand=role`, {
      star: detailList.star + 1
    })
    setmsg(true)
    return message.success('点赞成功')
  }
  return (
    <>
      {
        detailList && <div>
          <PageHeader
            ghost={false}
            onBack={() => window.history.back()}
            title={detailList.title}
            subTitle={<div>{detailList.category.title} <HeartTwoTone twoToneColor="#eb2f96" onClick={() => handleStar()} /></div>}
          >
            <Descriptions size="small" column={3}>
              <Descriptions.Item label="创建者">{detailList.author}</Descriptions.Item>
              <Descriptions.Item label="发布时间">{detailList.publishTime
                ? moment(detailList.publishTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</Descriptions.Item>
              <Descriptions.Item label="区域">{detailList.region}</Descriptions.Item>
              <Descriptions.Item label="访问数量"><span style={{ color: '#52c41a' }}>{detailList.view}</span></Descriptions.Item>
              <Descriptions.Item label="点赞数量"><span style={{ color: '#52c41a' }}>{detailList.star}</span></Descriptions.Item>
              <Descriptions.Item label="评论数量"><span style={{ color: '#52c41a' }}>0</span></Descriptions.Item>
            </Descriptions>
            <Divider plain></Divider>
          </PageHeader>

          <div dangerouslySetInnerHTML={{
            __html: detailList.content
          }} style={{ margin: '0px 24px' }}>
          </div>
        </div>
      }
    </>
  )
}
