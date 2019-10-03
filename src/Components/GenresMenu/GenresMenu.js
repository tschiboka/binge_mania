import React, { Component } from "react";
import "./GenresMenu.scss";



export default class GenresMenu extends Component {
    renderGenreOptions(genres) {
        return genres.map((genre, i) => <div key={i} className="Header__genres__option">
            {genre.replace(/^./g, ch => ch.toUpperCase())}
        </div>);
    }



    render() {
        return (
            <div
                id="Header__genres__options"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}>

                {this.renderGenreOptions(this.props.genres || ["No Genres"])}
            </div>
        );
    }
}