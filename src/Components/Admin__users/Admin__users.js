import React, { Component } from "react";



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



    render() {
        return (
            <div>USERS</div>
        );
    }
}