export function createStore (reducer, enhancer) {
  if (enhancer) {
    console.log('enhancer', enhancer)
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
//  中间件机制
export function applyMiddleware (...middlewares) {
  return createStore => (...args) => {
    const store = createStore(...args)
    let dispatch = store.dispatch
    let midApi = {
      getState: store.getState,
      dispatch: (action) => dispatch(action)
    }
    //  单个中间件的情况
    // dispatch = middleware(midApi)(store.dispatch)
    // dispatch = middware(midApi)(stroe.dispatch)(action)
    // 多个中间件的情况
    console.log(store) //  =>  store 就是一个对象  里面包含dispatch getState和subscribe等方法
    console.log('middles', middlewares)
    let middlewareChain = middlewares.map(middleware => middleware(midApi))
    console.log('查看middlewareschain是什么东西')
    console.log(middlewareChain)
    console.log(...middlewareChain)
    dispatch = compose(...middlewareChain)(store.dispatch)
    console.log('查看dispatch', dispatch)
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
  // return fns.reduce((ret, item) => (...args) => ret(item(...args)))
  return fns.reduce((ret, item) => (...args) => {
    console.log('当有多个参数的时候')
    //  ...args ==>> store.dispatch的这个方法
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
