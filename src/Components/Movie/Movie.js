import React, { Component } from "react";

import "./Movie.scss";



//<div className="Movie-cover-img" style={{ backgroundImage: `url(${this.props.movie.coverImgUrl})` }}></div>
export default class Movie extends Component {
    render() {
        return <div className="Movie">
            <img className="Movie__cover-img" src={this.props.movie.coverImgUrl} alt="movie-cover-img" />

            <div className="Movie__title">{this.props.movie.title}</div>
        </div >
    }
}