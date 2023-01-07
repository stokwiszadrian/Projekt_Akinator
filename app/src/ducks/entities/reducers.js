import * as _ from 'lodash';

const allEntities = [
    "persons",
    "movies",
    "actors"
];

const defaultState = allEntities.reduce(
    (acc, entity) => ({
        ...acc,
        [entity]: {
            byId: {},
            allIds: [],
            loading: false,
            loaded: false,
            loadedOne: false,
            error: {}
        }
    }), {}
);

export const entityReducer = (entity, state = { allIds: [], byId: {}, loading: true, loaded: false, loadedOne: false, error: {} }, action) => {

    if (action.type.includes("REQUEST")) {
        return {
            ...state,
            loading: true
        }
    }

    if (action.type.includes("FAILURE")) {
        return {
            ...state,
            error: {
                name: action.payload.name,
                message: action.payload.message + `(affected entity: ${entity})` 
            }
        }
    }

    const actionEntities = action.payload[entity];
    const { actionType } = action.meta

    switch(actionType) {
        case 'GET_ONE':
            return {
                ...state,
                byId: {
                    ...Object.keys(actionEntities).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: {
                                ...state.byId[id],
                                ...actionEntities[id]
                            }
                        })
                    , {}),
                },
                allIds: Object.keys(actionEntities),
                loaded: false,
                loading: false
            }

        case 'GET_ALL':
            return {
                ...state,
                byId: {
                    ...Object.keys(actionEntities).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: {
                                ...state.byId[id],
                                ...actionEntities[id]
                            }
                        })
                    , {}),
                },
                allIds: Object.keys(actionEntities),
                loading: false,
                loaded: true
            }

        case 'ADD':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...Object.keys(actionEntities).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: {
                                ...state.byId[id],
                                ...actionEntities[id]
                            }
                        })
                    , {}),
                },
                allIds: [...state.allIds, ...Object.keys(actionEntities)],
                loading: false
            }
        
        case 'DELETE':
            return {
                ...state,
                byId: _.omit(state.byId, actionEntities),
                allIds: state.allIds.filter(id => !Object.keys(actionEntities).includes(id)),
                loading: false
            }
            
        case 'UPDATE':
            return {
                ...state,
                byId: {
                    ...state.byId,
                    ...Object.keys(actionEntities).reduce(
                        (acc, id) => ({
                            ...acc,
                            [id]: {
                                ...state.byId[id],
                                ...actionEntities[id]
                            }
                        })
                    , {}),
                },
                loading: false
            }

        default:
            console.log('Error action not recognized');
            return state;
    }
    
}


export const entities = (state = defaultState, action) => {
    if (action.type.includes("REQUEST") || action.type.includes("FAILURE")){
        const entity = action.type.split("_")[0].toLowerCase()
        return {
            ...state,
            [entity]: entityReducer(entity, state[entity], action)
        }
    }
    if((!action.meta || !action.meta.actionType)) return state;
    return {
        ...state,
        ...Object.keys(action.payload).reduce(
            (acc, entity) => ({
                ...acc,
                [entity]: entityReducer(entity, state[entity], action)
            }), {}
        ),
    }
}