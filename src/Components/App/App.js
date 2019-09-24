import React, { Component } from 'react';
import './App.scss';

import Header from "../Header/Header";

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
  }



  render() {
    return (
      <div className="App">
        <Header />

        <div>{this.state.greeting}</div>
      </div>
    );
  }
};
