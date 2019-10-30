import React, { Component } from 'react';
import "./ShoppingCart.scss";

export default class ShoppingCart extends Component {
    render() {
        return (
            <div
                id="ShoppingCart"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}
            >
                <div className="ShoppingCart__movies">
                    {(this.props.movies && this.props.movies.length)
                        ? this.props.movies.map((m, i) =>
                            <div
                                key={"ShoppingCartMovies" + i}
                                className="ShoppingCart__movie"
                            >
                                <div className="ShoppingCart__title">
                                    {m.title}
                                </div>
                                <div className="ShoppingCart__price">
                                    $1.29
                                </div>
                            </div>)
                        : "Shopping Cart Is Empty..."}
                </div>
            </div>
        );
    }
}