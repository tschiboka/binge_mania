import React, { Component } from "react";
import "./UserMenu.scss";



export default class UserMenu extends Component {
    render() {
        return (
            <div
                id="User-menu"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}
                tabIndex={0}
            >
                <ul className="User-menu__list">
                    <li className="User-menu__list__item" id="User-menu__new-user">New User</li>

                    <li className="User-menu__list__item" id="User-menu__sign-in">Sign In</li>

                    <li className="User-menu__list__item" id="User-menu__sign-out">Sign Out</li>
                </ul>
            </div>
        );
    }
}