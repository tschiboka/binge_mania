import React, { Component } from "react";

import "./Admin__users.scss";



export default class Admin__users extends Component {
    constructor(props) {
        super(props);

        this.state = { users: [] }
    }



    componentDidMount() { this.getUsers(); }



    getUsers() {
        const getUsersFromDb = async () => {
            console.log("HERE");
            try {
                const response = await fetch("/api/users");
                const text = await response.text();

                this.setState({ ...this.state, users: JSON.parse(text) });
            } catch (err) { console.log(err); }
        }

        getUsersFromDb();
    }



    renderUsers() {
        return this.state.users.map(user => (<tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{user._id}</td>
            <td>{JSON.stringify(user.isAdmin)}</td>
        </tr>));
    }



    render() {
        return (
            <div className="Admin__user">
                <table>
                    <tr><th>Name</th><th>Email</th><th>id</th><th>Admin</th></tr>
                    {this.renderUsers()}
                </table>
            </div>
        );
    }
}