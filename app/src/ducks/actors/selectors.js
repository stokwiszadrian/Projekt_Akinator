export const selectActors = (state) => {
    return state.entities.actors.allIds.map(id => state.entities.actors.byId[id])
}

export const selectActorByMovieId = (state, movieId) => {
    return state.entities.actors.allIds.map(id => state.entities.actors.byId[id]).filter(actor => actor.movie_id === movieId)
}

export const selectMoviesByActorId = (state, actorId) => {
    return state.entities.actors.allIds
        .map(id => state.entities.actors.byId[id])
        .filter(actor => actor.person_id === actorId)
        .map(actor => state.entities.movies.byId[actor.movie_id])
}

export const selectActorsByPersonId = (state, personId) => {
    return state.entities.actors.allIds.map(id => state.entities.actors.byId[id]).filter(actor => actor.person_id === personId)
}

export const selectActorsLoaded = (state) => {
    return state.entities.actors.loaded
}

export const selectActorsLoading = (state) => {
    return state.entities.actors.loading
}

export const selectActorsError = (state) => {
    return state.entities.actors.error
}