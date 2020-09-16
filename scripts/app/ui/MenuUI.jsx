import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import apps from '../../../apps.json';

export default class MenuUI extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={this.props.show ? "menu show" : "menu"}>
                <div className="search-form">
                    <div className="cancel ion-ios-close-outline"></div>
                    <input type="text" placeholder="Search..." className="search-bar" />
                </div>
                {
                    apps.map((app) => {
                        return (
                            <div className="app" key={app.name}>
                                <label><img src={app.image} height={app.size} /> {app.label}</label>
                            </div>
                        )
                    })
                }
            </div>
        );
    }

}
