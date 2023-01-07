import types from './types'
import { schema, normalize } from 'normalizr'
import { createAction } from 'redux-api-middleware'

const movieSchema = new schema.Entity('movies')
const movieListSchema = new schema.Array(movieSchema)

export const getMoviesList = () => {
    return createAction({
        endpoint: 'http://localhost:5000/api/movies',
        method: 'GET',
        headers: {
         'Content-Type': 'application/json'
        },
        types: [
            types.MOVIES_LIST_REQUEST,
            {
                 type: types.MOVIES_LIST_SUCCESS,
                 payload: async (action, state, res) => {
                     const json = await res.json();
                     const { entities } = normalize(json, movieListSchema)
                     return entities;
                 },
                 meta: { actionType: 'GET_ALL' }
            },
            types.MOVIES_LIST_FAILURE
        ]
    })
 }

 export const getMovieById = (id) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${id}`,
        method: 'GET',
        headers: {
         'Content-Type': 'application/json'
        },
        types: [
            types.MOVIES_LIST_REQUEST,
            {
                 type: types.MOVIES_LIST_SUCCESS,
                 payload: async (action, state, res) => {
                     const json = await res.json();
                     const { entities } = normalize(json, movieSchema)
                     return entities;
                 },
                 meta: { actionType: 'GET_ONE' }
            },
            types.MOVIES_LIST_FAILURE
        ]
    })
 }

 export const postMovie = (movie) => {
     return createAction({
         endpoint: "http://localhost:5000/api/movies",
         method: 'POST',
         headers: {
            'Content-Type': 'application/json'
           },
        body: JSON.stringify(movie),
        types: [
            types.MOVIES_ADD_REQUEST,
            {
                type: types.MOVIES_ADD_SUCCESS,
                payload: async (action, state, res) => {
                    const json = await res.json();
                    const { entities } = normalize(json, movieSchema)
                    return entities;
                },
                meta: { actionType: 'ADD' }
            },
            types.MOVIES_ADD_FAILURE
        ]
     })
 }

 export const updateMovie = (movie, id) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${id}`,
        method: 'PUT',
        headers: {
           'Content-Type': 'application/json'
          },
       body: JSON.stringify(movie),
       types: [
           types.MOVIES_EDIT_REQUEST,
           {
               type: types.MOVIES_EDIT_SUCCESS,
               payload: async (action, state, res) => {
                   const json = await res.json();
                   const { entities } = normalize({...json, director_id: parseInt(json.director_id)}, movieSchema)
                   return entities;
               },
               meta: { actionType: 'UPDATE' }
           },
           types.MOVIES_EDIT_FAILURE
       ]
    })
}

export const deleteMovie = (movie) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movie.id}`,
        method: 'DELETE',
        headers: {
           'Content-Type': 'application/json'
          },
       types: [
           types.MOVIES_DELETE_REQUEST,
           {
               type: types.MOVIES_DELETE_SUCCESS,
               payload: {
                   movies: {
                       [movie.id]: {
                           ...movie
                       }
                   }
               },
               meta: { actionType: 'DELETE' }
           },
           types.MOVIES_DELETE_FAILURE
       ]
    })
}

export const patchMovieDirector = (movie, directorId) => {
    const action = {
        endpoint: `http://localhost:5000/api/movies/${movie.id}/director`,
        method: 'PATCH',
        headers: {
           'Content-Type': 'application/json'
          },
       types: [
           types.MOVIES_EDIT_REQUEST,
           {
               type: types.MOVIES_EDIT_SUCCESS,
               payload: {
                   movies: {
                       [movie.id]: {
                           ...movie,
                           director_id: directorId
                       }
                   }
               },
               meta: { actionType: 'UPDATE' }
           },
           types.MOVIES_EDIT_FAILURE
       ]
    }
    return directorId === null ? createAction(action) : createAction({...action, body: { id: directorId} })
}
