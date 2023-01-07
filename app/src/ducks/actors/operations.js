import types from './types'
import { schema, normalize } from 'normalizr'
import { createAction } from 'redux-api-middleware'

const actorSchema = new schema.Entity('actors')
const actorListSchema = new schema.Array(actorSchema)

export const getActorList = () => {
    return createAction({
        endpoint: 'http://localhost:5000/api/actors',
        method: 'GET',
        headers: {
         'Content-Type': 'application/json'
        },
        types: [
            types.ACTORS_LIST_REQUEST,
            {
                 type: types.ACTORS_LIST_SUCCESS,
                 payload: async (action, state, res) => {
                     const json = await res.json();
                     const { entities } = normalize(json, actorListSchema)
                     return entities;
                 },
                 meta: { actionType: 'GET_ALL' }
            },
            types.ACTORS_LIST_FAILURE
        ]
    })
 }

 export const postActors = (actor, movieId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/actors`,
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
          },
       body: JSON.stringify(actor),
       types: [
           types.ACTORS_ADD_REQUEST,
           {
               type: types.ACTORS_ADD_SUCCESS,
               payload: async (action, state, res) => {
                   const json = await res.json();
                   const { entities } = normalize(json, actorSchema)
                   return entities;
               },
               meta: { actionType: 'ADD' }
           },
           types.ACTORS_ADD_FAILURE
       ]
    })
}

export const deleteActor = (actorId, personId, movieId) => {
    return createAction({
        endpoint: `http://localhost:5000/api/movies/${movieId}/actors/${personId}`,
        method: 'DELETE',
        headers: {
           'Content-Type': 'application/json'
          },
       types: [
           types.ACTORS_DELETE_REQUEST,
           {
               type: types.ACTORS_DELETE_SUCCESS,
               payload: {
                   actors: {
                       [actorId]: {
                           id: actorId,
                           movie_id: movieId,
                           actor_id: actorId
                       }
                       
                   }
               },
               meta: { actionType: 'DELETE' }
           },
           types.ACTORS_DELETE_FAILURE
       ]
    })
}
