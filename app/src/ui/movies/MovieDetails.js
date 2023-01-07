import { useEffect, useState } from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { useSelector, connect } from "react-redux"
import { Link, useParams } from 'react-router-dom'
import { Formik, Form, Field } from 'formik'
import { getMovieById, deleteMovie } from "../../ducks/movies/operations"
import { selectMovieById, selectMovieError, selectMoviesLoading } from "../../ducks/movies/selectors"
import { selectActorByMovieId, selectActorsError, selectActorsLoaded, selectActorsLoading } from "../../ducks/actors/selectors"
import { getActorList, postActors } from "../../ducks/actors/operations"
import { selectPersons, selectPersonsError, selectPersonsLoaded, selectPersonsLoading } from "../../ducks/persons/selectors"
import { getPersonsList } from "../../ducks/persons/operations"
import { deleteActor } from "../../ducks/actors/operations"
import ErrorModal from "../modals/ErrorModal"
import { Button, IconButton, Snackbar, Grid, Stack, ListItem, Divider, Typography, ListItemButton, ListItemAvatar, ListItemIcon, Avatar, ListItemText } from "@mui/material"
import DeleteIcon from '@mui/icons-material/Delete'
import CloseIcon from '@mui/icons-material/Close'
import CheckModal from "../modals/CheckModal"
import EditIcon from '@mui/icons-material/Edit'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import AddIcon from '@mui/icons-material/Add'

