export const selectPersons = (state) => {
    return state.entities.persons.allIds.map(id => state.entities.persons.byId[id]);
}

export const selectPersonById = (state, id) => {
    return [state.entities.persons.byId[id]]
}

export const selectPersonsLoaded = (state) => {
    return state.entities.persons.loaded
}

export const selectPersonsLoading = (state) => {
    return state.entities.persons.loading
}

export const selectDirectedMovies = (state, directorId) => {
    return state.entities.movies.allIds
    .map(id => state.entities.movies.byId[id])
    .filter(movie => movie.director_id === directorId)
}

export const selectPersonsError = (state) => {
    return state.entities.persons.error
}