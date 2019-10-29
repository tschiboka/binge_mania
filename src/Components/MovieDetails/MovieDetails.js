import React, { Component } from 'react';
import "./MovieDetails.scss";

export default class MovieDetails extends Component {
    constructor(props) {
        super(props);

        this.state = {
            detailsOn: true
        };
    }



    render() {
        return (
            <div className="MovieDetails" onClick={(e) => {
                if (e.target.classList[0] === "MovieDetails") this.props.showMovieDetails(false, this.props.movie);
            }}>
                <div
                    className="MovieDetails__main--outer">
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
                                className="MovieDetails__poster-img"
                                style={{ backgroundImage: `url(${this.props.movie.coverImgUrl})` }}
                                title={this.props.movie.title + " cover image"}>
                                {this.state.detailsOn &&
                                    <div className="MovieDetails__details">
                                        <div id="MovieDetails__label--genre" className="MovieDetails__details__label">
                                            GENRES: {this.props.movie.genres.join(", ")}

                                            <div className="MovieDetails__details__label--end"></div>
                                        </div>

                                        <div id="MovieDetails__label--cast" className="MovieDetails__details__label">
                                            CAST: {this.props.movie.cast.join(", ")}
                                            <div className="MovieDetails__details__label--end"></div>
                                        </div>

                                        <div id="MovieDetails__label--year" className="MovieDetails__details__label">
                                            RELEASE YEAR: {this.props.movie.year}
                                            <div className="MovieDetails__details__label--end"></div>
                                        </div>

                                        <div id="MovieDetails__label--time" className="MovieDetails__details__label">
                                            RUNTIME: {this.props.movie.time} MIN
                                            <div className="MovieDetails__details__label--end"></div>
                                        </div>

                                        <div
                                            id="MovieDetails__label--sum"
                                            className="MovieDetails__details__label"
                                            onClick={() => this.setState({ ...this.state, summeryExpanded: !this.state.summeryExpanded })}
                                        >
                                            SHORT SUMMARY&nbsp;

                                            {this.state.summeryExpanded ? <span> &#9650;</span> : <span> &#9660;</span>}


                                            <div className="MovieDetails__details__label--end"></div>
                                        </div>
                                        {this.state.summeryExpanded && <div className="MovieDetails__details__summary">
                                            {this.props.movie.description}
                                        </div>}
                                    </div>}
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
                                <div className="MovieDetails__frame--bottom--inner">
                                    <div className="MovieDetails__button-box">
                                        <div
                                            className="MovieDetails__button-box__btn"
                                            onClick={() => this.setState({ ...this.state, detailsOn: !this.state.detailsOn })}>
                                            Details:&nbsp;
                                            {this.state.detailsOn
                                                ? <span className="MovieDetails__details--on">ON</span>
                                                : <span className="MovieDetails__details--off">OFF</span>
                                            }
                                        </div>

                                        <div
                                            className="MovieDetails__button-box__btn"
                                            onClick={() => this.props.add(this.props.movie)}>ADD</div>

                                        <div className="MovieDetails__button-box__btn">
                                            Stock:&nbsp;
                                            <span className="MovieDetails__stock">{this.props.movie.inStock}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}