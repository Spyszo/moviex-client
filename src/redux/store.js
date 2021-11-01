import { createStore } from 'redux';

const params = new URLSearchParams(window.location.search)
const type = params.get("type")
const id = params.get("id")

let initialMovieDetailsVisibility = "hidden"
let initialTvSeriesDetailsVisibility = "hidden"

if (id && type === "movie") {
    initialMovieDetailsVisibility = "visible"
}

if (id && type === "tvseries") {
    initialTvSeriesDetailsVisibility = "visible"
}


const initialState = {
    backdrop_path: "",
    tvseries_backdrop: "",
    movies_backdrop: "",
    movieDetailsVisibility: initialMovieDetailsVisibility,
    tvSeriesDetailsVisibility: initialTvSeriesDetailsVisibility, 
    playerVisibility: "hidden",
    playerData: {},
    scrolling: false,
    movieCollection: [],
    tvSeriesCollection: [],
    userData: null
};

function reducer(state = initialState, action) {
    switch (action.type) {
        case 'CHANGE_BACKDROP':
            return {
                ...state,
                backdrop_path: action.backdrop_path,
            };
        case 'CHANGE_TVSERIES_BACKDROP': {
            return {
                ...state,
                tvseries_backdrop: action.backdrop_path
            };
        }
        case 'CHANGE_MOVIES_BACKDROP': {
            return {
                ...state,
                movies_backdrop: action.backdrop_path
            };
        }
        case 'SET_TVSERIES_BACKDROP': {
            if (state.backdrop_path === "") {
                return null;
            } else {
                return {
                    ...state,
                    backdrop_path: state.tvseries_backdrop,
                };
            }
        }
        case 'SET_MOVIES_BACKDROP': {
            if (state.backdrop_path === "") {
                return null;
            } else {
                return {
                    ...state,
                    backdrop_path: state.movies_backdrop,
                };
            }
        }
        case 'TOGGLE_MOVIEDETAILS': {
            return {
                ...state,
                movieDetailsVisibility: action.visibility
            };
        }
        case 'TOGGLE_TVSERIESDETAILS': {
            return {
                ...state,
                tvSeriesDetailsVisibility: action.visibility
            };
        }
        case 'MOVIELIST-SCROLL': {
            return {
                ...state,
                scrolling: action.scrolling
            }
        }
        case 'TOGGLE_PLAYER': {
            return {
                ...state,
                playerVisibility: action.visibility,
                playerData: action.data
            }
        }

        case 'SET_USERDATA': {
            return {
                ...state,
                userData: action.data
            }
        }
        case 'MOVIECOLLECTION_SET': {
            return {
                ...state,
                movieCollection: action.data
            }
        }
        case 'MOVIECOLLECTION_ADD': {
            const newMovieCollection = state.movieCollection;
            newMovieCollection.push(action.movieID)
            return {
                ...state,
                movieCollection: newMovieCollection
            }
        }
        case 'MOVIECOLLECTION_REMOVE': {
            const newMovieCollection = state.movieCollection.filter(movie=> movie !== action.movieID);
            return {
                ...state,
                movieCollection: newMovieCollection
            }
        }

        case 'TVSERIESCOLLECTION_SET': {
            return {
                ...state,
                tvSeriesCollection: action.data
            }
        }
        case 'TVSERIESCOLLECTION_ADD': {
            const newTvSeriesCollection = state.tvSeriesCollection;
            newTvSeriesCollection.push(action.tvSeriesID)
            return {
                ...state,
                tvSeriesCollection: newTvSeriesCollection
            }
        }
        case 'TVSERIESCOLLECTION_REMOVE': {
            const newTvSeriesCollection = state.tvSeriesCollection.filter(tvSeries=> tvSeries !== action.tvSeriesID);
            return {
                ...state,
                tvSeriesCollection: newTvSeriesCollection
            }
        }
        default:
            return state;
    }
}

const store = createStore(reducer);

export default store;