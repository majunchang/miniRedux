
const ADD_GUN = '加AWM'
const REMOVE_GUN = '减AWM'
// 这就是reducer处理函数，参数是状态和新的action
export function counter (state = 0, action) {
  // let state = state||0
  switch (action.type) {
    case ADD_GUN:
      return state + 1
    case REMOVE_GUN:
      return state - 1
    default:
      return 10
  }
}
export function addGun () {
  return { type: ADD_GUN }
}
export function removeGun () {
  return { type: REMOVE_GUN }
}
// 延迟添加，拖两天再给
export function addGunAsync () {
  // thunk插件的作用，这里可以返回函数，
  return dispatch => {
    setTimeout(() => {
      // 异步结束后，手动执行dispatch
      dispatch(addGun())
    }, 2000)
  }
}

export function addMore () {
  return [{ type: ADD_GUN }, { type: ADD_GUN }, addGunAsync()]
}
