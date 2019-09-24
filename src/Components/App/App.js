import React, { Component } from 'react';
import './App.scss';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = { "greeting": "none" }
  }



  componentDidMount() {
    this.setState({ "greeting": "CSO" });
    fetch("/api/greeting")
      .then(res => res.json())
      .then(hi => this.setState({ "greeting": hi.greeting }))
      .catch(err => this.setState({ "greeting": "problemo" + err }));

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
        <div>
          {this.state.greeting}
        </div>
      </div>
    );
  }
};
