import React, { Component } from "react";
import "./UserMenu.scss";
import NewUser from "../NewUser/NewUser";



export default class UserMenu extends Component {
    constructor(props) {
        super(props);

        this.userMenu = null;
        this.state = {}
    }



    componentDidUpdate() { this.userMenu.focus(); }



    handleUserMenuOnBlur() { this.props.blur(); }



    handleSignInClick() {
        const newState = this.state;
        newState.signInFormVisible = !newState.signInFormVisible;
        this.setState(newState);
        console.log(this.state.signInFormVisible);
    }



    render() {
        return (
            <div
                id="User-menu"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}
                onBlur={() => this.handleUserMenuOnBlur()}
                tabIndex={0}
                ref={elem => (this.userMenu = elem)} // give focus in order to be able to call onBlur
            >
                <ul className="User-menu__list">
                    <li className="User-menu__list__item" id="User-menu__new-user">New User</li>

                    <li
                        className="User-menu__list__item"
                        id="User-menu__sign-in"
                        onClick={() => this.handleSignInClick()}
                    >Sign In</li>

                    {localStorage.binge_mania__currentUser && <li className="User-menu__list__item" id="User-menu__sign-out">Sign Out</li>}
                </ul>
            </div>
        );
    }
}