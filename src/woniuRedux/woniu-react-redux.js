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
//  双箭头函数的写法
export const connect = (mapStateToProps = state => state, mapDispatchToProps = {}) => (wrapComponent) => {
    return class ConnectCompnent extends React.Component {
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
            this.update()
        }

        update() {
            //  context中  包含从provieder组件里面 传递的store
            const {store} = this.context;
            //  这个mapStateToProps 本身就是一个箭头函数
            const stateProps = mapStateToProps(store.getState());

        }

        render() {
            return <wrapComponent {...this.state.props}></wrapComponent>
        }
    }


}

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
