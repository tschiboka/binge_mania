import React, { Component } from "react";

import "./Admin__users.scss";



export default class Admin__users extends Component {
    componentDidMount() { if (!this.props.users.length) this.getUsers(); }



    getUsers() {
        const getUsersFromDb = async () => {
            try {
                const response = await fetch("/api/users");
                const text = await response.text();

                this.props.setUsers(JSON.parse(text));
            } catch (err) { console.log(err); }
        }

        getUsersFromDb();
    }



    renderUsers() {
        return (this.props.users).map((user, i) => (<tr key={"userTable" + i}>
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
                    <tbody>
                        <tr><th>Name</th><th>Email</th><th>id</th><th>Admin</th></tr>

                        {this.renderUsers()}
                    </tbody>
                </table>
            </div>
        );
    }
}