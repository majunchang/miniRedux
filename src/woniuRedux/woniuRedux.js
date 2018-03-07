
export function createStore (reducer) {
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
