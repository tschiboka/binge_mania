import React, { Component } from 'react';

import "./LoadingSpinner.scss";

export default class LoadingSpinner extends Component {
    render() {
        return (
            this.props.isLoading
                ? <div className="LoadingSpinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
                : <div></div>
        );
    }
}