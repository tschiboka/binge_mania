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

            this.setState({
                ...this.state,
                genres: genresJSON.sort((a, b) => b.moviesWithGenre - a.moviesWithGenre),
                isLoading: false
            });
        } catch (err) { console.log(err); }
    }



    async updateGenre(newGenre) {
        this.setState({ ...this.state, isLoading: true });
        const BODY = {};
        BODY.id = newGenre._id + "";
        BODY.showInMenu = newGenre.showInMenu + "";
        BODY.moviesWithGenre = newGenre.moviesWithGenre + "";

        const HEADER = {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(BODY)
        };

        const response = await fetch("/api/genres", HEADER);
        return await response.json();
    }



    swapToCorrectGenreNum(corrNum, genre) {
        const newGenre = genre;
        genre.moviesWithGenre = corrNum;
        this.updateGenre(newGenre);

        const genres = [...this.state.genres];
        const index = genres.findIndex(g => g.name === newGenre.name);
        delete genres[index].correctMoviesWithGenres;

        this.setState({ ...this.state, genres: genres, isLoading: false });
    }



    renderGenresTable() {
        return (this.state.genres || []).map((genre, i) => (
            <div className="AdminGenres__genre" key={"AdminGenre" + i}>
                <div>{genre.name}</div>

                <div title={genre.correctMoviesWithGenres === undefined ? "" : "correct amount should be: " + genre.correctMoviesWithGenres}>
                    {genre.moviesWithGenre}

                    {<span>{genre.correctMoviesWithGenres === undefined ? "" : "!"}</span>}

                    {(genre.correctMoviesWithGenres !== undefined) &&
                        <button onClick={() => this.swapToCorrectGenreNum(genre.correctMoviesWithGenres, genre)}>
                            &#8644; {genre.correctMoviesWithGenres}</button>}
                </div>

                <div>{genre.showInMenu + ""}</div>

                <div>
                    <div
                        className={"AdminGenres-genre--" + (genre.showInMenu ? "checked" : "unchecked")}
                        onClick={async () => {
                            genre.showInMenu = !genre.showInMenu;
                            const newGenre = await this.updateGenre(genre);
                            const newGenres = [...this.state.genres];
                            newGenres[i] = newGenre;
                            this.setState({ ...this.state, genres: newGenres, isLoading: false });
                        }}
                    >
                        {genre.showInMenu ? <span>&#10004;</span> : <span>&times;</span>}
                    </div>
                </div>
            </div>
        ));
    }


    async matchMoviesWithGenres() {
        let movies = [];
        this.setState({ ...this.state, isLoading: true });

        // get movies from db
        try {
            const moviesResp = await fetch("/api/movies");
            const moviesJSON = await moviesResp.json();

            movies = moviesJSON;
        } catch (err) { console.log(err); }

        const correctGenres = {};

        // count correct movies by genre
        for (const { genres } of movies) {
            genres.forEach(g => {
                const genre = g.toLowerCase().replace(/\s/, ""); // prop keys can't have spaces
                !correctGenres[genre] ? correctGenres[genre] = 1 : ++correctGenres[genre];
            });
        }

        // compare database with calculation
        let genresWithWarning = 0;
        const newGenresWithWarningProp = [];


        this.state.genres.map(dbGenre => {
            const name = dbGenre.name.toLowerCase().replace(/\s/, "");
            const isCorrect = (correctGenres[name] || 0) === dbGenre.moviesWithGenre;

            console.log(name, (correctGenres[name] || 0), dbGenre.moviesWithGenre);
            if (!isCorrect) {
                dbGenre.correctMoviesWithGenres = (correctGenres[name] || 0);
                genresWithWarning++;
            }
            newGenresWithWarningProp.push(dbGenre);
        });

        if (genresWithWarning) this.setState({ ...this.state, genres: newGenresWithWarningProp, isLoading: false });
        else this.setState({ ...this.state, isLoading: false });
    }



    render() {
        return (
            <div className="AdminGenres">
                <div className="AdminGenres__box">
                    <button onClick={() => this.matchMoviesWithGenres()}>Match Movies With Genres</button>

                    <div className="AdminGenres__header"><div>genre</div><div>movies</div><div>visible</div></div>
                    {this.renderGenresTable()}


                </div>

                <LoadingSpinner isLoading={this.state.isLoading} />
            </div>
        );
    }
}