import React, { Component } from 'react';
import Admin from "../Admin/Admin";
import Header from "../Header/Header";
import Movie from "../Movie/Movie";
import LazyLoad from "react-lazy-load";
import './App.scss';
import _ from "lodash";


export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      movies: []
    }
  }


  async componentDidMount() {
    const response = await fetch("/api/movies");
    let movies = await response.json();

    this.setState({ ...this.state, movies: _.shuffle(movies) });
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
            user={this.state.user} />
        </div>

        <div className="movies">
          {this.renderRandomMovies()}
        </div>

        <div className="App__admin">
          {this.state.showAdmin &&
            <Admin
              user={this.state.user}
              showAdmin={this.showAdmin.bind(this)} />}
        </div>
      </div>
    );
  }
};
