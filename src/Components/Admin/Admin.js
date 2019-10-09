import React, { Component } from "react";

import "./Admin.scss";



export default class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }

    checkAdmin() {
        // By changing Apps showAdmin prop in React dev tool, Admin copmonent is available.
        // Ask authorisation of current user despite of cost of performace
        new Promise(async (resolve, reject) => {
            if (!this.props.user._id) return resolve(false);

            try {
                const response = await fetch("/api/users/" + this.props.user._id);
                const user = response ? await response.json() : undefined;

                console.log(user);
                return resolve(user && user.isAdmin);
            } catch (err) { console.log(err) }
        }).then(res => { console.log(res); if (res) this.setState({ ...this.state, visible: true }); });

    }



    componentDidMount() { this.checkAdmin(); }



    componentDidUpdate(prevProps) { if (prevProps.user._id !== this.props.user._id) this.checkAdmin(); }



    render() {
        return (
            this.props.user && this.props.user.isAdmin && this.state.visible ? <div>HEY</div> : <div></div>
        );
    }
}

/**





 */