import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from 'antd'

function usePublish (type) {
  const [dataSource, setDataSource] = useState([])
  const { username } = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(res => {
      setDataSource(res.data)
    })
  }, [username, type])

  // 发布的按钮回调
  const handleDelete = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.delete(`/news/${item.id}`).then(res => {
      notification.info({
        message: "通知",
        description: "您已经删除了已下线的新闻",
        placement: "bottomRight"
      });
    })
  }
  // 发布的按钮回调
  const handlePublish = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 2,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已发布】中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  // 下线的按钮回调
  const handleOffline = (item) => {
    setDataSource(dataSource.filter(data => data.id !== item.id))
    axios.patch(`/news/${item.id}`, {
      publishState: 3,
      publishTime: Date.now()
    }).then(res => {
      notification.info({
        message: `通知`,
        description:
          `您可以到【发布管理/已下线】中查看您的新闻`,
        placement: 'bottomRight',
      });
    })
  }
  return {
    dataSource,
    handleDelete,
    handlePublish,
    handleOffline
  }
}

export default usePublish