import React, { Component } from "react";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import _ from "lodash";

import "./AdminMovies.scss";



export default class AdminMovies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSubHeaderTag: "movies",
            addMovie: {},
            showPoster: false,
            movieExists: false,
            successfullyAdded: false,
            isLoading: false
        }
    }



    handleSubheaderClick(subheader) { this.setState({ ...this.state, activeSubHeaderTag: subheader }); }



    async handleSearchMovieTitleBtnClick(event) {
        event.preventDefault();

        this.setState({ ...this.state, isLoading: true });

        try {
            const title = document.getElementById("Admin__search-title").value;
            const pgNum = document.getElementById("Admin__search-pagenum").value || 1;
            const response = await fetch(`/api/searchtitle/${title}?page=${pgNum}`);
            const titles = await response.json();

            this.setState({ ...this.state, titles: titles || [], isLoading: false });
        } catch (err) { console.log(err) }
    }



    async handleSearchMovieTitleClick(tmdb_id) {
        try {
            const response = await fetch(`api/searchmovieid/${tmdb_id}`);
            const movie = await response.json();

            console.log(movie);
            this.setState({ ...this.state, activeSubHeaderTag: "add-movie", addMovie: movie });
        } catch (err) { console.log(err); }
    }



    renderTitles() {
        return (this.state.titles || []).map((title, i) => <tr
            key={"admin-getmovietitles" + i}
            onClick={() => this.handleSearchMovieTitleClick(title.tmdb_id)}>
            <td>{title.title}</td><td>{title.tmdb_id}</td>
        </tr>);
    }



    async addMovieToDB() {
        try {
            // check if movie is already exists
            const response1 = await fetch("/api/movies/" + this.state.addMovie.title);
            const exist = await response1.text();

            if (exist) return this.setState({ ...this.state, movieExists: true });

            const BODY = {
                title: this.state.addMovie.title,
                description: this.state.addMovie.overview,
                genres: this.state.addMovie.genres.map(g => g.name),
                year: this.state.addMovie.release_date.match(/^\d{4}/)[0],
                time: this.state.addMovie.runtime,
                coverImgUrl: "http://image.tmdb.org/t/p/w500/" + this.state.addMovie.poster_path,
                cast: _.map(_.chunk(this.state.addMovie.credits.cast, 5)[0], "name")
            }
            const response2 = await fetch("/api/movies", {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(BODY)
            });

            const movie = await response2.json();
            if (movie._id) this.setState({ ...this.state, successfullyAdded: true });

        } catch (err) { console.log(err); }
    }



    handleMoviePosterURLClick() {
        const path = "http://image.tmdb.org/t/p/w500/" + this.state.addMovie.poster_path;
        this.setState({ ...this.state, showMoviePoster: true });

        const posterDiv = document.getElementById("AdminMovies__add-movie__poster");

        if (posterDiv) posterDiv.style.backgroundImage = `url(${path})`;
        console.log(posterDiv, path);
    }



    render() {
        return (
            <div className="AdminMovies">
                <LoadingSpinner isLoading={this.state.isLoading} />

                <div className="AdminMovies__subheader">
                    <div
                        className={"AdminMovies__subheader__tag " + (this.state.activeSubHeaderTag === "get-titles" ? " active" : "")}
                        onClick={() => this.handleSubheaderClick("get-titles")}
                    >Get Titles</div>

                    <div
                        className={"AdminMovies__subheader__tag " + (this.state.activeSubHeaderTag === "add-movie" ? " active" : "")}
                        onClick={() => this.handleSubheaderClick("add-movie")}
                    >Add Movie</div>

                    <div
                        className={"AdminMovies__subheader__tag " + (this.state.activeSubHeaderTag === "movies" ? " active" : "")}
                        onClick={() => this.handleSubheaderClick("movies")}
                    >Movies</div>
                </div>

                {this.state.activeSubHeaderTag === "get-titles" && <div className="AdminMovies__get-title">
                    <form>
                        Title: <input id="Admin__search-title" type="text" />
                        Page Num: <input id="Admin__search-pagenum" type="text" />
                        <button onClick={e => this.handleSearchMovieTitleBtnClick(e)} > Search movie</button>

                    </form>

                    <table>
                        <tbody>
                            <tr><th>Title</th><th>ID</th></tr>
                            {this.renderTitles()}
                        </tbody>
                    </table>
                </div>}

                {
                    (this.state.addMovie.title && this.state.activeSubHeaderTag === "add-movie") &&
                    <div className="AdminMovies__add-movie">
                        {<div id="AdminMovies__add-movie__poster" style={{ visibility: this.state.showMoviePoster ? "visible" : "hidden" }}>
                            <button onClick={() => this.setState({ ...this.state, showMoviePoster: false })}>&times;</button>
                        </div>}

                        <div>
                            <div>Title</div>

                            <div>{this.state.addMovie.title}</div>
                        </div>
                        <div>
                            <div>Cover Image</div>

                            <div className="AdminMovies__poster__url" onClick={() => this.handleMoviePosterURLClick()}>{this.state.addMovie.poster_path}</div>
                        </div>

                        <div>
                            <div>Overview</div>

                            <div>{this.state.addMovie.overview}</div>
                        </div>

                        <div>
                            <div>Genres</div>

                            <div>{JSON.stringify(this.state.addMovie.genres.map(g => g.name.toLowerCase()))}</div>
                        </div>

                        <div>
                            <div>Run Time</div>

                            <div>{this.state.addMovie.runtime}</div>
                        </div>


                        <div>
                            <div>Relaese Date</div>

                            <div>{this.state.addMovie.release_date}</div>
                        </div>

                        <div>
                            <div>Language</div>

                            <div>{this.state.addMovie.original_language}</div>
                        </div>

                        <div>
                            <div>Cast</div>

                            <div>{JSON.stringify(_.map(_.chunk(this.state.addMovie.credits.cast, 5)[0], "name"))}</div>
                        </div>

                        <div className="AdminMovies__add-movie__btn-div"><button onClick={() => this.addMovieToDB()}>
                            Add Movie to binge_mania db</button></div>
                    </div>}

                {this.state.movieExists && <div className="AdminMovies__message">
                    This movie already exists in binge_mania database!
                    <button onClick={() => this.setState({ ...this.state, movieExists: false })}>OK</button>
                </div>}

                {this.state.successfullyAdded && <div className="AdminMovies__message">
                    {`${this.state.addMovie.title} is added to database!`}
                    <button onClick={() => this.setState({ ...this.state, successfullyAdded: false })}>OK</button>
                </div>}

            </div>
        );
    }
}