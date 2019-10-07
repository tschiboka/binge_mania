import React, { Component } from 'react';
import './App.scss';

import Header from "../Header/Header";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    }
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
  }



  login(user) { if (user) this.setState({ ...this.state, user: JSON.parse(user) }); }



  logout() { this.setState({ ...this.state, user: {} }); }



  render() {
    return (
      <div className="App">
        <Header login={this.login.bind(this)} logout={this.logout.bind(this)} />

        <div>{this.state.greeting}</div>

        <img src="http://image.tmdb.org/t/p/w185//adw6Lq9FiC9zjYEpOqfq03ituwp.jpg" alt="fightclub" />

      </div>
    );
  }
};
