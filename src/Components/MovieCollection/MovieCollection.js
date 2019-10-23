import React, { Component } from 'react';
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import "./MovieCollection.scss";
import _ from "lodash";

export default class MovieCollection extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentPage: 0,
            currentFirstMovie: 0
        };
    }


    componentDidMount() {
        this.setAmountOfMoviesInARow();
        window.addEventListener('resize', () => { this.setAmountOfMoviesInARow(); this.findCurrentPage(); });
    }



    componentWillUpdate() {

    }



    findCurrentPage() {
        let row = -1;
        for (let i = 0; i < (this.props.movies || []).length; i++) {
            if (i % this.state.moviesInARow === 0) row++;
            if (i === this.state.currentFirstMovie) break;
        }

        this.setState({ ...this.state, currentPage: row, currentFirstMovie: this.state.moviesInARow * row });
    }



    setAmountOfMoviesInARow() {
        const div = document.getElementsByClassName("MovieCollection")[0];
        const width = div.getBoundingClientRect().width;
        const amount = Math.floor(width / 200);

        this.setState({ ...this.state, moviesInARow: amount });
    }



    handleArrowBtnClick(doIncrement) {
        if (!doIncrement && this.state.currentPage > 0) return this.setState({
            ...this.state,
            currentPage: --this.state.currentPage,
            currentFirstMovie: this.state.currentFirstMovie - this.state.moviesInARow
        });

        const maxPage = this.props.movies.length / this.state.moviesInARow;
        if (doIncrement && this.state.currentPage < maxPage - 1) this.setState({
            ...this.state,
            currentPage: ++this.state.currentPage,
            currentFirstMovie: this.state.currentFirstMovie + this.state.moviesInARow
        });
    }



    renderMovies(movies) {
        let rowOfMovies = _.chunk(movies, this.state.moviesInARow)[this.state.currentPage] || [];

        // if last page has less movies than a row take the last n ones
        if (rowOfMovies.length && rowOfMovies.length < this.state.moviesInARow) rowOfMovies = _.takeRight(movies, this.state.moviesInARow);

        return rowOfMovies.map((movie, i) => <LazyLoad
            key={this.props.collectionName + i}
            debounce={false}
        >
            <Movie movie={movie} />
        </LazyLoad>
        );
    }



    renderPagination(movies) {
        const chunks = movies.length / this.state.moviesInARow;

        if (chunks <= 15) return (
            _.chunk(movies, this.state.moviesInARow) || []).map((pag, i) => <div
                key={this.state.collectionName + "pagination" + i}
                className={"pagination--rect " + (i === this.state.currentPage ? "current" : "")}
            ></div>);
        return <div className="pagination--bar">
            <div
                className="pagination--bar-inner"
                style={{ width: (((this.state.currentPage + 1) * this.state.moviesInARow) * (100 / movies.length)) + "%" }}
            ></div>
        </div>
    }



    render() {
        return (
            <div className="MovieCollection">
                <div className="MovieCollection__title--outer">
                    <div className="MovieCollection__title--inner">
                        {this.props.collectionName}
                    </div>
                </div>

                <div className="MovieCollection__pagination--outer">
                    <div className="MovieCollection__pagination--inner">
                        {this.renderPagination(this.props.movies || [])}
                    </div>
                </div>

                <div id="MovieCollection__arrow__left--outer">
                    <div className="MovieCollection__arrow__left--inner">
                        <button onClick={() => this.handleArrowBtnClick(false)} > -</button>
                    </div>
                </div>

                <div id="MovieCollection__arrow__right--outer">
                    <div className="MovieCollection__arrow__right--inner">
                        <button onClick={() => this.handleArrowBtnClick(true)}>+</button>
                    </div>
                </div>

                <div className="MovieCollection__main">
                    {this.renderMovies(this.props.movies || [])}
                </div>
            </div>
        );
    }
}