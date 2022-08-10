// 待发布

import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published () {

  const { dataSource, handlePublish } = usePublish(1)

  return (
    <div>
      <NewsPublish dataSource={dataSource} handlePublish={handlePublish}></NewsPublish>
    </div>
  )
}
