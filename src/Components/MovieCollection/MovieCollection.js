import React, { Component } from 'react';
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import "./MovieCollection.scss";
import _ from "lodash";

export default class MovieCollection extends Component {
    constructor(props) {
        super(props);

        this.state = { currentPage: 0 };
    }


    componentDidMount() {
        this.setAmountOfMoviesInARow();
        window.addEventListener('resize', () => { this.setAmountOfMoviesInARow(); });
    }



    componentDidUpdate() {
        this.findCurrentPage();
    }



    findCurrentPage() {

    }



    setAmountOfMoviesInARow() {
        const div = document.getElementsByClassName("MovieCollection")[0];
        const width = div.getBoundingClientRect().width;
        const amount = Math.floor(width / 200);

        this.setState({ ...this.state, moviesInARow: amount });
    }



    handleArrowBtnClick(doIncrement) {
        if (!doIncrement && this.state.currentPage > 0) return this.setState({ ...this.state, currentPage: --this.state.currentPage });

        const maxPage = this.props.movies.length / this.state.moviesInARow;
        if (doIncrement && this.state.currentPage < maxPage - 1) this.setState({ ...this.state, currentPage: ++this.state.currentPage });
    }



    renderMovies(movies) {
        const rowOfMovies = _.chunk(movies, this.state.moviesInARow)[this.state.currentPage] || [];

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
        return <div className="pagination--bar"><div className="pagination--bar-inner"></div></div>
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