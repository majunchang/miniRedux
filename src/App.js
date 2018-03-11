import React from 'react'
import { connect } from './woniuRedux/woniu-react-redux'
// import { connect } from 'react-redux'
import { addGun, removeGun, addGunAsync } from './index.redux'
// import './01.learn.redux'

// 装饰器模式
@connect(
  state=>({ num: state}),
  {addGun, removeGun, addGunAsync}
)

//  react链接redux的 原生模式
// App = connect(
//   state => ({num: state}),
//   {addGun, removeGun, addGunAsync}
// )
class App extends React.Component {
  render () {
      console.log(this.props);
    // num addGun，removeGun，addGunAsync都是connect给的，不需要手动dispatch
    return (
      <div>
        <h1>我是用来测试miniredux的案例 </h1>
        <h2>现在有机枪{this.props.num}把</h2>
        <button onClick={this.props.addGun}>申请武器</button>
        <button onClick={this.props.removeGun}>上交武器</button>
        <button onClick={this.props.addGunAsync}>拖两天再给</button>
      </div>
    )
  }
}
export default App
