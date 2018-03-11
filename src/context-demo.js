//  主要是 用来测试和查看  react-redux的provider和context传值的用例
import React from 'react'
import PropTypes from 'prop-types'

class SideBar extends React.Component {
    render() {
        return (
            <div>
                <p>我是侧边栏</p>
                <Nav></Nav>
            </div>
        )
    }
}

class Nav extends React.Component {

    static contextTypes = {
        user: PropTypes.string
    }

    render() {
        console.log(this.context)
        return (
            <div>
                <h1>xixi</h1>
                {this.context.user}
            </div>
        )
    }
}

class Page extends React.Component {

    static childContextTypes = {
        user: PropTypes.string
    }

    constructor(props) {
        super(props)
        this.state = {user: '蜗牛'}
    }

    getChildContext() {
        return this.state
    }

    render() {
        return (
            <div>
                <p>我是{this.state.user}</p>
                <SideBar></SideBar>
            </div>
        )
    }
}

export default Page
