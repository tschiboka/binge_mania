import React, { Component } from "react";

import "./Movie.scss";

import defaultImg from "../../images/image-not-found.png";



export default class Movie extends Component {
    render() {
        //const imgUrlIsValid = url => 

        return <div className="Movie">
            <img
                className="Movie__cover-img"
                src={this.props.movie.coverImgUrl}
                alt="movie-cover-img"
                onError={(e) => { e.target.src = defaultImg; }}
            />

            <div className="Movie__title">{this.props.movie.title}</div>
        </div >
    }
}