const MovieDetails = ({getMovieById, getPersonsList, getActorList, postActors, deleteActor, deleteMovie}, props) => {
    const { id } = useParams()
    const location = useLocation()
    const [openSnack, setOpenSnack] = useState(false)
    const [openMovieModal, setOpenMovieModal] = useState(false)
    const [openActorModal, setOpenActorModal] = useState(false)
    const movies = useSelector(state => selectMovieById(state, id))
    const actors = useSelector(state => selectActorByMovieId(state, parseInt(id)))
    const persons = useSelector(state => selectPersons(state))
    const nonActors = persons.filter(person => !actors.map(actor => actor.person_id).includes(person.id))
    const personsLoaded = useSelector(state => selectPersonsLoaded(state))
    const actorsLoaded = useSelector(state => selectActorsLoaded(state)) 

    const moviesLoading = useSelector(state => selectMoviesLoading(state))
    const personsLoading = useSelector(state => selectPersonsLoading(state))
    const actorsLoading = useSelector(state => selectActorsLoading(state))
    const moviesError = useSelector(state => selectMovieError(state))
    const personsError = useSelector(state => selectPersonsError(state))
    const actorsError = useSelector(state => selectActorsError(state))
    const [addActors, setAddActors] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = (values) => {
        const parsedValues = values.ids.map(v => ({id: parseInt(v)}))
        parsedValues.forEach(value => {
            postActors(value, id)
        })
        setAddActors(false)
        navigate(`/movies/${id}`, {
            state: {
                open: true,
                message: "Aktorzy zostali dodani"
            }
        })
    }

    const handleDelete = () => {
        actors.forEach(actor => {
            deleteActor(actor.id, actor.person_id, actor.movie_id)
        })
        deleteMovie(movies[0])
        navigate("/movies", {
            state: {
                open: true,
                message: "Film został usunięty"
            }
        })
    }

    const handleActorDelete = (actorId, personId, movieId) => {
        deleteActor(actorId, personId, movieId)
        navigate(`/movies/${id}`, {
            state: {
                open: true,
                message: "Aktor został usunięty"
            }
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
          navigate(`/movies/${id}`, {
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


    useEffect(() => {
        if (!movies[0] && !moviesLoading) {
            getMovieById(id)
        }
        else if (!personsLoaded && !personsLoading) {
            getPersonsList()
        }
        else if (!actorsLoaded && !actorsLoading) {
            getActorList()
        }
    }, [movies, getMovieById, id, personsLoaded, getPersonsList, actorsLoaded, getActorList, moviesLoading, personsLoading, actorsLoading])

    return (
        <div>
            {chooseErrorModal(moviesError, personsError, actorsError)}
            {location.state ? snackHandling(location.state.open, location.state.message) : <></>}
            <Button variant='contained' startIcon={<ArrowBackIcon />} onClick={() => navigate('/movies')} sx={{ bgcolor: '#770091', margin: 1 }}>Powrót</Button>
            <Outlet />
            {movies[0] ? movies.map(movie => (
                    <div>
                    <Grid container spacing={2}>
                        <CheckModal
                            entityname={movie.title}
                            handleDelete={handleDelete}
                            open={openMovieModal}
                            setOpen={setOpenMovieModal}
                        />
                        <Grid item xs={12} sm={4} xl={3}>
                        <img
                            src={movie.image_url ? movie.image_url : "../default_camera.jpg"}
                            alt={movie.title}
                            style={{
                                maxWidth: '100%'
                            }}
                        />
                        </Grid>
                        <Grid item xs={12} sm={8} xl={9}>
                            <Grid container spacing={2}>
                                <Grid item xs={9}>
                                    <Stack spacing={2} divider={(<Divider orientation='horizontal' flexItem />)}>
                                        <ListItem>
                                            <Typography variant="h3" >
                                            {movie.title}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant="h4" fontStyle='italic'>
                                                {movie.genre}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <Typography variant="h5" fontStyle='italic'>
                                            {movie.director_id && personsLoaded ? 
                                                (   <>
                                                    Reżyseria: {' '}
                                                    <Link to={`/persons/${movie.director_id}`}>
                                                        {persons.find(person => person.id === movie.director_id).first_name} {persons.find(person => person.id === movie.director_id).last_name} 
                                                    </Link>
                                                    </>
                                            ) : "Reżyser nieznany"
                                                }
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            Data premiery: {new Intl.DateTimeFormat('pl-PL', {year: "numeric", month: "long", day: "numeric"}).format(new Date(movie.release_date))}
                                        </ListItem>
                                        <ListItem>
                                            {movie.description}
                                        </ListItem>
                                    </Stack>
                                </Grid>
                                <Grid item xs={3}>
                                    <Button onClick={() => navigate('editmovie')} variant='contained' startIcon={<EditIcon /> } sx={{ margin: 1}}>Edytuj film</Button>
                                    <Button onClick={() => setOpenMovieModal(true)} variant='contained' startIcon={<DeleteIcon />} color='error' sx={{ margin: 1}}>Usuń film</Button>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid>
                    
                            <Button onClick={() => setAddActors(true)} startIcon={<AddIcon />}>Dodaj aktorów</Button>
                            {addActors ? 
                                <Formik
                                initialValues={{
                                    ids: []
                                }}
                                enableReinitialize={true}
                                onSubmit={(values) => handleSubmit(values)}>
                                    {({ values }) => (
                                        <Form>
                                            <h4>Wybierz aktorów, których chcesz dodać:</h4>
                                            <ol>
                                            {nonActors.map(person => (
                                                <li key={person.id}>
                                                    <label>
                                                        <Field
                                                        type="checkbox"
                                                        name="ids"
                                                        value={`${person.id}`} />
                                                        {person.first_name} {person.last_name}
                                                    </label>
                                                </li>
                                            ))}
                                            </ol>
                                            <Button type="submit" variant='contained' sx={{margin: 1}}>Dodaj wybranych aktorów</Button>
                                        </Form>
                                        )}
                                    </Formik> : <></>}

                                <Grid container>
                                {actorsLoaded && personsLoaded ? actors.map(actor => {
                                        const personActor = persons.find(person => person.id === actor.person_id)
                                        return (
                                            <Grid item xs={12} md={6} xl={2}>
                                                <CheckModal
                                                    entityname={`${personActor.first_name} ${personActor.last_name} z listy aktorów`}
                                                    handleDelete={() => handleActorDelete(actor.id, personActor.id, id)}
                                                    open={openActorModal === actor.id}
                                                    setOpen={setOpenActorModal}
                                                />
                                            <ListItem
                                                key={actor.id}
                                                sx={{
                                                    border: 1,
                                                    minHeight: 150,
                                                    margin: 0
                                                }}
                                                secondaryAction={
                                                    <IconButton edge="end" onClick={() => setOpenActorModal(actor.id)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }>
                                            <ListItemButton
                                                onClick={() => navigate(`/persons/${personActor.id}`)}
                                                >
                                                    <ListItemAvatar>
                                                        <Avatar>
                                                            <ListItemIcon />
                                                        </Avatar>
                                                    </ListItemAvatar>
                                                    <ListItemText
                                                        primary={`${personActor.first_name} ${personActor.last_name}`}
                                                        secondary={`Narodowość: ${personActor.nationality}`}
                                                    />
                                            </ListItemButton>
                                            </ListItem>
                                            </Grid>
                                        )
                                }) : <></>}
                            </Grid>
                    </div>
                    
            )) : <></>}
        </div>
    )
}

const mapDispatchToProps = {
    getMovieById,
    getPersonsList,
    getActorList,
    postActors,
    deleteActor,
    deleteMovie
}
export default connect(null, mapDispatchToProps)(MovieDetails)