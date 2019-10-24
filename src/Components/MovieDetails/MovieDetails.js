import React, { Component } from 'react';
import "./MovieDetails.scss";

export default class MovieDetails extends Component {
    render() {
        return (
            <div className="MovieDetails">
                <div
                    className="MovieDetails__main--outer"
                    tabIndex={0}
                    onBlur={() => this.props.showMovieDetails(false, this.props.movie)}
                >
                    <div className="MovieDetails__main--inner">
                        <button onClick={() => this.props.showMovieDetails(false, this.props.movie)}>X</button>
                    </div>
                </div>
            </div>
        );
    }
}