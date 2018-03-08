import React from 'react'
import PropTypes from 'prop-types'
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
export const connect = (mapStateToProps=state=>state,mapDispatchToProps={})=>{

}

export class Provider extends React.Component {
   static childContextTypes = {
      store: PropTypes.object
   }
  getChildContext () {
    return {store: this.store}
  }
  constructor (props, context) {
    super(props, context)
    //  把外部传来的props中的store  挂载到this.store上面
    this.store = props.store
  }
  render () {
    // this.props.children 属性。它表示组件的所有子节点
    // this.props.children 的值有三种可能：如果当前组件没有子节点，它就是 undefined ;
    // 如果有一个子节点，数据类型是 object ；
    // 如果有多个子节点，数据类型就是 array。
    return this.props.children
  }
}
