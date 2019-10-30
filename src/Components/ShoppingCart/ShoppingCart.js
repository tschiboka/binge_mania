import React, { Component } from 'react';
import "./ShoppingCart.scss";

export default class ShoppingCart extends Component {
    render() {
        return (
            <div
                id="ShoppingCart"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}
            >SHOPPINGCART</div>
        );
    }
}