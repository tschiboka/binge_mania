import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import "./AdminGenres.scss";

export default class AdminGenres extends Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true }
    }



    componentDidMount() { this.fetchGenresFromDB(); }



    async fetchGenresFromDB() {
        try {
            const response = await fetch("/api/genres");
            const genresJSON = await response.json();

            this.setState({ ...this.state, genres: genresJSON, isLoading: false });
        } catch (err) { console.log(err); }
    }



    render() {
        return (
            <div className="AdminGenres">
                GENREEES
                <LoadingSpinner isLoading={this.state.isLoading} />
            </div>
        );
    }
}