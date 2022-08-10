import React from 'react'
import { Provider } from 'react-redux' // 供应商组件
import IndexRouter from './router/IndexRouter'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import './App.css'
function App () {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <IndexRouter></IndexRouter>
      </PersistGate>
    </Provider>

  )
}
export default App