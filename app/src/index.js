import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './ducks/store'
import { Provider } from 'react-redux';
import { Navigate } from 'react-router';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import PersonList from './ui/GameComp'
import MovieList from './ui/MainComp';
import AboutPage from './ui/AboutComp';

ReactDOM.render(
  <Provider store={store}>
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="/" exact element={<Navigate replace to="/main" />} />
          <Route path="main" element={<MovieList />} />
          <Route path="game" element={<PersonList />} />
          <Route path="about" element={<AboutPage />} />
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
