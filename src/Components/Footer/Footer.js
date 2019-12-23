import React, { Component } from 'react';

import "./Footer.scss";

import logo from "../../images/tmdb-logo.png";

export default class Footer extends Component {
    render() {
        return (
            <div className="Footer">
                <div className="Attribution-logo"></div>
                <label>This product uses the TMDb API but is not endorsed or certified by TMDb.</label>
            </div>
        )
    }
}