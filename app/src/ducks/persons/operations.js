import { schema, normalize } from 'normalizr'
import { createAction } from 'redux-api-middleware'
import types from './types'

const personSchema = new schema.Entity('persons')
const personListSchema = new schema.Array(personSchema)

export const getPersonsList = () => {
    return createAction({
        endpoint: 'http://localhost:5000/api/persons',
        method: 'GET',
        headers: {
         'Content-Type': 'application/json'
        },
        types: [
            types.PERSONS_LIST_REQUEST,
            {
                 type: types.PERSONS_LIST_SUCCESS,
                 payload: async (action, state, res) => {
                     const json = await res.json();
                     const { entities } = normalize(json, personListSchema)
                     return entities;
                 },
                 meta: { actionType: 'GET_ALL' }
            },
            types.PERSONS_LIST_FAILURE
        ]
    })
 }

 export const getPersonById = (id) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${id}`,
        method: 'GET',
        headers: {
         'Content-Type': 'application/json'
        },
        types: [
            types.PERSONS_LIST_REQUEST,
            {
                 type: types.PERSONS_LIST_SUCCESS,
                 payload: async (action, state, res) => {
                     const json = await res.json();
                     const { entities } = normalize(json, personSchema)
                     return entities;
                 },
                 meta: { actionType: 'GET_ONE' }
            },
            types.PERSONS_LIST_FAILURE
        ]
    })
 }

 export const postPerson = (person) => {
    return createAction({
        endpoint: "http://localhost:5000/api/persons",
        method: 'POST',
        headers: {
           'Content-Type': 'application/json'
          },
       body: JSON.stringify(person),
       types: [
           types.PERSONS_ADD_REQUEST,
           {
               type: types.PERSONS_ADD_SUCCESS,
               payload: async (action, state, res) => {
                   const json = await res.json();
                   const { entities } = normalize(json, personSchema)
                   return entities;
               },
               meta: { actionType: 'ADD' }
           },
           types.PERSONS_ADD_FAILURE
       ]
    })
}

export const updatePerson = (person, id) => {
   return createAction({
       endpoint: `http://localhost:5000/api/persons/${id}`,
       method: 'PUT',
       headers: {
          'Content-Type': 'application/json'
         },
      body: JSON.stringify(person),
      types: [
          types.PERSONS_EDIT_REQUEST,
          {
              type: types.PERSONS_EDIT_SUCCESS,
              payload: async (action, state, res) => {
                  const json = await res.json();
                  const { entities } = normalize({...json, id: parseInt(id)}, personSchema)
                  return entities;
              },
              meta: { actionType: 'UPDATE' }
          },
          types.PERSONS_EDIT_FAILURE
      ]
   })
}

export const deletePerson = (person) => {
    return createAction({
        endpoint: `http://localhost:5000/api/persons/${person.id}`,
        method: 'DELETE',
        headers: {
           'Content-Type': 'application/json'
          },
       types: [
           types.PERSONS_DELETE_REQUEST,
           {
               type: types.PERSONS_DELETE_SUCCESS,
               payload: {
                   persons: {
                       [person.id]: {
                           ...person
                       }
                   }
               },
               meta: { actionType: 'DELETE' }
           },
           types.PERSONS_DELETE_FAILURE
       ]
    })
}
