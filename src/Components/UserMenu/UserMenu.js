import React, { Component } from "react";
import "./UserMenu.scss";



export default class UserMenu extends Component {
    constructor(props) {
        super(props);

        this.userMenu = null;
        this.state = {
            signInVisible: true,
            signInFormVisible: false,
            signOutVisible: false,
            signIn__userNameWarning: "",
            signIn__passwordWarning: "",
            newUser__userNameWarning: "",
            newUser__passwordWarning: "",
            newUser__emailWarning: "",
            wrongUserOrPasswordMsg: false,
            userExist: false
        }
    }



    componentDidUpdate() { this.userMenu.focus(); }



    handleUserMenuOnBlur() { if (!this.state.signInFormVisible && !this.state.newUserFormVisible) this.props.blur(); }



    handleSignInClick() { this.setState({ ...this.state, signInFormVisible: !this.state.signInFormVisible }); }



    handleNewUserSubmit(event) {
        const newState = { ...this.state };
        event.preventDefault();

        const userName = document.getElementById("User-menu__newuser__username").value;
        const password = document.getElementById("User-menu__newuser__password").value;
        const email = document.getElementById("User-menu__newuser__email").value;

        // in case user hits enter and state input errors are not updated by onBlur on inputs
        if (userName.length < 3) newState.newUser__userNameWarning = "Username is min 3 char long";
        if (!userName) newState.newUser__userNameWarning = "Username must not be empty";
        if (userName.length > 20) newState.newUser__userNameWarning = "Username max 20 char long";

        if (password.length < 8) newState.newUser__passwordWarning = "Password is min 8 char long";
        if (!password) newState.newUser__passwordWarning = "Password must not be empty";
        if (password.length > 20) newState.newUser__passwordWarning = "Password max 20 char long";

        if (!/(.+)@(.+){2,}\.(.+){2,}/.test(email)) newState.newUser__emailWarning = "Invalid email";

        if (newState.newUser__userNameWarning || newState.newUser__passwordWarning || newState.newUser__emailWarning) return this.setState(newState);

        const addNewUser = async () => {
            try {
                console.log("HERE");
                const response = await fetch("/api/users",
                    {
                        method: "POST",
                        body: JSON.stringify({ "email": email, name: userName, password: password }),
                        headers: { 'Content-type': 'application/json' }
                    });
                const user = await response.text();

                if (user === "USER EXISTS") return this.setState({ ...this.state, userExist: true });

                if (user) {
                    this.props.login(user);
                    newState.newUserFormVisible = false;
                    newState.signInVisible = false;
                    newState.signOutVisible = true;
                    this.setState(newState);
                }

                console.log(user);
            } catch (err) { console.log(err); }
        }

        addNewUser();
    }



