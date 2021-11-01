import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import store from './redux/store'
import { SnackbarProvider } from 'notistack';

import App from './App';

document.body.style.backgroundColor = null;

ReactDOM.render(
    <Provider store={store}>
        <SnackbarProvider maxSnack={3}>
            <App />
        </SnackbarProvider>
    </Provider>
,document.getElementById('root'));