// 已下线

import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'

export default function Published () {
  const { dataSource, handleDelete } = usePublish(3)

  return (
    <div>
      <NewsPublish dataSource={dataSource} handleDelete={handleDelete}></NewsPublish>
    </div>
  )
}
