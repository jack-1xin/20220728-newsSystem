import React from 'react'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons'
import { Layout, Dropdown, Menu, Avatar } from 'antd';
import { withRouter } from 'react-router-dom';
// 第一步
import { connect } from 'react-redux'

const { Header } = Layout
function TopHeader (props) {
  const { role: { roleName }, username } = JSON.parse(localStorage.getItem('token'))


  const menu = (
    <Menu>
      <Menu.Item key='1'>{roleName}</Menu.Item>
      <Menu.Item key='2' danger onClick={() => {
        // 清除token
        localStorage.removeItem('token')
        // 将路由跳转替换至login
        props.history.replace('/login')
      }}>退出</Menu.Item>
    </Menu>
  )
  const changeCollapsed = () => {
    //第六步: 改变state的isCollapsed
    props.changeCollapsed() // 调用mapDispatchToProps此时的dispatch帮助我们分发action到reducer中
  }

  return (
    <Header className="site-layout-background" style={{ padding: '0 16px' }}>
      {/* 第四步: 获取到props中的state状态 */}
      {
        props.isCollapsed ? <MenuUnfoldOutlined onClick={changeCollapsed} /> : <MenuFoldOutlined onClick={changeCollapsed} />
      }

      <div style={{ position: 'absolute', right: '10px', top: '3px' }}>
        <span>欢迎<span style={{ color: '#1890ff' }}>{username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size='large' icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
/* 
  connect(
  //mapStateToProps 把我们redux中的状态映射成属性 可以使用 props.xxx调用
  //mapDispatchToProps 把dispatch方法映射成一个props
  )(被包装的组件)
*/
// 第三步参数state中可以解构出对应的小分支
// 可以往connect中扔一个属性叫 
const mapStateToProps = ({ CollApsedReducer: { isCollapsed } }) => {
  return {
    isCollapsed
  }
}
//第五步: 把dispatch方法映射成一个props  替我们组件内部的方法dispatch分发一个action出去
const mapDispatchToProps = {
  changeCollapsed () {
    return {
      type: 'change_collapsd',
      // payload:
    }// type就是reducer中的action
  }
}
// 第二步:
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TopHeader))