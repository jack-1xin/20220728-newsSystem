// preState 老的状态
export const CollApsedReducer = (preState = {
  isCollapsed: false
}, action) => {
  const { type } = action
  // 需要将老的状态进行深拷贝
  const newState = { ...preState }
  switch (type) {
    case 'change_collapsd':
      // 更改状态返回新的状态出去
      newState.isCollapsed = !newState.isCollapsed
      return newState
    default:
      return preState
  }
}