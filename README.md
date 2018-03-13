> 本文主要介绍redux的react-redux的原理 
## redux原理
### github地址：https://github.com/majunchang/miniRedux
###  原生react的调用和常用方法 

- redux中有一个reducer函数和action 通过dispatch(action)来触发reducer的对应的case
- 提供一个createStore方法 传入reducer 返回的对象中包含getState和subscribe和dispatch方法
#### 调用示例：

```javascript
import { createStore } from './woniuRedux/woniuRedux'

// 这就是reducer处理函数，参数是状态和新的action
export  function counter (state = 0, action) {
  // let state = state||0
  console.log(action)
  console.log(state)
  switch (action.type) {
    case '加机关枪':
      return state + 1
    case '减机关枪':
      return state - 1
    default:
      return 10
  }
}
// 新建保险箱
const store = createStore(counter)
// console.log
const init = store.getState()
console.log(`一开始有机枪${init}把`)
function listener () {
  const current = store.getState()
  console.log(`现在有机枪${current}把`)
}
// 订阅，每次state修改，都会执行listener
store.subscribe(listener)
// 提交状态变更的申请
store.dispatch({ type: '加机关枪' })
store.dispatch({ type: '加机关枪' })
store.dispatch({ type: '加机关枪' })
store.dispatch({ type: '减机关枪' })
store.dispatch({ type: '减机关枪' })

```
#### redux原理（简易版）
- 主要逻辑createStore 是一个js的发布订阅模式
- bindActionCreator是react提供的供react-redux使用的方法
```javascript
export function createStore(reducer) {
    let currentState = {}
    let currentListeners = []

    function getState() {
        return currentState
    }

    function subscribe(listener) {
        currentListeners.push(listener)
    }

    function dispatch(action) {
        currentState = reducer(currentState, action)
        currentListeners.forEach(v => {
            v()
        })
        return action
    }

    //  初次调用的时候 首先执行一次 dispatch
    dispatch({type: '@@redux/firstTime'})

    return {getState, subscribe, dispatch}
}

//  工具函数  这个函数的作用是为了让creator函数里面的参数进行透传
/*
    addGun(参数)
    dispatch(addGun(参数))
 */
function bindActionCreator(creator,dispatch) {
    return (...args) => dispatch(creator(...args))
}

//  bindActionCreators
//   {addGun, removeGun, addGunAsync}  就是形式参数 creators
export function bindActionCreators(creators, dispatch) {
    let bound = {}
    Object.keys(creators).forEach((fnKey, index) => {
        let creator = creators[fnKey]
        bound[fnKey] = bindActionCreator(creator,dispatch)
    })
    return bound
    /*
    还可以采用另外一种写法
     return Object.keys(creators).reduce((ret,item)=>{
       ret[item] = bindActionCreator(creators[item],dispatch)
        return ret
    },{})
     */
}
```

## react-redux的原理
- 提供一个Provider组件 负责吧外层的数据 传递给所有的子组件
- connect方法（高阶组件） 负责将props和dispatch的方法 传递给子组件  
> 废话不多说 直接上代码

### 调用方法
> 我们将createStore生成的store  传入App这个组件 

```
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

ReactDOM.render(
  (
    <Provider store={store}>
      <App />
      {/* <Page /> */}
    </Provider>
  ),
  document.getElementById('root'))

```
> connect的用法 以及 装饰器写法

```js
import React from 'react'
import { connect } from './woniuRedux/woniu-react-redux'
// import { connect } from 'react-redux'
import { addGun, removeGun, addGunAsync,addMore } from './index.redux'
// import './01.learn.redux'

// 装饰器模式
@connect(
  state => ({num: state}),
  {addGun, removeGun, addGunAsync,addMore},
)

//  react链接redux的 原生模式
// App = connect(
//   state => ({num: state}),
//   {addGun, removeGun, addGunAsync}
// )
class App extends React.Component {
  render () {
    console.log(this.props)
    // num addGun，removeGun，addGunAsync都是connect给的，不需要手动dispatch
    return (
      <div>
        <h1>我是用来测试miniredux的案例 </h1>
        <h2>现在有机枪{this.props.num}把</h2>
        <button onClick={this.props.addGun}>申请武器</button>
        <button onClick={this.props.removeGun}>上交武器</button>
        <button onClick={this.props.addGunAsync}>拖两天再给</button>
        <button onClick={this.props.addMore}>多个操作</button>
      </div>
    )
  }
}

export default App

```


### 原理实现
#### Provieder组件  
> 使用的 context 做的数据传递，避免了层层传递 提高了效率 代码中有示例demo
```js
import React from 'react'
import PropTypes from 'prop-types'
export class Provider extends React.Component {
    static childContextTypes = {
        store: PropTypes.object
    }

    getChildContext() {
        return {store: this.store}
    }

    constructor(props, context) {
        super(props, context)
        //  把外部传来的props中的store  挂载到this.store上面
        this.store = props.store
    }

    render() {
        // this.props.children 属性。它表示组件的所有子节点
        // this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;
        // 如果有一个子节点，数据类型是 object ；
        // 如果有多个子节点，数据类型就是 array。
        return this.props.children
    }
}

```

