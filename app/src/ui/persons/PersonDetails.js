import { useEffect, useState } from "react"
import { useSelector, connect } from "react-redux"
import { useParams } from 'react-router-dom'
import { selectDirectedMovies, selectPersonById, selectPersonsLoading, selectPersonsError } from "../../ducks/persons/selectors"
import { deletePerson, getPersonById } from "../../ducks/persons/operations"
import { Link } from "react-router-dom"
import { Outlet, useLocation, useNavigate } from "react-router"
import { selectMoviesLoaded, selectMoviesLoading, selectMovieError } from "../../ducks/movies/selectors"
import { selectActorsByPersonId, selectActorsLoaded, selectActorsLoading, selectMoviesByActorId, selectActorsError } from "../../ducks/actors/selectors"
import { getMoviesList, patchMovieDirector } from "../../ducks/movies/operations"
import { deleteActor, getActorList } from "../../ducks/actors/operations"
import ErrorModal from "../modals/ErrorModal"
import { Button, Box, IconButton, Snackbar, Grid, Divider, ListItem, Typography, Stack } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import CloseIcon from '@mui/icons-material/Close'
import CheckModal from "../modals/CheckModal"
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

const PersonDetails = ({getPersonById, getMoviesList, getActorList, deleteActor, patchMovieDirector, deletePerson}, props) => {

    const { id } = useParams()
    const location = useLocation()
    const [openModal, setOpenModal] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const navigate = useNavigate()
    const persons = useSelector(state => selectPersonById(state, id))
    const movies = useSelector(state => selectMoviesByActorId(state, parseInt(id)))
    const actedIn = useSelector(state => selectActorsByPersonId(state, parseInt(id)))
    const directedMovies = useSelector(state => selectDirectedMovies(state, parseInt(id)))
    const moviesLoaded = useSelector(state => selectMoviesLoaded(state))
    const actorsLoaded = useSelector(state => selectActorsLoaded(state)) 
    const moviesLoading = useSelector(state => selectMoviesLoading(state))
    const personsLoading = useSelector(state => selectPersonsLoading(state))
    const actorsLoading = useSelector(state => selectActorsLoading(state))
    const moviesError = useSelector(state => selectMovieError(state))
    const personsError = useSelector(state => selectPersonsError(state))
    const actorsError = useSelector(state => selectActorsError(state))

    useEffect(() => {
        if (!persons[0] && !personsLoading){
            getPersonById(id)
        }
        else if (!moviesLoaded && !moviesLoading) {
            getMoviesList()
        }
        else if (!actorsLoaded && !actorsLoading) {
            getActorList()
        }
    }, [persons, getPersonById, actorsLoaded, getActorList, moviesLoaded, getMoviesList, id, personsLoading, actorsLoading, moviesLoading])

    
    const handleDelete = () => {
        actedIn.forEach(actor => {
            deleteActor(actor.id, actor.person_id, actor.movie_id)
        })
        directedMovies.forEach(movie => {
            patchMovieDirector(movie, null)
        })
        deletePerson(persons[0])
        navigate("/persons", {
            state: {
                open: true,
                message: "Osoba została usunięta"
            },
            replace: true
        })
    }


    const chooseErrorModal = (e1, e2, e3) => {
        if (Object.keys(e1).length !== 0) return (
            <ErrorModal error={e1} />
        )
        if (Object.keys(e2).length !== 0) return (
            <ErrorModal error={e2} />
        )
        if (Object.keys(e3).length !== 0) return (
            <ErrorModal error={e3} />
        )
    }

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
          }
          setOpenSnack(false)
          navigate(`/persons/${id}`, {
              state: null,
              replace: true
          })
    }

    const snackHandling = (open, message) => {
        if (!openSnack) {
            setOpenSnack(open)
        }
        return (
            <Snackbar
                open={openSnack}
                autoHideDuration={5000}
                onClose={handleSnackClose}
                message={message}
                action={(
                    <IconButton
                        size="small"
                        onClick={handleSnackClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    )}
            />)
        }

    return (
        <div>
            {chooseErrorModal(personsError, moviesError, actorsError)}
            {location.state ? snackHandling(location.state.open, location.state.message) : <></>}
            <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate('/persons')} sx={{ bgcolor: '#770091', margin: 1 }}>Powrót</Button>
            <Outlet />
            {persons[0] ? persons.map(person => (
                <Box>
                    <CheckModal
                        entityname={`${person.first_name} ${person.last_name}`}
                        handleDelete={handleDelete}
                        open={openModal}
                        setOpen={setOpenModal}
                        />
                    <Grid container spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <Stack spacing={2} divider={(<Divider orientation='horizontal' flexItem />)}>
                                        <ListItem>
                                            <Typography variant="h3" >
                                            {person.first_name} {person.last_name}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            
                                            Data urodzenia: {new Intl.DateTimeFormat('pl-PL', {year: "numeric", month: "long", day: "numeric"}).format(new Date(person.birth_date))}
                                        </ListItem>
                                        <ListItem>
                                            Narodowość: {person.nationality}
                                        </ListItem>
                                        <ListItem>
                                            Jest aktorem w:
                                            <ul>
                                                {moviesLoaded ? movies.map(movie => (
                                                    <li>
                                                        <Link to={`/movies/${movie.id}`}>
                                                            {movie.title}
                                                        </Link>
                                                    </li>
                                                )) : <></>}
                                            </ul>
                                        </ListItem>
                                        <ListItem>
                                            Wyreżyserował: 
                                            <ul>
                                                {directedMovies.map(movie => (
                                                    <li>
                                                        <Link to={`/movies/${movie.id}`}>
                                                            {movie.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>  
                                        </ListItem>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <Button onClick={() => navigate('editperson')} variant='contained' startIcon={<EditIcon /> } sx={{ margin: 1}}>Edytuj osobę</Button>
                                    <Button onClick={() => setOpenModal(true)} variant='contained' startIcon={<DeleteIcon />} color='error' sx={{ margin: 1}}>Usuń osobę</Button>
                                </Grid>
                            </Grid>
                </Box>
            )) : <></>}
        </div>
    )
}

const mapDispatchToProps = {
    getPersonById,
    getMoviesList,
    getActorList,
    deletePerson,
    deleteActor,
    patchMovieDirector
}

export default connect(null, mapDispatchToProps)(PersonDetails)