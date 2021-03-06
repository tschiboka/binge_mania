import React, { Component } from "react";
import "./Header.scss";
import GenresMenu from "../GenresMenu/GenresMenu";
import UserMenu from "../UserMenu/UserMenu";
import Avatar from "../../images/user-avatar.png";
import Cart from "../../images/shopping-cart.png";
import ShoppingCart from "../ShoppingCart/ShoppingCart";

export default class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {};
    }



    componentDidMount() {
        window.addEventListener('resize', () => {
            this.setGenresMenuCoords.bind(this);
            this.setUserMenuCoords.bind(this);
            this.setShoppingCartMenuCoords.bind(this);
        });

        const getGenres = async () => {
            try {
                const response = await fetch("/api/genres");
                const genres = await response.json();

                this.setState({ ...this.state, genres: genres.filter(g => g.showInMenu) });
            } catch (exp) { console.error("ERROR WHILE FETCHING GENRES\n" + exp) }
        }
        getGenres();
    }



    componentWillUnmount() {
        window.removeEventListener('resize', () => {
            this.setGenresMenuCoords.bind(this);
            this.setUserMenuCoords.bind(this);
            this.setShoppingCartMenuCoords.bind(this);
        });
    }



    handleGenresMenuClick() {
        this.setState({ ...this.state, genreMenuIsOpen: !this.state.genreMenuIsOpen },
            () => { if (this.state.genreMenuIsOpen) this.setGenresMenuCoords(); });
    }


    handleShoppingCartClick() {
        this.setState({ ...this.state, shoppingCartIsOpen: !this.state.shoppingCartIsOpen },
            () => { if (this.state.shoppingCartIsOpen) this.setShoppingCartMenuCoords(); });
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


    handleShoppingCartOnBlur() {
        if (this.state.shoppingCartIconMouseOver) return; // if mouse is over shoppingCart icon blur is not happening
        this.setState({ ...this.state, shoppingCartIsOpen: false });
    }



    leaveGenreMenuOpen() { this.setState({ ...this.state, genreMenuIsOpen: true }); }



    toggleUserIconMouseOver(isOver) { this.setState({ ...this.state, userIconMouseOver: isOver }); }



    toggleShoppingCartIconMouseOver(isOver) { this.setState({ ...this.state, shoppingCartIconMouseOver: isOver }); }



    setGenresMenuCoords() {
        if (this.state.genreMenuIsOpen) {
            // adjust options div coordinates to genres
            const genresDiv = document.getElementById("Header__icons__genres");
            const genreRect = genresDiv.getBoundingClientRect();
            const headerDiv = document.getElementsByClassName("Header")[0];
            const headerRect = headerDiv.getBoundingClientRect();
            const genresOpts = document.getElementById("Header__genres__options");

            // LOADING
            if (!genresOpts) {
                const loadingDiv = document.getElementById("Header__genres--loading");
                loadingDiv.style.top = headerRect.bottom + "px";
                loadingDiv.style.left = genreRect.left + "px";
                loadingDiv.style.right = ""
            } else {
                // LOADED AND EXTPANDED
                if (genresOpts.classList.contains("Header__genres__options--expanded")) { genresOpts.style.right = "0"; genresOpts.style.left = ""; }
                // LOADED NOT EXPANDED
                else { genresOpts.style.left = genreRect.left + "px"; genresOpts.style.right = ""; }
                genresOpts.style.top = headerRect.bottom + "px";
            }
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



    setShoppingCartMenuCoords() {
        if (this.state.shoppingCartIsOpen) {
            const headerDiv = document.getElementsByClassName("Header")[0];
            const headerRect = headerDiv.getBoundingClientRect();
            const cartMenu = document.getElementById("ShoppingCart");

            cartMenu.style.top = headerRect.bottom + "px";
        }
    }



    render() {
        return (
            <header className="Header">
                <div className="Header__logo">
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
                            showGenre={this.props.showGenre}
                        />
                    </div>

                    <div
                        id="Header__icons__shopping-cart"
                        className="Header__icon"
                        onClick={() => this.handleShoppingCartClick()}
                        onMouseOver={() => this.toggleShoppingCartIconMouseOver(true)}
                        onMouseOut={() => this.toggleShoppingCartIconMouseOver(false)}
                    >
                        <img src={Cart} alt="shopping-cart" />
                    </div>

                    <div
                        className="Header__icons__user Header__icon"
                        onClick={() => this.handleUserMenuClick()}
                        onMouseOver={() => this.toggleUserIconMouseOver(true)}
                        onMouseOut={() => this.toggleUserIconMouseOver(false)}
                        tabIndex={0}
                    >
                        <div className="Header__icons__user__avatar">
                            <img src={Avatar} alt="avatar" />
                        </div>
                    </div>
                </div>

                <ShoppingCart
                    visible={this.state.shoppingCartIsOpen}
                    movies={this.props.movies}
                    user={this.props.user}
                    remove={this.props.remove}
                    emptyCart={this.props.emptyCart}
                    blur={() => this.handleShoppingCartOnBlur()}
                    updateMoviesInStock={this.props.updateMoviesInStock}
                />

                <UserMenu
                    visible={this.state.userMenuIsOpen}
                    tabIndex={0}
                    login={this.props.login}
                    logout={this.props.logout}
                    user={this.props.user}
                    showAdmin={this.props.showAdmin}
                    openHistory={this.props.openHistory}
                    blur={() => this.handleUserOnBlur()}
                />
            </header>
        );
    }
}