import React, { Component } from "react";
import "./UserMenu.scss";



export default class UserMenu extends Component {
    constructor(props) {
        super(props);

        this.userMenu = null;
        this.state = {
            signInVisible: true,
            signInFormVisible: false,
            signOutVisible: true,
            signInUserNameWarning: "",
            signInPasswordWarning: "",
            wrongUserOrPasswordMsg: false
        }
    }



    componentDidUpdate() { this.userMenu.focus(); }



    handleUserMenuOnBlur() { if (!this.state.signInFormVisible) this.props.blur(); }



    handleSignInClick() {
        const newState = this.state;
        newState.signInFormVisible = !newState.signInFormVisible;
        this.setState(newState);
        console.log(this.state.signInFormVisible)
    }



    handleSignInSubmit(event) {
        const newState = Object.assign({}, this.state);
        event.preventDefault();

        const userName = document.getElementById("User-menu__signin__username").value;
        const password = document.getElementById("User-menu__signin__password").value;

        if (userName.length === 0) newState.signInUserNameWarning = "username must be filled out";
        if (password.length === 0) newState.signInPasswordWarning = "password must be filled out";

        if (userName.length < 3) newState.signInUserNameWarning = "username is at least 3 char";
        if (password.length < 8) newState.signInPasswordWarning = "password is at least 8 char";

        if (userName.length > 20) newState.signInUserNameWarning = "username is max 20 char";
        if (password.length > 20) newState.signInPasswordWarning = "password is max 20 char";

        if (newState.signInUserNameWarning || newState.signInPasswordWarning) return this.setState(newState);

        const signInUser = async () => {
            try {
                const response = await fetch("/api/signin/" + userName,
                    { method: "POST", body: JSON.stringify({ "password": password }), headers: { 'Content-type': 'application/json' } });
                const user = await response.text();

                if (user) {
                    this.props.login(user);
                    newState.signInFormVisible = false;
                    //newState.signInVisible = false;
                    this.setState(newState);
                }
                else {
                    newState.wrongUserOrPasswordMsg = true;
                    this.setState(newState);
                }
            } catch (err) { console.log(err); }
        }

        signInUser();
    }



    //handleSignOutClick() {
    //    this.setState(Object.assign({}, { ...this.state, signInFormVisible: true }));
    //    this.props.logout();
    //}



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

                    {this.state.signInVisible &&
                        <li
                            className="User-menu__list__item"
                            id="User-menu__sign-in"
                            onClick={() => this.handleSignInClick()}
                        >Sign In
                    </li>}
                    {this.state.signInFormVisible &&
                        <form onSubmit={e => this.handleSignInSubmit(e)}>
                            <div>User Name</div>

                            {this.state.wrongUserOrPasswordMsg && <div>Wrong Username or Password</div>}

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
                        </form>}
                    {this.state.signOutVisible &&
                        <li
                            className="User-menu__list__item"
                            id="User-menu__sign-out"
                            onClick={() => this.handleSignOutClick()}
                        >Sign Out</li>}
                </ul>
            </div>
        );
    }
}