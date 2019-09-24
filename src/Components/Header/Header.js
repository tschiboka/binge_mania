import React, { Component } from "react";
import "./Header.scss";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }



    componentDidMount() {
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



    handleGenresMenuClick() {
        const newState = this.state;
        newState.openGenreOptions = !newState.openGenreOptions;
        this.setState(newState);
        console.log("Click", this.state.openGenreOptions);
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
                            ? <span>&#9662;</span> : <span>&#9652;</span>}
                        <div id="Header__genres__options" >
                            <div className="Header__genres__option">Comedy</div>

                            <div className="Header__genres__option">Horror</div>

                            <div className="Header__genres__option">Thriller</div>
                        </div>
                    </div>

                    <div className="Header__icons__shopping-cart">Cart</div>

                    <div className="Header__icons__user">User</div>
                </div>
            </header>
        );
    }
}