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
        window.addEventListener('resize', () => {
            this.setGenresMenuCoords.bind(this);
            this.setUserMenuCoords.bind(this);
        });

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
        window.removeEventListener('resize', () => {
            this.setGenresMenuCoords.bind(this);
            this.setUserMenuCoords.bind(this);
        });
    }



    handleGenresMenuClick() {
        const newState = this.state;
        newState.genreMenuIsOpen = !newState.genreMenuIsOpen;
        this.setState(newState);

        if (this.state.genreMenuIsOpen) this.setGenresMenuCoords();
    }



    handleUserMenuClick() {
        const newState = this.state;
        newState.userMenuIsOpen = !newState.userMenuIsOpen;
        this.setState(newState);

        if (this.state.userMenuIsOpen) this.setUserMenuCoords();
    }



    handleGenresOnBlur() {
        const newState = this.state;
        newState.genreMenuIsOpen = false;
        this.setState(newState);
    }



    setGenresMenuCoords() {
        if (this.state.genreMenuIsOpen) {
            // adjust options div coordinates to genres
            const genresDiv = document.getElementById("Header__genres");
            const genreRect = genresDiv.getBoundingClientRect();
            const headerDiv = document.getElementsByClassName("Header")[0];
            const headerRect = headerDiv.getBoundingClientRect();
            const genresOpts = document.getElementById("Header__genres__options");

            genresOpts.style.left = genreRect.left + "px";
            genresOpts.style.top = headerRect.bottom + "px";
        }
    }



    setUserMenuCoords() {
        if (this.state.userMenuIsOpen) {
            const headerDiv = document.getElementsByClassName("Header")[0];
            const headerRect = headerDiv.getBoundingClientRect();
            const userMenu = document.getElementById("User-menu");

            userMenu.style.top = headerRect.bottom + "px";
        }
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
                        Genres {this.state.genreMenuIsOpen
                            ? <span>&#9652;</span> : <span>&#9662;</span>}

                        <GenresMenu
                            visible={this.state.genreMenuIsOpen}
                            genres={this.state.genres} />
                    </div>

                    <div className="Header__icons__shopping-cart">Cart</div>

                    <div
                        className="Header__icons__user"
                        onClick={() => this.handleUserMenuClick()}
                    >
                        User
                        <UserMenu visible={this.state.userMenuIsOpen} />
                    </div>
                </div>
            </header>
        );
    }
}