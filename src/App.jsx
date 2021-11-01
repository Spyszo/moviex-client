import React from 'react';
import Header from './components/Header/Header'
import Search from './components/Search'
import './css/style.scss'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import HomePage from "./components/Pages/HomePage/HomePage"
import BackdropImage from "./components/BackdropImage"
import MovieDetails from "./components/Details/MovieDetails"
import TvSeriesDetails from './components/Details/TvSeriesDetails';
import VideoPlayer from './components/VideoPlayer';
import ActivateAccount from "./components/ActivateAccount"
import Collection from "./components/Pages/Collection/Collection"
import { CSSTransition, TransitionGroup } from 'react-transition-group'


export default function App() {
  //const isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0));

  return (
      <Router>
        <BackdropImage />
        <Header />

        <Route render={( {location} ) => {
          const { pathname } = location
          return (
            <div style={{position: "relative"}}>
            <TransitionGroup>
              <CSSTransition
                in={true}
                classNames="page"
                key={pathname}
                appear={true}
                timeout={600}
                unmountOnExit
              >
                <Switch location={location}>
                  <Route exact path="/" component={HomePage} />
                  <Route path="/search/:title" component={Search} />
                  <Route path="/collection" component={Collection} />
                </Switch>
              </CSSTransition>
            </TransitionGroup>
            </div>
          )
        }}
        
        />

        <MovieDetails />
        <TvSeriesDetails />
        <VideoPlayer />

        <ActivateAccount />
      </Router>
  );
}