#### connect高阶组件  
> 实际上 connect有四个参数 这里简易版 我们只处理前两个  

```js
import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from './woniuRedux'
//  context 是全局的 组件里声明  所有子元素可以直接获取
//  connect 负责链接组件   将redux里的数据 放在组件的属性里
// Provider  吧store放到context  所有的子元素 可以渠道store


//  connect
//  1 负责接受一个组件  把state里面的一些数据放进去 返回一个组件
//  2 数据变化的时候 能够通知组件 
// state=>state
// function(state){
//   return state
// }
// function  写connect  
// export function connect(mapStateToProps,mapDispatchToProps){
//   return function(wrapComponent){
//     return class connectComponent extends React.Component{

//     }
//   }
// }
//  双箭头函数的写法
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (WrapComponent) => {
    return class ConnectCompnent extends React.Component {
        //  这一步为了获取从外部传入的store
        static contextTypes = {
            store: PropTypes.object
        }

        constructor(props, context) {
            super(props, context)
            this.state = {
                props: {}
            }
        }

        componentDidMount() {
            // 当数据有所改动的时候 同样调用update方法
            const {store} = this.context
            store.subscribe(() => this.update())
            this.update()
        }

        update() {
            //  context中  包含从provieder组件里面 传递的store
            const {store} = this.context;
            //  这个mapStateToProps 本身就是一个箭头函数
            const stateProps = mapStateToProps(store.getState());
            /*
                在解析dispatch的时候
                1  方法不能直接给 需要dispatch 才会有效  直接执行 addGun() 毫无意义
                  function addGun () {
                    return { type: ADD_GUN }
                  }
                2 addGun = ()=> store.dispatch(addGun())  就是用dispatch把actioncreator包裹一层
             */
            const dispatchProps = bindActionCreators(mapDispatchToProps, store.dispatch)

            // 调用setState方法 会触发render函数
            this.setState({
                props: {
                    //  遇到同名的key值得时候  后面的会覆盖前面的 所以我们把 外部传入的 放在后面
                    ...this.state.props,
                    ...stateProps,
                    ...dispatchProps
                }
            })
        }

        render() {
            return <WrapComponent {...this.state.props}></WrapComponent>
        }
    }

```

####  中间件机制

#####  调用方法 

```js
//  测试woniu-react-redux的Provieder组件
const store = createStore(counter, applyMiddleware(thunk, arrThunk))
```

####  原理实现 

> #####  首先在createStore中 加一层判断 如果有enhancer这个参数 直接跳转到下一个
![](http://oneg19f80.bkt.clouddn.com/18-3-13/56443250.jpg)


> #####  中间件的具体实现原理

```js
//  中间件机制
export function applyMiddleware (...middlewares) {
  //  这里的...args指的是reducer
  return createStore => (...args) => {
    //  const store = createStore(counter)
    const store = createStore(...args)
    let dispatch = store.dispatch
    let midApi = {
      getState: store.getState,
      dispatch: (...args) => dispatch(...args)
    }
    //  单个中间件的情况
    // dispatch = middleware(midApi)(store.dispatch)
    // dispatch = middware(midApi)(stroe.dispatch)(action)
    // 多个中间件的情况
    console.log(middlewares)
    let middlewareChain = middlewares.map(middleware => middleware(midApi))
    dispatch = compose(...middlewareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

function compose (...fns) {
  if (fns.length === 0) {
    return args => args
  }
  if (fns.length === 1) {
    return fns[0]
  }
  return fns.reduce((ret, item) => (...args) => ret(item(...args)))
}
```


####  中间件原理 

> 这里以thunk（函数格式）和arrthunk（数组格式）举例


```js
// // 延迟添加，拖两天再给
// export function addGunAsync () {
//   // thunk插件的作用，这里可以返回函数，
//   return dispatch => {
//     setTimeout(() => {
//       // 异步结束后，手动执行dispatch
//       dispatch(addGun())
//     }, 2000)
//   }
// }

const thunk = ({dispatch, getState}) => next => action => {
  if (typeof action === 'function') {
    //  如上面所示
    return action(dispatch, getState)
  }
  //  默认情况下
  return next(action)
}

export default thunk
```


```js
const ArrThunk = ({dispatch, getState}) => next => action => {
  if (Array.isArray(action)) {
    //  如上面所示
    return action.forEach(v => dispatch(v))
  }
  //  默认情况下  next  就是dispatch下一个中间件
  return next(action)
}

export default ArrThunk

```




