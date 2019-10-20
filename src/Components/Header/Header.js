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
                const genres = await response.json();
                const newState = this.state;
                newState.genres = genres;
                this.setState(newState);
            } catch (exp) { console.error("ERROR WHILE FETCHING GENRES\n" + exp) }
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
        this.setState({ ...this.state, genreMenuIsOpen: !this.state.genreMenuIsOpen },
            () => { if (this.state.genreMenuIsOpen) this.setGenresMenuCoords(); });
    }



    handleUserMenuClick() {
        this.setState({ ...this.state, userMenuIsOpen: !this.state.userMenuIsOpen },
            () => { if (this.state.userMenuIsOpen) this.setUserMenuCoords(); });
    }



    handleGenresOnBlur() { this.setState({ ...this.state, genreMenuIsOpen: false }); }



    handleUserOnBlur() {
        if (this.state.userIconMouseOver) return; // if mouse is over user icon blur is not happening
        this.setState({ ...this.state, userMenuIsOpen: false });
    }



    leaveGenreMenuOpen() { this.setState({ ...this.state, genreMenuIsOpen: true }); }



    toggleUserIconMouseOver(isOver) { this.setState({ ...this.state, userIconMouseOver: isOver }); }



    setGenresMenuCoords() {
        if (this.state.genreMenuIsOpen) {
            // adjust options div coordinates to genres
            const genresDiv = document.getElementById("Header__icons__genres");
            const genreRect = genresDiv.getBoundingClientRect();
            const headerDiv = document.getElementsByClassName("Header")[0];
            const headerRect = headerDiv.getBoundingClientRect();
            const genresOpts = document.getElementById("Header__genres__options");

            if (genresOpts.classList.contains("Header__genres__options--expanded")) { genresOpts.style.right = "1%"; genresOpts.style.left = ""; }
            else { genresOpts.style.left = genreRect.left + "px"; genresOpts.style.right = "" }
            genresOpts.style.top = headerRect.bottom + "px";
            console.log("COORDS ", genresOpts.style.right, genresOpts.style.left);
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
                        id="Header__icons__genres"
                        className="Header__icon"
                        onClick={() => this.handleGenresMenuClick()}
                        onBlur={() => this.handleGenresOnBlur()}
                        tabIndex={0}
                    >
                        Genres {this.state.genreMenuIsOpen
                            ? <span>&#9652;</span> : <span>&#9662;</span>}

                        <GenresMenu
                            visible={this.state.genreMenuIsOpen}
                            genres={this.state.genres}
                            setCoords={this.setGenresMenuCoords.bind(this)}
                        />
                    </div>

                    <div id="Header__icons__shopping-cart" className="Header__icon">Cart</div>

                    <div
                        className="Header__icons__user Header__icon"
                        onClick={() => this.handleUserMenuClick()}
                        onMouseOver={() => this.toggleUserIconMouseOver(true)}
                        onMouseOut={() => this.toggleUserIconMouseOver(false)}
                        tabIndex={0}
                    >
                        User
                    </div>
                </div>

                <UserMenu
                    visible={this.state.userMenuIsOpen}
                    tabIndex={0}
                    login={this.props.login}
                    logout={this.props.logout}
                    user={this.props.user}
                    showAdmin={this.props.showAdmin}
                    blur={() => this.handleUserOnBlur()} />
            </header>
        );
    }
}