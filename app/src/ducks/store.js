import thunk from 'redux-thunk';
import {createStore, applyMiddleware, combineReducers} from 'redux';
import logger from 'redux-logger';
import { entities } from './entities/reducers';
import { createMiddleware } from 'redux-api-middleware';


const combinedReducers = combineReducers({
    entities: entities
  });

const store = createStore(combinedReducers, 
    applyMiddleware(createMiddleware(), thunk, logger)
  );

export default store;