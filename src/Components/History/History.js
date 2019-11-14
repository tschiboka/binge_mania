import React, { Component } from 'react';
import "./History.scss";


export default class History extends Component {
    render() {
        return (
            <div className="History">
                <div className="History__main--outer">
                    <div className="History__main--inner">
                        <div className="History__title--outer">
                            <div className="History__title--inner">
                                <div className="History__title--base">
                                    <div className="History__title">
                                        User History
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="History__btn-box--outer">
                            <div className="History__btn-box--middle">
                                <div className="History__btn-box--inner">
                                    <div className="History__btn-box__btn-base">
                                        <button onClick={() => this.props.closeHistory(false)}>&times;</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}