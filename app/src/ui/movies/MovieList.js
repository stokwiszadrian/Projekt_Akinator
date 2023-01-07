import { useEffect, useState, useCallback } from "react"
import { connect } from "react-redux"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { getMoviesList } from "../../ducks/movies/operations"
import { selectMovieError, selectMovieGenres, selectMovies, selectMoviesLoaded, selectMoviesLoading } from "../../ducks/movies/selectors"
import { Formik, Field, useFormik, FormikProvider } from 'formik'
import ErrorModal from "../modals/ErrorModal"
import { Button, IconButton, Select, Snackbar, TextField, MenuItem, InputLabel, FormControl, FormLabel, FormGroup, Typography, Grid, Box, ImageListItem, ImageListItemBar, useTheme, useMediaQuery, Fade } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { Image } from "@mui/icons-material"


const MovieList = ({movies, loaded, loading, error, genres, getMoviesList}, props) => {
    const navigate = useNavigate()
    const location = useLocation()
    const [mainFade, setMainFade] = useState(false)
    const [buttonFade, setButtonFade] = useState(false)
    const [openSnack, setOpenSnack] = useState(false)
    const [entries, setEntries] = useState(4)
    const [listPaginated, setListPaginated] = useState({})
    const [page, setPage] = useState(1)
    const [filterState, setFilterState] = useState({
        title: '',
        sorting: 'az',
        genre: [],
        yearfrom: null,
        yearto: null
    })

    const theme = useTheme()
    const imgXl = useMediaQuery(theme.breakpoints.up('xl'))
    const imgLarge = useMediaQuery(theme.breakpoints.up('lg'))
    const imgMedium = useMediaQuery(theme.breakpoints.up('md'))
    const imgSmall = useMediaQuery(theme.breakpoints.up('sm'))

    const MovieImg = ({movie}) => {
        let styles = {
            width: '100%',
            height: '550px'
        }

        if (imgXl) {
            styles.height = '425px'
        }
        else if (imgLarge) {
            styles.height = '325px'
        }
        else if (imgMedium) {
            styles.height = '300px'
        }
        else if (imgSmall) {
            styles.height = '475px'

        }
        return (
            (
                <img
                    src={movie.image_url ? movie.image_url : "./default_camera.jpg"}
                    alt={movie.title}
                    style={styles}
                    loading="lazy"
                    onClick={() => navigate(`/movies/${movie.id}`)}
                />
            )
        )
    }


    // funkcja zwracająca przefiltrowane i posortowane elementy

    const filtering = useCallback((list, values) => {
        let movielist = list
        switch (values.sorting) {
            case 'az':
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)
                break;

            case 'za':
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? -1 : 1)
                break;

            case 'oldest':
                movielist.sort((a, b) => (a.release_date > b.release_date) ? 1 : -1)
                break;

            case 'youngest':
                movielist.sort((a, b) => (a.release_date > b.release_date) ? -1 : 1)
                break;
            
            default:
                movielist.sort((a, b) => (a.title.toLowerCase() > b.title.toLowerCase()) ? 1 : -1)
        }

        if (values.name !== '') {
            movielist = movielist
                .filter((movie) => {
                return movie.title.toLowerCase().includes(values.title.toLowerCase())
                })
        }

        if (values.genre.length !== 0) {
            movielist = movielist.filter(
                (movie) => 
                    values
                    .genre
                    .some(n => movie.genre.includes(n))
                    )
        }

        if (values.yearfrom !== null) {
            movielist = movielist.filter(
                (movie) => 
                    movie.release_date >= new Date(values.yearfrom).toISOString()
            )
        }

        
        if (values.yearto !== null) {
            movielist = movielist.filter(
                (movie) => 
                    movie.release_date <= new Date(values.yearto).toISOString()
            )
        }
        return [...movielist]
    }, [])

    // Funkcja dzieląca obiekty na poszczególne strony

    const listPaginator = useCallback((list, filter) => {
        setListPaginated(filtering(list, filter).reduce((acc, cur, index) => {
            const pageIndex = Math.floor(index/entries)
            if(!acc[pageIndex]) {
                acc[pageIndex] = []
            }
            acc[pageIndex].push(cur)
            return acc
        }, {}))
    }, [entries, filtering])

    // Ładowanie danych, gdy nie są w storze; jeśli dane są załadowane, są one wstępnie "paginowane"

    useEffect(() => {
        if (!loaded && !loading) {
            getMoviesList()
        }
        if (loaded) {
            listPaginator(movies, filterState)
        }
    }, [loaded, loading, getMoviesList, movies, filterState, listPaginator])

    // Gdy przy zmianie ilości elementów na stronie, obecny numer jest większy niż ostatni numer w nowym podziale,
    // ten efekt ustawi stronę na ostatnią w nowym podziale

    useEffect(() => {
        if (page > Object.keys(listPaginated).length && Object.keys(listPaginated).length > 0) {
            setPage(Object.keys(listPaginated).length)
        }
    }, [page, listPaginated])

    const pageSetter = (n) => {
        if (n > 0 && n <= Object.keys(listPaginated).length){
            setPage(n)
        }
    }

    // useEffect(() => {
    //     if (imgXl) {
    //         setEntries(6)
    //     }
    //     else if (imgLarge) {
    //         setEntries(5)
    //     }
    //     else if (imgMedium) {
    //         setEntries(4)
    //     }
    //     else if (imgSmall) {
    //         setEntries(6)
    //     }
    //     else {
    //         setEntries(6)
    //     }
    // }, [imgXl, imgLarge, imgMedium, imgSmall])

    useEffect(() => {
        setTimeout(() => setMainFade(true), 500)
        setTimeout(() => setButtonFade(true), 2000)
    })

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
          }
          setOpenSnack(false)
          navigate("/movies", {
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
                        color="inherit"
                        onClick={handleSnackClose}
                    >
                        <CloseIcon fontSize="small" />
                    </IconButton>
                    )}
            />)
        }

    const formik = useFormik({
            initialValues: {
                title: '',
                sorting: 'az',
                genre: [],
                yearfrom: null,
                yearto: null
            },
            onSubmit: (values) => setFilterState(values),
            validateOnChange: false,
            validateOnBlur: false
        })

    const handleClick = () => {
        console.log("Clicked!")
        navigate('/game')
    }
    return (

            <Grid container spacing={0} alignItems="flex-start" justifyContent="center" border={2} borderColor="red" direction="row">
                <Fade in={mainFade} timeout={{
                        enter: 1000
                    }}
                    unmountOnExit>
                    <Grid item sm={12}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center" direction={{ xs: 'column', md: 'row'}} border={1}>
                            <Grid item sm={12} md={3} lg={2.5} xl={2}>
                                <Typography variant="h2" noWrap component="div" sx={{color: 'white'}}>
                                    MENTALIST
                                </Typography>
                            </Grid>
                            <Grid item sm={12} md={3} lg={2.5} xl={2}>
                            <img src='../cropped-Custom-Logo.png' alt="logo"/> 
                            </Grid>
                        </Grid>
                    </Grid>
                    {/* <Grid item sm={11} md={5} lg={5}>
                        <img src='../cropped-Custom-Logo.png' alt="logo"/> 
                    </Grid> */}
                </Fade>
                <Grid item sm={1} justifyContent="center">
                    <Fade in={buttonFade} timeout={{
                        enter: 1000
                    }}
                    unmountOnExit>
                        <Button onClick={() => handleClick()} >
                            <Typography variant="h3" noWrap component="div" sx={{color: 'white'}}>
                                Play
                            </Typography>
                        </Button>
                    </Fade>
                </Grid>
            </Grid>
    )
}

const mapStateToProps = (state) => ({
    movies: selectMovies(state),
    loaded: selectMoviesLoaded(state),
    loading: selectMoviesLoading(state),
    error: selectMovieError(state),
    genres: selectMovieGenres(state)
})

const mapDispatchToProps = {
    getMoviesList
}

export default connect(mapStateToProps, mapDispatchToProps)(MovieList)