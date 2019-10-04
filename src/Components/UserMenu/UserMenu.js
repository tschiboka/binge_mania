import React, { Component } from "react";
import "./UserMenu.scss";
import NewUser from "../NewUser/NewUser";



export default class UserMenu extends Component {
    constructor(props) {
        super(props);

        this.userMenu = null;
        this.state = {
            signInFormVisible: false,
            signInUserNameWarning: "",
            signInPasswordWarning: ""
        }
        console.log(this.state.signInFormVisible);
    }



    componentDidUpdate() { this.userMenu.focus(); }



    handleUserMenuOnBlur() {
        console.log("Sholud blur " + this.state.userMenuBluring);
        if (!this.state.signInFormVisible) this.props.blur();
    }



    handleSignInClick() {
        const newState = this.state;
        newState.signInFormVisible = !newState.signInFormVisible;
        this.setState(newState);
        console.log(this.state.signInFormVisible)
    }



    handleSignInSubmit(event) {
        const newState = this.state;
        event.preventDefault();

        const userName = document.getElementById("User-menu__signin__username").value;
        const password = document.getElementById("User-menu__signin__password").value;
        console.log(userName, password);

        if (userName.length === 0) newState.signInUserNameWarning = "username must be filled out";
        if (password.length === 0) newState.signInPasswordWarning = "password must be filled out";

        if (newState.signInUserNameWarning || newState.signInPasswordWarning) return this.setState(newState);
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
                    {
                        this.state.signInFormVisible &&
                        <form onSubmit={e => this.handleSignInSubmit(e)}>
                            <div>User Name</div>

                            {this.state.signInUserNameWarning && <div>{this.state.signInUserNameWarning}</div>}

                            <div>
                                <input
                                    type="text"
                                    id="User-menu__signin__username"
                                />
                            </div>

                            <div>Password</div>

                            {this.state.signInPasswordWarning && <div>{this.state.signInPasswordWarning}</div>}

                            <div>
                                <input
                                    type="password"
                                    id="User-menu__signin__password"
                                />
                            </div>

                            <div><button>Sign In</button></div>
                        </form>
                    }
                    {localStorage.binge_mania__currentUser && <li className="User-menu__list__item" id="User-menu__sign-out">Sign Out</li>}
                </ul>
            </div>
        );
    }
}