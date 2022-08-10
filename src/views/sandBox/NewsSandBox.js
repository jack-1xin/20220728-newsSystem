import React, { useEffect } from 'react'
import { Layout } from 'antd'
import SideMenu from '../../components/sandBox/SideMenu'
import TopHeader from '../../components/sandBox/TopHeader'
import './NewsSandBox.css'
import NewsRouter from '../../components/sandBox/NewsRouter'
// 进度条
import NProgress from 'nprogress'
import "nprogress/nprogress.css"
const { Content } = Layout
export default function NewsSandBox () {
  NProgress.start()
  useEffect(() => {
    NProgress.done()
  })
  return (
    <Layout>
      <SideMenu></SideMenu>
      <Layout className="site-layout">
        <TopHeader></TopHeader>
        <Content className="site-layout-background" style={{ margin: '24px 16px', padding: 24, minHeight: 280, overflow: 'auto' }}>
          <NewsRouter ></NewsRouter>
        </Content>
      </Layout>
    </Layout >
  )
}
