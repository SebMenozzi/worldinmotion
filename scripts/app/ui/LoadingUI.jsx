import React, { Component } from 'react'
import ReactDOM from 'react-dom';

export default class LoadingUI extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="screen" style={{ display: (this.props.pourcentage < 100) ? 'block' : 'none' }}>
                <div className="loading">
                    <div className="loading-ring-css"><div></div></div>
                </div>
            </div>
        );
    }
}

export const UpdatePourcentage = (pourcentage) => {
    ReactDOM.render(<LoadingUI pourcentage={pourcentage} />, document.getElementById('LoadingScreen'));
}
