import React, { Component } from "react";

export default class UserMenu extends Component {
    render() {
        return (
            <div
                id="User-menu"
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