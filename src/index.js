import React from 'react'
import ReactDOM from 'react-dom'
// import { createStore, applyMiddleware, compose } from 'redux'
import thunk from './woniuRedux/woniu-redux-thunk'
import arrThunk from './woniuRedux/woniu-redux-arr'

// import { counter } from './index.redux'
import {Provider} from './woniuRedux/woniu-react-redux'
import App from './App'
//
// import Page from './context-demo'
import {createStore, applyMiddleware} from './woniuRedux/woniuRedux'
import {counter} from './index.redux'

// const store = createStore(counter, compose(
//   applyMiddleware(thunk),
//   window.devToolsExtension ? window.devToolsExtension() : f => f
// ))

//  测试woniu-react-redux的Provieder组件
const store = createStore(counter, applyMiddleware(thunk, arrThunk))
console.log('index中的store', store)

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
      {/* <Page /> */}
    </Provider>
  ),
  document.getElementById('root'))
