// 已发布
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published () {
  const { dataSource, handleOffline } = usePublish(2)

  return (
    <div>
      <NewsPublish dataSource={dataSource} handleOffline={handleOffline}></NewsPublish>
    </div>
  )
}
