import React, { Component } from 'react';
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./ShoppingCart.scss";



export default class ShoppingCart extends Component {
    constructor(props) {
        super(props);

        this.state = { preventOnBlur: false, isLoading: false }
    }



    componentDidUpdate() {
        this.shoppingCart.focus();
    }



    handleRentBtnClick() {
        console.log("CHECK STOCK...");
        this.setState({ ...this.state, isLoading: true });
        this.props.updateMoviesInStock() // in case any of the movies would run out of stock
            .then(numOfMoviesOutOfStock => {
                this.setState({ ...this.state, isLoading: false });
                console.log("RESULT FROM PROMISE", numOfMoviesOutOfStock);
                if (numOfMoviesOutOfStock === 0) {
                    console.log("RENT");
                }
            });
        return false;
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
                                <div className={"ShoppingCart__title " + (m.inStock < 1 ? "ShoppingCart__title--out-of-stock" : "")}>
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
                                disabled={this.props.movies.filter(m => m.inStock <= 0).length}
                                onMouseEnter={() => this.setState({ ...this.state, preventOnBlur: true })}
                                onMouseLeave={() => this.setState({ ...this.state, preventOnBlur: false })}
                                onClick={() => this.handleRentBtnClick()}
                            >Rent</button>
                        </div>
                        {this.props.movies.filter(m => m.inStock <= 0).length > 0 && <div className="ShoppingCart__out-of-stock-msg">One or more item is currently out of stock!</div>}
                    </div>}
            </div>
        );
    }
}