import React, { Component } from "react";
import "./Header.scss";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }



    componentDidMount() {
        window.addEventListener('resize', this.setGenresOptionsCoords);

        const getGenres = async () => {
            try {
                const response = await fetch("/api/genres");
                const genres = await response.text();
                const newState = this.state;
                newState.genres = genres.split(",");
                this.setState(newState);
            } catch (exp) { console.error("ERROR WHILE FETChiNG GENRES\n" + exp) }
        }
        getGenres();
    }



    componentWillUnmount() {
        window.removeEventListener('resize', this.setGenresOptionsCoords);
    }



    handleGenresMenuClick() {
        const newState = this.state;
        newState.openGenreOptions = !newState.openGenreOptions;
        this.setState(newState);

        this.setGenresOptionsCoords();
        console.log("Click", this.state.openGenreOptions);
    }



    setGenresOptionsCoords() {
        // adjust options div coordinates to genres
        const genresDiv = document.getElementById("Header__genres");
        const genreRect = genresDiv.getBoundingClientRect();
        const headerDiv = document.getElementsByClassName("Header")[0];
        const headerRect = headerDiv.getBoundingClientRect();
        const genresOpts = document.getElementById("Header__genres__options");

        genresOpts.style.left = genreRect.left + "px";
        genresOpts.style.top = headerRect.bottom + "px";
    }



    renderGenreOptions(genres) {
        return genres.map((genre, i) => <div key={i} className="Header__genres__option">{genre}</div>);
    }



    render() {
        return (
            <header className="Header">
                <div className="Header__logo">Binge Mania</div>

                <div className="Header__icons">
                    <div
                        id="Header__genres"
                        onClick={() => this.handleGenresMenuClick()}
                    >
                        Genres {this.state.openGenreOptions
                            ? <span>&#9652;</span> : <span>&#9662;</span>}

                        <div
                            id="Header__genres__options"
                            style={{ visibility: this.state.openGenreOptions ? "visible" : "hidden" }}>

                            {this.renderGenreOptions(this.state.genres || ["No Genres"])}
                        </div>
                    </div>

                    <div className="Header__icons__shopping-cart">Cart</div>

                    <div className="Header__icons__user">User</div>
                </div>
            </header>
        );
    }
}