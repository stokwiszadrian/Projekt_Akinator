export const selectMovies = (state) => {
    return state.entities.movies.allIds.map(id => state.entities.movies.byId[id]);
}

export const selectMovieById = (state, id) => {
    return [state.entities.movies.byId[id]];
}

export const selectMoviesLoaded = (state) => {
    return state.entities.movies.loaded
}

export const selectMoviesLoading = (state) => {
    return state.entities.movies.loading
}

export const selectMovieGenres = (state) => {
    return [
        ...new Set(
            state.entities.movies.allIds
            .map(id => state.entities.movies.byId[id])
            .reduce(
                (acc, cur) => [...acc, ...cur.genre.split("/")], [])
            .sort(
                (a, b) => a > b ? 1 : -1)
            )
        ]
}

export const selectMovieError = (state) => {
    return state.entities.movies.error
}