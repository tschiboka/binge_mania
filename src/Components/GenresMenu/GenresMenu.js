import React, { Component } from "react";
import "./GenresMenu.scss";
import _ from "lodash";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";



export default class GenresMenu extends Component {
    constructor(props) {
        super(props);
        this.state = { expanded: false };
    }



    componentDidUpdate() { this.props.setCoords(); }



    renderGenreOptions(genres) {
        // More than 10 genres but not extended
        // Display 9 most freq and a show more option
        if (genres.length > 10 && !this.state.expanded) {
            genres = genres
                .sort((prev, curr) => prev.moviesWithGenre < curr.moviesWithGenre) // sort genres by moviesWithGenre descending
                .slice(0, 10)                                                      // get first 10
                .sort((prev, curr) => prev.name > curr.name);                      // back to alphabethical order ascending

            return genres.map((genre, i) => <div
                key={i}
                className="Header__genres__option"
                onClick={() => { if (i !== genres.length - 1) this.props.showGenre(genre); }}
            >
                {i !== genres.length - 1
                    ? genre.name.replace(/^./g, ch => ch.toUpperCase())
                    : <span
                        className="Header__genres__option__expand"
                        onClick={e => {
                            e.stopPropagation();
                            this.setState({ ...this.state, expanded: true });
                        }}
                    >show more...</span>}

                {i !== 9 && <span className="Header__genres__option__movies-with-genre"> {genre.moviesWithGenre}</span>}
            </div>
            );
        }

        // More than 10 genres and extended
        // Display 19 ,most freq and show less option
        if (genres.length >= 10 && this.state.expanded) {
            genres = genres
                .sort((prev, curr) => prev.moviesWithGenre < curr.moviesWithGenre) // sort genres by moviesWithGenre descending
                .slice(0, 19)                                                      // get first 20
                .sort((prev, curr) => prev.name > curr.name);                      // back to alphabethical order ascending
            genres = _.chunk(genres, 10);

            return <div>
                <div>
                    {genres[0].map((genre, i) => <div
                        key={i}
                        className="Header__genres__option--expanded"
                        onClick={() => { this.props.showGenre(genre); }}
                    >
                        {genre.name.replace(/^./g, ch => ch.toUpperCase())}

                        <span className="Header__genres__option__movies-with-genre"> {genre.moviesWithGenre}</span>
                    </div>)}
                </div>

                <div className="genre-separator"></div>

                <div>
                    {genres[1].map((genre, i) => <div
                        key={i}
                        className="Header__genres__option"
                        onClick={() => { if (i !== genre.length - 1) this.props.showGenre(genre); }}
                    >
                        {i !== genres[1].length - 1
                            ? genre.name.replace(/^./g, ch => ch.toUpperCase())
                            : <span
                                className="Header__genres__option__expand"
                                onClick={e => {
                                    e.stopPropagation();
                                    this.setState({ ...this.state, expanded: false });
                                }}
                            >show less...</span>}

                        {i !== genres[1].length - 1 && <span className="Header__genres__option__movies-with-genre"> {genre.moviesWithGenre}</span>}
                    </div>
                    )}
                </div>
            </div>

        }

        // Less than 10 genres
        return genres.map((genre, i) => <div key={i} className={"Header__genres__option"}>
            {genre.name.replace(/^./g, ch => ch.toUpperCase())}

            <span className="Header__genres__option__movies-with-genre"> {genre.moviesWithGenre}</span>
        </div>
        );
    }



    render() {
        return (
            this.props.genres ?
                <div
                    id="Header__genres__options"
                    className={this.state.expanded ? "Header__genres__options--expanded" : ""}
                    style={{ visibility: this.props.visible ? "visible" : "hidden" }}>

                    {this.renderGenreOptions(this.props.genres || [])}
                </div>
                : <div
                    id="Header__genres--loading"
                    style={{ visibility: this.props.visible ? "visible" : "hidden" }}>
                    Genres loading...

                    <LoadingSpinner isLoading={true} />
                </div>
        );
    }
}