import React from 'react';
import logo from './logo.svg';
import './App.css';
import './theme.css';
import Index from "./components/index"
import About from "./components/about"
import Contact from "./components/contact"
import Project from "./components/project"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";


function App() {
  return (
    <Router>
      <Route exact path = "/project/:projectHandle" component = { Project }/>
      <Route exact path = "/" component = { Index }/>
      <Route exact path = "/index" component = { Index }/>
      <Route exact path = "/projects" component = { Index }/>
      <Route exact path = "/projects/:projectHandle" component = { Index }/>
      <Route exact path = "/about" component = { About }/>
      <Route exact path = "/contact" component = { Contact }/>
    </Router>
  );
}

export default App;
