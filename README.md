> 本文主要介绍redux的react-redux的原理 

## redux原理

#### github地址：https://github.com/majunchang/miniRedux

[总体流程图！！！](http://oneg19f80.bkt.clouddn.com/18-3-13/85170717.jpg)

### 原生react的调用和常用方法

## react流程图展示

![](http://oneg19f80.bkt.clouddn.com/18-3-13/19179259.jpg)

- redux中有一个reducer函数和action 通过dispatch(action)来触发reducer的对应的case
- 提供一个createStore方法 传入reducer 返回的对象中包含getState和subscribe和dispatch方法

#### 调用示例：

> redux 原生版的调用  getState()获取状态  subscribe()进行监听  dispatch()触发相应的action  改变state

```javascript
import { createStore } from './woniuRedux/woniuRedux'

// 这就是reducer处理函数，参数是状态和新的action
export  function counter (state = 0, action) {
  // let state = state||0
  console.log(action)
  console.log(state)
  switch (action.type) {
    case '加苹果':
      return state + 1
    case '吃苹果':
      return state - 1
    default:
      return 10
  }
}

const store = createStore(counter)
// console.log
const init = store.getState()
console.log(`一开始有${init}个苹果`)
function listener () {
  const current = store.getState()
  console.log(`现在有${current}个苹果`)
}
// 订阅，每次state修改，都会执行listener
store.subscribe(listener)
// 提交状态变更的申请
store.dispatch({ type: '加苹果' })
store.dispatch({ type: '加苹果' })
store.dispatch({ type: '加苹果' })
store.dispatch({ type: '吃苹果' })
store.dispatch({ type: '吃苹果' })

```

## redux实现原理（源码解析）（简易版）

> 主要介绍createStore  applyMiddleware和bindActionCreators

#### caeateStore 源码解读

```js
export function createStore (reducer, enhancer) {
  if (enhancer) {
    console.log('enhancer', enhancer)      ①
    return enhancer(createStore)(reducer)

    //  return applymiddleware(thunk)(createStore)(reducer)
  }
  let currentState = {}
  let currentListeners = []

  function getState () {
    return currentState
  }

  function subscribe (listener) {
    currentListeners.push(listener)
  }

  function dispatch (action) {
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
```

1. createStore 内部是一个观察者模式， subscribe 添加注册函数  dispatch让函数自调用
2. 首次调用createStore的时候  内部会执行一次dispatch  将reducer绑定进来 
3.  enhancer 是一个组合 store creator 的高阶函数，返回一个新的强化过的 store creator。这与 middleware 相似，它也允许你通过复合函数改变 store 接口。

```js
enhancer ƒ (createStore) {
    return function () {
      var _console, _console2;

      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = argum…
```



> 普及一下高阶函数
>
> **高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件**

```js
// 高阶组件 思想
function hello() {
    console.log('我喜欢react');
}

function WrapperHello(fn) {
    return function () {
        console.log('before hello');
        fn()
        console.log('after hello');
    }
}

var hello = WrapperHello(hello);
hello()

 属性代理
class Hello extends React.Component {
    render() {
        return <h2>高阶组件的参数组件</h2>
    }
}

function wrapperHello(Comp) {
    class WrapComp extends React.Component {
        render() {
            return (<div>
                <p>这是hoc高阶组件特有的元素</p>
                <Comp  {...this.props}></Comp>
            </div>)
        }
    }
    return WrapComp
}
 反向继承
function wrapperHello(Comp) {
    class WrapComp extends Comp{
        componentDidMount(){
            console.log('高阶组件新增的生命周期，加载完成');
        }
        render(){
            return <Comp></Comp>
        }
    }
    return WrapComp
}


Hello = wrapperHello(Hello);
```

## applyMiddleware源码解读

```javascript
//  中间件机制
export function applyMiddleware (...middlewares) {
  
  return createStore => (...args) => {
    console.log(args)
    //  这里的...args指的是解耦之后的renducer   在这里 指的就是counter 
    console.log(...args)  
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
    console.log(store) //  =>  store 就是一个对象  里面包含dispatch getState和subscribe等方法
    console.log('middles', middlewares)
    let middlewareChain = middlewares.map(middleware => middleware(midApi))
       //  返回的这个dispatch  就执行过了所有的中间件  带有了中间件的功能
    dispatch = compose(...middlewareChain)(store.dispatch)
    return {
      ...store,
      dispatch
    }
  }
}

```

#### compose函数源码

```js
function compose (...fns) {
  if (fns.length === 0) {
    return args => args
  }
  if (fns.length === 1) {
    return fns[0]
  }
  // return fns.reduce((ret, item) => (...args) => ret(item(...args)))
  return fns.reduce((ret, item) => (...args) => {
    console.log('当有多个参数的时候')
    //  ...args ==>> store.dispatch的这个方法  item和ret指代不同的中间件
    /*
    //假设 
    middleChain = [a,b,c]
    dispatch = compose(...middlewareChain)(store.dispatch) = compose(a,b,c)(store.dispatch)
    // 那么这个函数在compose中 就被拆解为
    dispatch = compose(a(b(c)))(store.dispatch)
    */
    return ret(item(...args))
  })
}
```

> 结合中间件的源码来看  我们这里以thunk举例 

- thunk中最开始接受的参数 {dispatch getState} 是从midApi中传来的 


- next 指代store.dispatch  action就是action

```js
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



## bindActionCreators 源码解读

> 官网用法 ： http://www.redux.org.cn/docs/api/bindActionCreators.html

```js
//  工具函数  这个函数的作用是为了让creator函数里面的参数进行透传
/*
    addGun(参数)
    dispatch(addGun(参数))
 */
function bindActionCreator (creator, dispatch) {
  return (...args) => dispatch(creator(...args))
}

//  bindActionCreators
//   {addGun, removeGun, addGunAsync}  就是形式参数 creators
export function bindActionCreators (creators, dispatch) {
  let bound = {}
  Object.keys(creators).forEach((fnKey, index) => {
    let creator = creators[fnKey]
    bound[fnKey] = bindActionCreator(creator, dispatch)
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
> ![](http://oneg19f80.bkt.clouddn.com/18-3-13/29962321.jpg)



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





