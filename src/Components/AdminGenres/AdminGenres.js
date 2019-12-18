import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import "./AdminGenres.scss";
import { spawn } from 'child_process';

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

            this.setState({
                ...this.state,
                genres: genresJSON.sort((a, b) => b.moviesWithGenre - a.moviesWithGenre),
                isLoading: false
            });
        } catch (err) { console.log(err); }
    }



    renderGenresTable() {
        return (this.state.genres || []).map((genre, i) => (
            <div className="AdminGenres__genre" key={"AdminGenre" + i}>
                <div>{genre.name}</div>

                <div>{genre.moviesWithGenre}</div>

                <div>{genre.showInMenu + ""}</div>

                <div>
                    <div className={"AdminGenres-genre--" + (genre.showInMenu ? "checked" : "unchecked")}>
                        {genre.showInMenu ? <span>&#10004;</span> : <span>&times;</span>}
                    </div>
                </div>
            </div>
        ));
    }



    render() {
        return (
            <div className="AdminGenres">
                <div className="AdminGenres__box">
                    <div className="AdminGenres__header"><div>genre</div><div>movies</div><div>visible</div></div>
                    {this.renderGenresTable()}
                </div>

                <LoadingSpinner isLoading={this.state.isLoading} />
            </div>
        );
    }
}