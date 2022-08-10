import React, { useEffect, useState } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import axios from 'axios'
import Home from '../../views/sandBox/home/Home'
import UserList from '../../views/sandBox/user-manage/UserList'
import RightList from '../../views/sandBox/right-manage/RightList'
import RoleList from '../../views/sandBox/right-manage/RoleList'
import Nopermission from '../../views/sandBox/nopermission/Nopermission'
import NewsAdd from '../../views/sandBox/news-manage/NewsAdd'
import NewsPreview from '../../views/sandBox/news-manage/NewsPreview'
import NewsDraft from '../../views/sandBox/news-manage/NewsDraft'
import NewsUpdate from '../../views/sandBox/news-manage/NewsUpdate'
import NewsCategory from '../../views/sandBox/news-manage/NewsCategory'
import Audit from '../../views/sandBox/audit-manage/Audit'
import AuditList from '../../views/sandBox/audit-manage/AuditList'
import Unpublished from '../../views/sandBox/publish-manage/Unpublished'
import Published from '../../views/sandBox/publish-manage/Published'
import Sunset from '../../views/sandBox/publish-manage/Sunset'
import { Spin } from 'antd'
import { connect } from 'react-redux'

//创建本地路由映射表
const LocalRouterMap = {
  "/home": Home,
  "/user-manage/list": UserList,
  "/right-manage/role/list": RoleList,
  "/right-manage/right/list": RightList,
  "/news-manage/add": NewsAdd,
  "/news-manage/draft": NewsDraft,
  "/news-manage/category": NewsCategory,
  "/news-manage/preview/:id": NewsPreview,
  "/news-manage/update/:id": NewsUpdate,
  "/audit-manage/audit": Audit,
  "/audit-manage/list": AuditList,
  "/publish-manage/unpublished": Unpublished,
  "/publish-manage/published": Published,
  "/publish-manage/sunset": Sunset
}
function NewsRouter (props) {
  // console.log(props);
  const [BackRouteList, setBackRouteList] = useState([])
  useEffect(() => {
    Promise.all([
      axios.get(`/rights`),
      axios.get(`/children`)
    ]).then(res => {
      // 合并扁平化处理
      setBackRouteList([...res[0].data, ...res[1].data])
    })
  }, [])
  const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
  //检测路由是否有本地映射且当前路由是否可以展示(pagepermisson)
  const checkRoute = (item) => {
    return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
  }
  //检测路由是否存在于当前登录用户的权限列表中
  const checkUserPermission = (item) => {
    return rights.includes(item.key)
  }
  return (
    <Spin size="large" spinning={props.isLoading}>
      <Switch>
        {
          BackRouteList.map(item => {
            if (checkRoute(item) && checkUserPermission(item)) {
              return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact />
            }
            return null
          })
        }
        <Redirect from="/" to="/home/" exact />
        {
          BackRouteList.length > 0 && <Route from='*' component={Nopermission} />
        }
      </Switch>
    </Spin>
  )
}
const mapStateToProps = ({ LoadingReducer: { isLoading } }) => {
  return {
    isLoading
  }
}
export default connect(mapStateToProps)(NewsRouter)