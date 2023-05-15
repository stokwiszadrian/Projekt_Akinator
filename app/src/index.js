import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Navigate } from 'react-router';
import { Routes, Route, BrowserRouter} from 'react-router-dom';
import GameComp from './ui/GameComp'
import MainComp from './ui/MainComp';
import AboutComp from './ui/AboutComp';

ReactDOM.render(
  <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} >
          <Route path="/" exact element={<Navigate replace to="/main" />} />
          <Route path="main" element={<MainComp />} />
          <Route path="game" element={<GameComp />} />
          <Route path="about" element={<AboutComp />} />
        </Route>
      </Routes>
    </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
