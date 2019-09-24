import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }



  componentDidMount() {
    const greeting = async () => {
      try {
        const response = await fetch("/home");
        const greeting = await response.text();
        const newState = this.state;
        newState.greeting = greeting;
        this.setState(newState);
      } catch (exp) { console.error("ERROR WHILE FETCHING GREETINGS\n", exp); }
    }
    greeting();

    const getGenres = async () => {
      try {
        const response = await fetch("/api/genres");
        const genres = await response.text();
        const newState = this.state;
        newState.genres = genres.split(",");
        this.setState(newState);
      } catch (exp) { console.error("ERROR WHILE FETChiNG GENRES\n" + exp) }
    }
    getGenres();
  }



  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div className="App-header__logo">Binge Mania</div>

          <div className="App-header__icons">
            <div className="App-header__icons__genres">Genres</div>

            <div className="App-header__icons__shopping-cart">Cart</div>

            <div className="App-header__icons__user">User</div>
          </div>
        </header>

        <div>{this.state.greeting}</div>

        <div>{this.state.genres}</div>
      </div>
    );
  }
};
