import { Form, Field, useFormik, FormikProvider } from "formik"
import { useEffect, useState } from "react"
import { connect, useSelector } from "react-redux"
import { useParams } from "react-router"
import { selectMovieById, selectMovieGenres, selectMovies, selectMoviesLoaded, selectMoviesLoading, selectMovieError } from "../../ducks/movies/selectors"
import { selectPersons, selectPersonsLoaded, selectPersonsLoading, selectPersonsError } from "../../ducks/persons/selectors"
import { getPersonsList } from "../../ducks/persons/operations"
import { getMoviesList, postMovie, updateMovie } from "../../ducks/movies/operations"
import { useNavigate } from 'react-router-dom'
import { parse, isDate } from 'date-fns'

import * as Yup from 'yup'
import { Box } from "@mui/system"
import { TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel, FormLabel, FormGroup, FormHelperText } from "@mui/material"
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ErrorModal from "../modals/ErrorModal"

const MovieForm = ({getPersonsList, getMoviesList, postMovie, updateMovie}, props) => {

    const { id } = useParams()
    const navigate = useNavigate()
    const persons = useSelector(state => selectPersons(state))
    const movies = useSelector(state => selectMovies(state))
    const currentMovie = useSelector(state => selectMovieById(state, id))
    const genres = useSelector(state => selectMovieGenres(state))
    const moviesLoaded = useSelector(state => selectMoviesLoaded(state))
    const personsLoaded = useSelector(state => selectPersonsLoaded(state))

    const moviesLoading = useSelector(state => selectMoviesLoading(state))
    const personsLoading = useSelector(state => selectPersonsLoading(state))
    const moviesError = useSelector(state => selectMovieError(state))
    const personsError = useSelector(state => selectPersonsError(state))

    const movieTitles = id ? movies.filter(movie => movie.id !== parseInt(id)).map(movie => movie.title) : movies.map(movie => movie.title)
    const [newGenre, setNewGenre] = useState("Inny gatunek...")

    const parseDateString = (value, originalValue) => {
        const parsedDate = isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());

        return parsedDate;
    }

    const [initialValues, setInitialValues] = useState(id && currentMovie[0] ? {
            title: currentMovie[0].title,
            genre: currentMovie[0].genre.split("/"),
            release_date: new Date(new Date(currentMovie[0].release_date).valueOf() + (7200*1000)).toISOString().split("T")[0],
            description: currentMovie[0].description,
            image_url: currentMovie[0].image_url,
            director_id: currentMovie[0].director_id
        }
        : {
            title: "",
            genre: [],
            release_date: null,
            description: "",
            image_url: "",
            director_id: 0
        }
    )   
    
    const handleSubmit = (values) => {
        const movieGenres = values.genre.join("/")
        if (id) {
            updateMovie({
                ...values,
                genre: movieGenres,
                id: parseInt(id),
                release_date: new Date(values.release_date).toISOString()
            }, id)
            navigate(`/movies/${id}`, {
                state: {
                    open: true,
                    message: "Film został zmieniony"
                }
            })
        }
        else {
            postMovie({
                ...values,
                genre: movieGenres
            })
            navigate(`/movies`, {
                state: {
                    open: true,
                    message: "Film został dodany"
                }
            })
        }

    }

    useEffect(() => {
        if (!moviesLoaded && !moviesLoading) {
            getMoviesList()
        }

        else if (!personsLoaded && !personsLoading) {
            getPersonsList()
        }

        if (id && currentMovie[0] && initialValues.title === '') {
            setInitialValues({
                title: currentMovie[0].title,
                genre: currentMovie[0].genre.split("/"),
                release_date: new Date(new Date(currentMovie[0].release_date).valueOf() + (7200*1000)).toISOString().split("T")[0],
                description: currentMovie[0].description,
                image_url: currentMovie[0].image_url,
                director_id: currentMovie[0].director_id
            })
        }
    }, [getMoviesList, getPersonsList, moviesLoaded, personsLoaded, id, currentMovie, initialValues, personsLoading, moviesLoading])
    
    const movieSchema = Yup.object().shape({
        title: Yup.string()
        .test('is_unique', 'Movie with this title is already in the database', (value) => !movieTitles.includes(value))
        .required('Title is required'),
        genre: Yup.array()
        .min(1, 'At least 1 genre is required')
        .max(4, 'Please select less than 4 genres'),
        release_date: Yup.date()
        .transform(parseDateString)
        .max(new Date(), 'Invalid date')
        .required('Release date is required'),
        description: Yup.string()
        .required('Description is required'),
        image_url: Yup.string()
        .url('Must be a valid image url')

    })

    const chooseErrorModal = (e1, e2) => {
        if (Object.keys(e1).length !== 0) return (
            <ErrorModal error={e1} />
        )
        if (Object.keys(e2).length !== 0) return (
            <ErrorModal error={e2} />
        )
    }

    const formik = useFormik({
        initialValues: {
            title: initialValues.title,
            genre: initialValues.genre,
            release_date: initialValues.release_date,
            description: initialValues.description,
            image_url: initialValues.image_url,
            director_id: initialValues.director_id
        },
        onSubmit: (values) => handleSubmit(values),
        validationSchema: movieSchema,
        enableReinitialize: true
    })

    return (
        <Box sx={{
            padding: 2,
            border: 2,
            borderColor: "#770091"
        }}>
            <FormikProvider value={formik}>

                <Form>
                    {chooseErrorModal(moviesError, personsError)}
                    <Grid container spacing={2} alignItems="center">
                    <Grid item xs={11} sm={5.5} lg={4}>
                        <TextField
                            error={formik.errors.title && formik.touched.title}
                            label="Tytuł"
                            name="title"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            helperText={formik.errors.title}
                            fullWidth />
                        </Grid>
                        <Grid item xs={11} sm={5.5} lg={3}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Data wydania"
                                    name="release_date"
                                    value={formik.values.release_date}
                                    inputFormat="yyyy/MM/dd"
                                    onChange={value => formik.setFieldValue("release_date", value)}
                                    renderInput={(params) => <TextField 
                                        {...params} 
                                        error={formik.errors.release_date && formik.touched.release_date}
                                        helperText={formik.errors.release_date}
                                        fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={11} sm={5.5} lg={4}>
                        <FormControl fullWidth>
                        <InputLabel id="select-label">Reżyser</InputLabel>
                            <Select
                                labelId="select-label"
                                value={formik.values.director_id === null ? 0 : formik.values.director_id}
                                name="director_id"
                                label="Reżyser"
                                onChange={formik.handleChange}
                            >
                                <MenuItem value={0}>Nieznany</MenuItem>
                                {persons.map(person => (
                                <MenuItem value={person.id}>{person.first_name} {person.last_name}</MenuItem>
                            ))}
                            </Select>
                        </FormControl>
                        </Grid>
                    <Grid item xs={12}>
                    <FormControl 
                        component="fieldset" 
                        style={{ display: "flex", flexDirection: "column"}}
                        error={formik.errors.genre && formik.touched.genre}
                        >
                        <FormLabel component="legend">Gatunki</FormLabel>
                        <FormGroup>
                            <Grid container spacing={0} alignItems="flex-start" direction="row">
                                {genres.map(n => (
                                <Grid item xs={6} sm={4} md={3} lg={2} xl={1} sx={{ width: '100%'}}>
                                    <Field
                                        type="checkbox"
                                        name="genre"
                                        value={n}
                                        onChange={formik.handleChange}
                                        aria-labelledby={`label-${n}`}
                                    />
                                    <label id={`label-${n}`}>{n}</label>
                                </Grid>
                                ))}
                                <Grid item xs={6} sm={4} md={3} lg={2} sx={{ width: '100%'}}>
                                        <Field
                                            type="checkbox"
                                            name="genre"
                                            value={newGenre}
                                            onChange={formik.handleChange}
                                            aria-labelledby={`label-other`}
                                        />
                                        <label id={`label-other`}>Inny</label>
                                        <TextField
                                            label="Inny gatunek"
                                            name="newGenre"
                                            defaultValue="Inny gatunek..."
                                            onChange={g => setNewGenre(g.target.value)}
                                        />
                                    </Grid>
                            </Grid>
                            <FormHelperText>{formik.errors.genre}</FormHelperText>
                        </FormGroup>
                    </FormControl>
                    </Grid>
                    <Grid item xs={11} lg={3.5}>
                        <TextField
                            error={formik.errors.image_url && formik.touched.image_url}
                            label="Obraz ( URL )"
                            name="image_url"
                            value={formik.values.image_url}
                            onChange={formik.handleChange}
                            helperText={formik.errors.image_url}
                            fullWidth />
                        </Grid>
                    <Grid item xs={11} lg={3.5}>
                        <TextField
                            error={formik.errors.description && formik.touched.description}
                            label="Opis"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            helperText={formik.errors.description}
                            multiline
                            fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" color="primary" sx={{ width: { xs: 100, sm: 150, lg: 200}, bgcolor: '#770091' }}>{id ? "Zatwierdź" : "Dodaj"}</Button>
                        </Grid>
                    </Grid>
                </Form>
            </FormikProvider>
        </Box>
    )
}

const mapDispatchToProps = ({
    getPersonsList,
    postMovie,
    updateMovie,
    getMoviesList
})
export default connect(null, mapDispatchToProps)(MovieForm)