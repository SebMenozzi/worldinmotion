import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import MenuUI from './MenuUI.jsx'

export default class NavigationUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openNavigation: false,
            openMenu: false
        };

        this.toggleMenu = this.toggleMenu.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        document.addEventListener('mousemove', this.onMouseMove)
    }

    onMouseMove(e) {
        e.preventDefault()
        if (e.clientX < '120'){
            this.setState({openNavigation: true});
        } else if(e.clientX > '120'){
            this.setState({openNavigation: false});
        }
    }

    toggleMenu() {
        this.setState({ openMenu: !this.state.openMenu });
    }
    render() {
        return (
            <div>
                <MenuUI show={this.state.openMenu} />
                <div className="menu-left-button">
                    <div className="hamburger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div className={this.state.openNavigation ? "navigation show" : "navigation"}>
                    <ul>
                        <li><icon className="ion-ios-ionic-outline"></icon></li>
                        <li><icon className="ion-ios-search" onClick={this.toggleMenu}></icon></li>
                        <li><icon className="ion-ios-gear-outline"></icon></li>
                        <li><icon className="ion-ios-help-outline"></icon></li>
                    </ul>
                </div>
            </div>
        );
    }
}
ReactDOM.render(<NavigationUI />, document.getElementById('Navigation'));
