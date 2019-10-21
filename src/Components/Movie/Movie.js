import React, { Component } from "react";
import defaultImg from "../../images/image-not-found.png";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

import "./Movie.scss";




export default class Movie extends Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true }
    }



    render() {
        return <div className="Movie">
            <img
                className="Movie__cover-img"
                src={this.props.movie.coverImgUrl}
                alt="movie-cover-img"
                effect="blur"
                onLoad={e => this.setState({ ...this.state, isLoading: false })}
                onError={e => e.target.src = defaultImg}
            />

            <div className="Movie__title">{this.props.movie.title}</div>

            <LoadingSpinner loading={this.state.isLoading} />
        </div>
    }
}