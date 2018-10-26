import React from 'react'
import { connect } from './woniuRedux/woniu-react-redux'
// import { connect } from 'react-redux'
import { addGun, removeGun, addGunAsync, addMore } from './index.redux'
// import './01.learn.redux'

// 装饰器模式
@connect(
  state => ({ num: state }),
  { addGun, removeGun, addGunAsync, addMore },
)

//  react链接redux的 原生模式
// App = connect(
//   state => ({num: state}),
//   {addGun, removeGun, addGunAsync}
// )(App)
class App extends React.Component {
  chifan(item, event) {
    console.log(item)
    console.log(event)
    console.log(event.target)
    console.log(this.chifan)
    console.log('我要吃饭了')
  }
  render() {
    console.log(this.props)
    // num addGun，removeGun，addGunAsync都是connect给的，不需要手动dispatch
    return (
      <div>
        <h1>测试miniredux </h1>
        <h2 > 现在有AWM狙击步枪{this.props.num} 把 </h2>
        <button onClick={this.props.addGun} > 捡到空投 </button>
        <button onClick={this.props.removeGun} > 丢掉AWM </button>
        <button onClick={this.props.addGunAsync} > 刷了毒圈再丢（测试异步的函数）</button>
        <button onClick={this.props.addMore} > 高级空投，两把AWM </button>
      </div>
    )
  }
}

export default App
