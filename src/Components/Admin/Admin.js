import React, { Component } from "react";

import "./Admin.scss";

import Admin__users from "../Admin__users/Admin__users";



export default class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTag: "users"
        };
    }

    checkAdmin() {
        // By changing Apps showAdmin prop in React dev tool, Admin copmonent is available.
        // Ask authorisation of current user despite of cost of performace
        new Promise(async (resolve, reject) => {
            if (!this.props.user._id) return resolve(false);

            try {
                const response = await fetch("/api/users/" + this.props.user._id);
                const user = response ? await response.json() : undefined;

                return resolve(user && user.isAdmin);
            } catch (err) { console.log(err) }
        }).then(res => { if (res) this.setState({ ...this.state, visible: true }); });
    }



    componentDidMount() { this.checkAdmin(); }



    componentDidUpdate(prevProps) { if (prevProps.user._id !== this.props.user._id) this.checkAdmin(); }



    handleCloseBtnClick() { this.props.showAdmin(false); }



    renderAdmin() {
        return <div className="Admin">
            <div className="Admin__header">
                <div className="Admin__header__tag active"><div>Users</div></div>

                <div className="Admin__header__tag"> <div>Movies</div> </div>

                <div className="Admin__header__tag"><div>Transactions</div></div>

                <div className="Admin__header__tag"><div>Genres</div></div>

                <div id="Admin__close-btn" onClick={() => this.handleCloseBtnClick()}>&times;</div>
            </div>

            <div className="Admin__body">
                {this.state.activeTag === "users" && <Admin__users />}
            </div>
        </div>
    }



    render() {
        return this.props.user && this.props.user.isAdmin && this.state.visible
            ? <div>{this.renderAdmin()}</div>
            : <div></div>
    }
}

/**





 */