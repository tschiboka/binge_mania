import React, { Component } from 'react';
import Admin from "../Admin/Admin";
import Header from "../Header/Header";
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import MovieCollection from "../MovieCollection/MovieCollection";
import './App.scss';
import _ from "lodash";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      movies: [],
      loading: true
    }
  }


  async componentDidMount() {
    const response = await fetch("/api/movies");
    let movies = await response.json();

    this.setState({ ...this.state, movies: _.shuffle(movies), loading: false });
  }



  login(user) { if (user) this.setState({ ...this.state, user: JSON.parse(user) }); }



  logout() { this.setState({ ...this.state, user: {}, showAdmin: false }); }



  showAdmin(adminIsVisible) { this.setState({ ...this.state, showAdmin: adminIsVisible }); }



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



  render() {
    return (
      <div className="App">
        <div className={"App__main" + (this.state.showAdmin ? " blurred" : "")}>
          <Header
            login={this.login.bind(this)}
            logout={this.logout.bind(this)}
            showAdmin={this.showAdmin.bind(this)}
            user={this.state.user}
          />
          <div className="App__content">
            <MovieCollection
              collectionName="Popular in th UK 1990's"
              movies={_.chunk(this.state.movies, 7)[0]}
            />

            {/*<div className="movies">{this.renderRandomMovies()}</div>*/}
          </div>
        </div>

        <div className="App__admin">
          {this.state.showAdmin &&
            <Admin
              user={this.state.user}
              showAdmin={this.showAdmin.bind(this)} />}
        </div>

        <LoadingSpinner isLoading={this.state.loading} />
      </div>
    );
  }
};