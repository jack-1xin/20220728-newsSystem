// combineReducers 合并reducer

import { legacy_createStore as createStore, combineReducers } from "redux";
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { CollApsedReducer } from './reducers/CollapsedReducer'
import { LoadingReducer } from "./reducers/LoadingReducer";
// 创建一个配置
const persistConfig = {
  key: 'root', // 存在localStorage中的key值
  storage, // 要存在localStorage中
  blacklist: ["LoadingReducer"], //blacklist黑名单 不被持久化
  whitelist: ["CollApsedReducer"]  //whitelist白名单 会被持久化
}
// 合并所有的reducer
const reducer = combineReducers({
  CollApsedReducer,
  LoadingReducer
})
// persistReducer 按照这个配置将我们的reducer做一个持久化
const persistedReducer = persistReducer(persistConfig, reducer)

const store = createStore(persistedReducer)
const persistor = persistStore(store)
export { store, persistor }


/* 
store.dispatch() 分发到reducer中,reducer进行处理,接收老状态,返回一个新状态

在某个组件中通过 store.subsribe() 监听的回调函数就会被触发 --- 订阅与发布

*/