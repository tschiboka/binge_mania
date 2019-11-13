import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./ShoppingCart.scss";



export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = { preventOnBlur: false, isLoading: true }
    }



    componentDidUpdate() { this.shoppingCart.focus(); }



    handleRentBtnClick() {
        this.props.updateMoviesInStock() // in case any of the movies would run out of stock
            .then(res => console.log("HERE"));
    }



    render() {
        return (
            <div
                id="ShoppingCart"
                style={{ visibility: this.props.visible ? "visible" : "hidden" }}
                onBlur={() => { if (!this.state.preventOnBlur) this.props.blur() }}
                tabIndex={0}
                ref={elem => (this.shoppingCart = elem)} // give focus in order to be able to call onBlur
            >
                <LoadingSpinner isLoading={this.state.isLoading} />
                <ul className="ShoppingCart__movies">
                    {(this.props.movies && this.props.movies.length)
                        ? this.props.movies.map((m, i) =>
                            <li
                                key={"ShoppingCartMovies" + i}
                                className="ShoppingCart__movie"
                            >
                                <div className="ShoppingCart__title">
                                    {m.title}
                                </div>

                                <div className="ShoppingCart__price">
                                    £{((300 - m.inStock) / 100).toFixed(2)}

                                    <button
                                        onClick={() => this.props.remove(m._id)}
                                        onMouseEnter={() => this.setState({ ...this.state, preventOnBlur: true })}
                                        onMouseLeave={() => this.setState({ ...this.state, preventOnBlur: false })}
                                    >&times;</button>
                                </div>
                            </li>)
                        : "Shopping Cart Is Empty..."}
                </ul>
                {this.props.movies.length > 0 &&
                    <div className="ShoppingCart__final">
                        <div className="ShoppingCart__total">Total:
                            <span>£
                            {this.props.movies
                                    .map(m => (300 - m.inStock) / 100)
                                    .reduce((accu, curr) => accu + curr)
                                    .toFixed(2)}
                            </span>
                        </div>
                        <div className="ShoppingCart__rent-btn">
                            <button
                                onMouseEnter={() => this.setState({ ...this.state, preventOnBlur: true })}
                                onMouseLeave={() => this.setState({ ...this.state, preventOnBlur: false })}
                                onClick={() => this.handleRentBtnClick()}
                            >Rent</button>
                        </div>
                    </div>}
            </div>
        );
    }
}