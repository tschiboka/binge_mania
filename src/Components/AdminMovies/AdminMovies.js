import React, { Component } from "react";

import "./AdminMovies.scss";



export default class AdminMovies extends Component {
    constructor(props) {
        super(props);

        this.state = { activeSubHeaderTag: "movies" }
    }



    handleSubheaderClick(subheader) { this.setState({ ...this.state, activeSubHeaderTag: subheader }); }



    async handleSearchMovieTitleClick(event) {
        event.preventDefault();
        try {
            const title = document.getElementById("Admin__search-title").value;
            const pgNum = document.getElementById("Admin__search-pagenum").value || 1;
            const response = await fetch(`/api/search/${title}?page=${pgNum}`);
            const titles = await response.json();

            this.setState({ ...this.state, titles: titles || [] });
        } catch (err) { console.log(err) }
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
                        <button onClick={e => this.handleSearchMovieTitleClick(e)} > Search movie</button>

                    </form>

                    <table>
                        <tbody>

                        </tbody>
                    </table>

                </div>}
            </div >
        );
    }
}