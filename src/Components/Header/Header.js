import React, { Component } from "react";
import "./Header.scss";
import GenresMenu from "../GenresMenu/GenresMenu";
import UserMenu from "../UserMenu/UserMenu";

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
        newState.openGenreMenu = !newState.openGenreMenu;
        this.setState(newState);

        this.setGenresOptionsCoords();
    }



    handleUserBtnClick() {
        const newState = this.state;
        newState.openUserMenu = !newState.openUserMenu;
        this.setState(newState);

        this.setGenresOptionsCoords();
    }



    handleGenresOnBlur() {
        const newState = this.state;
        newState.openGenreMenu = false;
        this.setState(newState);
        console.log("Blur");
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


    render() {
        return (
            <header className="Header">
                <div className="Header__logo">
                    <div className="Header__logo__img"></div>

                    <div className="Header__logo__text">Binge Mania</div>
                </div>

                <div className="Header__icons">
                    <div
                        id="Header__genres"
                        onClick={() => this.handleGenresMenuClick()}
                        onBlur={() => this.handleGenresOnBlur()}
                        tabIndex={0}
                    >
                        Genres {this.state.openGenreMenu
                            ? <span>&#9652;</span> : <span>&#9662;</span>}

                        <GenresMenu
                            visible={this.state.openGenreMenu}
                            genres={this.state.genres} />
                    </div>

                    <div className="Header__icons__shopping-cart">Cart</div>

                    <div
                        className="Header__icons__user"
                        onClick={() => this.handleUserBtnClick()}
                    >
                        User
                        {this.state.openUserMenu && <UserMenu />}
                    </div>
                </div>
            </header>
        );
    }
}