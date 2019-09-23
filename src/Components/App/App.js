import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
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
      </div>
    );
  }
};
