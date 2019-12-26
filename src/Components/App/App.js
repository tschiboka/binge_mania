import React, { Component } from 'react';
import Admin from "../Admin/Admin";
import Header from "../Header/Header";
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MovieCollection from "../MovieCollection/MovieCollection";
import MovieDetails from "../MovieDetails/MovieDetails";
import History from "../History/History";
import Footer from "../Footer/Footer";
import { Scrollbars } from 'react-custom-scrollbars';
import './App.scss';
import _ from "lodash";



const CustomScrollbars = props => (
  <Scrollbars
    renderThumbHorizontal={renderThumb}
    renderThumbVertical={renderThumb}
    {...props}
  />
);



const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    width: 6,
    backgroundColor: "deeppink",
    right: 3,
    zIndex: 2000
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};




export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      movies: [],
      loading: true,
      cart: [],
      showAllMoviesWithCertainGenre: false,
      showHistory: false,
    }
  }



  async componentDidMount() {
    const response = await fetch("/api/movies");
    let movies = await response.json();

    this.setState({ ...this.state, movies: _.shuffle(movies), loading: false });
  }



  componentDidUpdate() {
    if (!this.state.movies.length || this.state.categories) return;


    const YEAR = new Date().getFullYear();
    const categories = {
      currentYearMovies: this.state.movies.filter(m => m.year === YEAR),
      lastYearMovies: this.state.movies.filter(m => m.year === YEAR - 1),
      lowStockMovies: _.chunk(this.state.movies.sort((prev, curr) => prev.inStock - curr.inStock).filter(m => m.inStock), 30)[0],
      highStockMovies: _.chunk(this.state.movies.sort((prev, curr) => prev.inStock < curr.inStock), 30)[0],
      todaysPicksMovies: _.chunk(_.shuffle(this.state.movies), 22)[0],
      suspenseMovies: _.chunk(this.state.movies.filter(m => m.genres.includes("Horror") || m.genres.includes("Thriller")), 33)[0],
      dramaMovies: _.chunk(this.state.movies.filter(m => m.genres.includes("Drama")), 20)[0],
      fromThe90sMovies: _.chunk(this.state.movies.filter(m => m.year >= 1990 && m.year < 2000), 30)[0],
      fromThe2000Movies: _.chunk(this.state.movies.filter(m => m.year >= 2000 && m.year < 2010), 30)[0],
      comedyMovies: _.chunk(this.state.movies.filter(m => m.genres.includes("Comedy")), 20)[0],
      actionMovies: _.chunk(this.state.movies.filter(m => m.genres.includes("Action")), 20)[0],
      crimeMovies: _.chunk(this.state.movies.filter(m => m.genres.includes("Crime")), 20)[0]
    }

    this.setState({ ...this.state, categories: categories });
  }



  login(user) { if (user) this.setState({ ...this.state, user: JSON.parse(user) }); }



  logout() { this.setState({ ...this.state, user: {}, showAdmin: false }); }



  showAdmin(adminIsVisible) { this.setState({ ...this.state, showAdmin: adminIsVisible }); }



  showMovieDetails(isVisible, movie) { this.setState({ ...this.state, showMovieDetails: isVisible, movieDetails: movie }); }



  addToCart(movie) {
    const newCart = [...this.state.cart];
    newCart.push(movie);
    this.setState({ ...this.state, cart: newCart, showMovieDetails: false });
  }



  removeFromCart(_id) { this.setState({ ...this.state, cart: this.state.cart.filter(m => m._id !== _id) }); }



  emptyCart() { this.setState({ ...this.state, cart: [] }); }



  updateMoviesInStock() {
    return Promise.all(
      this.state.cart.map(async movie => {
        const response = await fetch("/api/movies/" + movie.title);
        return await response.json();
      }))
      .then(updatedMovie => {
        this.setState({ ...this.state, cart: updatedMovie });
        return updatedMovie.filter(m => m.inStock <= 0).length; // return the length of out of stock movies
      });
  }



  openHistory(isOpen) { this.setState({ ...this.state, showHistory: isOpen }) }



  renderRandomMovies() {
    return this.state.movies.map((movie, i) =>
      <LazyLoad
        key={`movies${i}`}
        debounce={false}
      >
        <Movie movie={movie} />
      </LazyLoad>
    );
  }



  renderMoviesByGenre(genre) {
    const movies = this.state.movies.filter(movie => movie.genres.map(g => g.toLowerCase()).includes(genre));

    return movies.map((movie, i) =>
      <LazyLoad
        key={`moviesWithGenre${genre}${i}`}
        debounce={false}
      >
        <Movie movie={movie} selfContained={true} showMovieDetails={this.showMovieDetails.bind(this)} />
      </LazyLoad>
    );
  }



  showMoviesByGenre(genre) { this.setState({ ...this.state, showAllMoviesWithCertainGenre: genre }); }



  async refreshMovies() {
    const response = await fetch("/api/movies");
    let movies = await response.json();

    this.setState({ ...this.state, movies: _.shuffle(movies), loading: false });
  }



  render() {
    return (
      <div className="App">
        <div className={"App__main" + (this.state.showAdmin || this.state.showMovieDetails || this.state.showHistory ? " blurred" : "")}>
          <CustomScrollbars
            autoHide autoHideTimeout={500}
            autoHideDuration={200}
          >
            <Header
              login={this.login.bind(this)}
              logout={this.logout.bind(this)}
              showAdmin={this.showAdmin.bind(this)}
              user={this.state.user}
              movies={this.state.cart}
              remove={this.removeFromCart.bind(this)}
              showGenre={this.showMoviesByGenre.bind(this)}
              updateMoviesInStock={this.updateMoviesInStock.bind(this)}
              emptyCart={this.emptyCart.bind(this)}
              openHistory={this.openHistory.bind(this)}
            />
            {this.state.categories && !this.state.showAllMoviesWithCertainGenre &&
              <div
                className="App__content"
              >
                <MovieCollection collectionName="Latest Release" movies={this.state.categories.currentYearMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="High Stock Movies" movies={this.state.categories.highStockMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Todays Pick" movies={this.state.categories.todaysPicksMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Suspense" movies={this.state.categories.suspenseMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="From Last Year" movies={this.state.categories.lastYearMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Comedy" movies={this.state.categories.comedyMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="From 2000s" movies={this.state.categories.fromThe2000Movies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Dramas" movies={this.state.categories.dramaMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Action" movies={this.state.categories.actionMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="From the 90s" movies={this.state.categories.fromThe90sMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Crime" movies={this.state.categories.crimeMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <MovieCollection collectionName="Last Pieces" movies={this.state.categories.lowStockMovies} showMovieDetails={this.showMovieDetails.bind(this)} />

                <Footer />
              </div>
            }
            {
              this.state.showAllMoviesWithCertainGenre &&
              <div
                className="App__movies-by-genre"
                tabIndex={0}
                ref={elem => (this.main = elem)}
              >
                <div className="App__movies-by-genre__title">{this.state.showAllMoviesWithCertainGenre.name.toUpperCase()}</div>

                <div className="App__movies-by-genre__movies">
                  {this.renderMoviesByGenre(this.state.showAllMoviesWithCertainGenre.name)}
                </div>

                <div className="App__movies-by-genre__back-btn">
                  <button onClick={() => this.setState({ ...this.state, showAllMoviesWithCertainGenre: false })}>&larr; Back to Browse</button>
                </div>

                <Footer />
              </div>
            }
          </CustomScrollbars>
        </div>

        {this.state.showMovieDetails &&
          <MovieDetails
            showMovieDetails={this.showMovieDetails.bind(this)}
            movie={this.state.movieDetails}
            add={this.addToCart.bind(this)}
            cart={this.state.cart}
          />
        }

        {this.state.showHistory &&
          <History
            user={this.state.user}
            closeHistory={this.openHistory.bind(this)}
          />
        }

        <div className="App__admin">
          {this.state.showAdmin &&
            <Admin
              user={this.state.user}
              showAdmin={this.showAdmin.bind(this)}
              refreshMovies={this.refreshMovies.bind(this)}
              movies={this.state.movies} />}
        </div>

        <LoadingSpinner isLoading={this.state.loading} />
      </div>
    );
  }
};