    handleSignInSubmit(event) {
        const newState = { ...this.state };
        event.preventDefault();

        const userName = document.getElementById("User-menu__signin__username").value;
        const password = document.getElementById("User-menu__signin__password").value;

        // in case user hits enter and state input errors are not updated by onBlur on inputs
        if (userName.length < 3) newState.signIn__userNameWarning = "Username is min 3 char long";
        if (!userName) newState.signIn__userNameWarning = "Username must not be empty";
        if (userName.length > 20) newState.signIn__userNameWarning = "Username max 20 char long";

        if (password.length < 8) newState.signIn__passwordWarning = "Password is min 8 char long";
        if (!password) newState.signIn__passwordWarning = "Password must not be empty";
        if (password.length > 20) newState.signIn__passwordWarning = "Password max 20 char long";

        if (newState.signIn__userNameWarning || newState.signIn__passwordWarning) return this.setState(newState);

        const signInUser = async () => {
            try {
                const response = await fetch("/api/signin/" + userName,
                    { method: "POST", body: JSON.stringify({ "password": password }), headers: { 'Content-type': 'application/json' } });
                const user = await response.text();

                console.log("USER : ", user);
                if (user) {
                    this.props.login(user);
                    newState.signInFormVisible = false;
                    newState.signInVisible = false;
                    newState.signOutVisible = true;
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



    handleSignOutClick() {
        this.setState({ ...this.state, signInVisible: true, signOutVisible: false });
        this.props.logout();
    }



    handleNewUserClick() { this.setState({ ...this.state, newUserFormVisible: !this.state.newUserFormVisible }); }



    validateSignInUserName() {
        const userName = document.getElementById("User-menu__signin__username").value;
        let msg = "";

        if (userName.length < 3) msg = "Username is min 3 char long";
        if (userName.length === 0) msg = "Username must not be empty";
        if (userName.length > 20) msg = "Username max 20 char long";

        this.setState({ ...this.state, signIn__userNameWarning: msg });
    }



    validateSignInPassword() {
        const userName = document.getElementById("User-menu__signin__password").value;
        let msg = "";

        if (userName.length < 8) msg = "Password is min 8 char long";
        if (userName.length === 0) msg = "Password must not be empty";
        if (userName.length > 20) msg = "Password max 20 char long";

        this.setState({ ...this.state, signIn__passwordWarning: msg });
    }



    validateNewUserUserName() {
        const userName = document.getElementById("User-menu__newuser__username").value;
        let msg = "";

        if (userName.length < 3) msg = "Username is min 3 char long";
        if (userName.length === 0) msg = "Username must not be empty";
        if (userName.length > 20) msg = "Username max 20 char long";

        this.setState({ ...this.state, newUser__userNameWarning: msg });
    }



    validateNewUserPassword() {
        const userName = document.getElementById("User-menu__newuser__password").value;
        let msg = "";

        if (userName.length < 8) msg = "Password is min 8 char long";
        if (userName.length === 0) msg = "Password must not be empty";
        if (userName.length > 20) msg = "Password max 20 char long";

        this.setState({ ...this.state, newUser__passwordWarning: msg });
    }



    validateNewUserEmail() {
        const email = document.getElementById("User-menu__newuser__email").value;
        const msg = !/(.+)@(.+){2,}\.(.+){2,}/.test(email) ? "Invalid email" : "";

        this.setState({ ...this.state, newUser__emailWarning: msg });
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
                    {this.props.user && <li className="username">{this.props.user.name}</li>}

                    <li
                        className="User-menu__list__item"
                        id="User-menu__new-user"
                        onClick={() => this.handleNewUserClick()}
                    >New User</li>

                    {this.state.newUserFormVisible &&
                        <li>
                            <form onSubmit={e => this.handleNewUserSubmit(e)}>
                                <div>User Name</div>

                                {this.state.newUser__userNameWarning && <div className="warning">{this.state.newUser__userNameWarning}</div>}

                                <div><input type="text" id="User-menu__newuser__username" onBlur={() => this.validateNewUserUserName()} /></div>

                                <div>Email</div>

                                {this.state.newUser__emailWarning && <div className="warning">{this.state.newUser__emailWarning}</div>}

                                <div><input type="email" id="User-menu__newuser__email" onBlur={() => this.validateNewUserEmail()} /></div>

                                <div>Password</div>

                                {this.state.newUser__passwordWarning && <div className="warning">{this.state.newUser__passwordWarning}</div>}

                                <div><input type="password" id="User-menu__newuser__password" onBlur={() => this.validateNewUserPassword()} /></div>

                                {this.state.userExist && <div className="warning">User exists on this email</div>}

                                <div><button>Create User</button></div>
                            </form>
                        </li>}

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

                            {this.state.signIn__userNameWarning && <div className="warning">{this.state.signIn__userNameWarning}</div>}

                            <div><input type="text" id="User-menu__signin__username" onBlur={() => this.validateSignInUserName()} /></div>

                            <div>Password</div>

                            {this.state.signIn__passwordWarning && <div className="warning">{this.state.signIn__passwordWarning}</div>}

                            <div><input type="password" id="User-menu__signin__password" onBlur={() => this.validateSignInPassword()} /></div>

                            {this.state.wrongUserOrPasswordMsg && <div className="warning">Wrong Username or Password</div>}

                            <div><button>Sign In</button></div>
                        </form>}

                    {this.props.user.isAdmin && <li onClick={() => this.props.showAdmin(true)}>Admin</li>}

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