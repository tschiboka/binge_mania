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
                        <div className="MovieDetails__title--outer" >
                            <div className="MovieDetails__title--inner">
                                <div className="MovieDetails__title--base">
                                    <div className="MovieDetails__title">
                                        {this.props.movie.title}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="MovieDetails__btn-box--outer">
                            <div className="MovieDetails__btn-box--middle">
                                <div className="MovieDetails__btn-box--inner">
                                    <div className="MovieDetails__btn-box__btn-base">
                                        <button onClick={() => this.props.showMovieDetails(false, this.props.movie)}>&times;</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="MovieDetails__poster">
                            <div
                                style={{ backgroundImage: `url(${this.props.movie.coverImgUrl})` }}
                                title={this.props.movie.title + " cover image"}>
                            </div>
                        </div>

                        <div className="MovieDetails__frame--left--outer">
                            <div className="MovieDetails__frame--left--middle">
                                <div className="MovieDetails__frame--left--inner"></div>
                            </div>
                        </div>

                        <div className="MovieDetails__frame--right--outer">
                            <div className="MovieDetails__frame--right--middle">
                                <div className="MovieDetails__frame--right--inner"></div>
                            </div>
                        </div>

                        <div className="MovieDetails__frame--bottom--outer">
                            <div className="MovieDetails__frame--bottom--middle">
                                <div className="MovieDetails__frame--bottom--inner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}