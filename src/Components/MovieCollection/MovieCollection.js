import React, { Component } from 'react';
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import "./MovieCollection.scss";
import _ from "lodash";

export default class MovieCollection extends Component {
    constructor(props) {
        super(props);

        this.state = { page: 0 };
    }


    componentDidMount() {
        this.setAmountOfMoviesInARow();
        window.addEventListener('resize', () => {
            console.log("RESIZE");
            this.setAmountOfMoviesInARow();
        });
    }



    setAmountOfMoviesInARow() {
        const div = document.getElementsByClassName("MovieCollection")[0];
        const width = div.getBoundingClientRect().width;
        const amount = Math.floor(width / 200);

        this.setState({ ...this.state, moviesInARow: amount });

        console.log(width, width / 200);
    }



    renderMovies(movies) {
        const rowOfMovies = _.chunk(movies, this.state.moviesInARow)[this.state.page] || [];

        return rowOfMovies.map((movie, i) => <LazyLoad
            key={this.props.collectionName + i}
            debounce={false}
        >
            <Movie movie={movie} />
        </LazyLoad>
        );
    }



    render() {
        return (
            <div className="MovieCollection">
                <div className="MovieCollection__title"></div>

                <div className="MovieCollection__pagination"></div>

                <div className="MovieCollection__main">
                    {this.renderMovies(this.props.movies || [])}
                </div>
            </div>
        );
    }
}