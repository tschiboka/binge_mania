import React, { Component } from "react";

import "./Admin.scss";

import AdminUsers from "../AdminUsers/AdminUsers";
import AdminMovies from "../AdminMovies/AdminMovies";



export default class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTag: "users",
            movies: this.props.movies
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



    setUsers(users) { this.setState({ ...this.state, users: users }); }



    componentDidMount() { this.checkAdmin(); }



    componentDidUpdate(prevProps) { if (prevProps.user._id !== this.props.user._id) this.checkAdmin(); }



    handleCloseBtnClick() { this.props.showAdmin(false); }



    handleHeaderClick(activeTag) { this.setState({ ...this.state, activeTag: activeTag }); }



    renderAdmin() {
        return <div className="Admin">
            <div className="Admin__header">
                <div
                    className={"Admin__header__tag" + (this.state.activeTag === "users" ? " active" : "")}
                    onClick={() => this.handleHeaderClick("users")}
                ><div>Users</div>
                </div>

                <div
                    className={"Admin__header__tag" + (this.state.activeTag === "movies" ? " active" : "")}
                    onClick={() => this.handleHeaderClick("movies")}
                ><div>Movies</div>
                </div>

                <div
                    className={"Admin__header__tag" + (this.state.activeTag === "transactions" ? " active" : "")}
                    onClick={() => this.handleHeaderClick("transactions")}
                ><div>Transactions</div>
                </div>

                <div
                    className={"Admin__header__tag" + (this.state.activeTag === "genres" ? " active" : "")}
                    onClick={() => this.handleHeaderClick("genres")}
                ><div>Genres</div>
                </div>

                <div id="Admin__close-btn"><button onClick={() => this.handleCloseBtnClick()}>&times;</button></div>
            </div>

            <div className="Admin__body">
                <div className="Admin__body-upper-right-corner"></div>

                {this.state.activeTag === "users" && <AdminUsers users={this.state.users || []} setUsers={this.setUsers.bind(this)} />}

                {this.state.activeTag === "movies" && <AdminMovies movies={this.state.movies || []} refreshMovies={this.props.refreshMovies} />}

                {this.state.activeTag === "transactions" && <div>Transactions</div>}

                {this.state.activeTag === "genres" && <div>Genres</div>}
            </div>
        </div>
    }



    render() {
        return this.props.user && this.props.user.isAdmin && this.state.visible
            ? <div>{this.renderAdmin()}</div>
            : <div></div>
    }
}