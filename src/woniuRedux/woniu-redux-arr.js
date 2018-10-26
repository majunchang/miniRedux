const ArrThunk = ({ dispatch, getState }) => next => action => {
  if (Array.isArray(action)) {
    //  如上面所示
    return action.forEach(v => dispatch(v))
  }
  //  默认情况下  next  就是dispatch下一个中间件
  return next(action)
}

export default ArrThunk
