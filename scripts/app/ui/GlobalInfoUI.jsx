import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import axios from 'axios';
import Helpers from '../utils/Helpers'
import {SolarCalculator} from '../utils/SolarCalculator'

export default class GlobalInfoUI extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryName: null,
            countryFlag: null,
            utcOffset: null,
            time: null,
            sunrise: null,
            sunset: null,
            temperature: null,
        };
        this.getCountryFromLatAndLon();
        this.getWeatherFromLatAndLon();
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.getCountryFromLatAndLon();
        this.getWeatherFromLatAndLon();
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        if(this.state.utcOffset) {
            this.setState({
                time: Helpers.getDateFormattedFromTimezone(new Date(), this.state.utcOffset)
            });
        }
    }

    getCountryFromLatAndLon() {
        var key = 'U39LJEIGJLPH';
        axios.get(`http://api.timezonedb.com/v2/get-time-zone?key=${key}&format=json&by=position&lat=${parseFloat(this.props.lat)}&lng=${parseFloat(this.props.lon)}`)
            .then((response) => {
                if (response.data.countryName) {
                    var utcOffset = Math.floor(response.data.gmtOffset / 3600);
                    var sunData = SolarCalculator(new Date(), utcOffset, this.props.lat, this.props.lon);

                    this.setState({countryName: response.data.countryName})
                    this.setState({countryFlag: './assets/img/flags/' + response.data.countryCode.toLowerCase() + '.png'})
                    this.setState({time: 'Loading...'})
                    this.setState({utcOffset: utcOffset})
                    this.setState({sunrise: Helpers.getDateFormatted(sunData.sunrise)})
                    this.setState({sunset: Helpers.getDateFormatted(sunData.sunset)})
                }
            })
            .catch(function (error) {
                this.setState({countryName: null})
            });
    }

    getWeatherFromLatAndLon() {
        var apiKey = 'ff73a7d6576d8756f65850da8b44db72'; // provided by openweathermap
        axios.get(`http://api.openweathermap.org/data/2.5/weather?units=metric&lat=${parseFloat(this.props.lat)}&lon=${parseFloat(this.props.lon)}&appid=${apiKey}`)
            .then((response) => {
                if (response.data) {
                    this.setState({temperature: response.data.main.temp})
                }
            });
    }

    render() {
        return (
            <div className="container">
                <div className="infoBox">
                    <p className="coordinates">{Helpers.decimalAdjust('round', this.props.lat, -3) } °, {Helpers.decimalAdjust('round', this.props.lon, -3) } °</p>
                    <p className="temperature">{this.state.temperature} ° C</p>
                </div>

                <div className="countryBox" style={{display: (this.state.countryName) ? 'block' : 'none'}}>
                    <img className="flag" width={250} height={150} src={this.state.countryFlag} />
                    <h2 className="name">{this.state.countryName}</h2>
                    <p className="time">{this.state.time}</p>
                    <p className="time">☀️ {this.state.sunrise}</p>
                    <p className="time">🌙 {this.state.sunset}</p>
                </div>
            </div>
        );
    }
}

export const UpdatePosition = (lat, lon) => {
    ReactDOM.render(<GlobalInfoUI lat={lat} lon={lon} />, document.getElementById('GlobalInfo'));
}
