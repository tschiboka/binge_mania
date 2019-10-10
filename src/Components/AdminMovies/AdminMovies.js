import React, { Component } from "react";
import _ from "lodash";

import "./AdminMovies.scss";



export default class AdminMovies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeSubHeaderTag: "movies",
            addMovie: {},
            showPoster: false
        }
    }



    handleSubheaderClick(subheader) { this.setState({ ...this.state, activeSubHeaderTag: subheader }); }



    async handleSearchMovieTitleBtnClick(event) {
        event.preventDefault();
        try {
            const title = document.getElementById("Admin__search-title").value;
            const pgNum = document.getElementById("Admin__search-pagenum").value || 1;
            const response = await fetch(`/api/searchtitle/${title}?page=${pgNum}`);
            const titles = await response.json();

            this.setState({ ...this.state, titles: titles || [] });
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
        console.log("ADD MOVIE");
        try {
            const BODY = {
                title: this.state.addMovie.title,
                description: this.state.addMovie.overview,
                genres: this.state.addMovie.genres.map(g => g.name),
                year: this.state.addMovie.release_date,
                time: this.state.addMovie.runtime,
                coverImgUrl: this.state.addMovie.poster_path
            }
            const response = await fetch("/api/movies", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: BODY
            });
            console.log(BODY);
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
                            <tr><th>title</th><th>id</th></tr>
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

                        <div><button onClick={() => this.addMovieToDB()}>Add Movie to binge_mania db</button></div>
                    </div>}
            </div>
        );
    }
}