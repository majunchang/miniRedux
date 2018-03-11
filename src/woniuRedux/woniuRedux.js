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