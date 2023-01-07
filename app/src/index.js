import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './ducks/store'
import { Provider } from 'react-redux';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import PersonList from './ui/persons/PersonList'
import MovieList from './ui/movies/MovieList';

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="main" element={<MovieList />} />
          <Route path="game" element={<PersonList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
