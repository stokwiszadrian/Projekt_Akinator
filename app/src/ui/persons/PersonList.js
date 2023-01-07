import { useCallback, useEffect, useState } from "react"
import { connect } from "react-redux"
import { useLocation, useNavigate } from "react-router-dom"
import { getPersonsList } from "../../ducks/persons/operations"
import { useFormik, FormikProvider, Field } from 'formik'
import { selectPersons, selectPersonsError, selectPersonsLoaded, selectPersonsLoading } from "../../ducks/persons/selectors"
import ErrorModal from "../modals/ErrorModal"
import { Button, IconButton, Select, Snackbar, TextField, MenuItem, InputLabel, FormControl, Grid, ListItemButton, ListItemAvatar, ListItemText, Autocomplete, Avatar, ListItemIcon, Box, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close'
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

const PersonList = ({persons, loaded, loading, error, getPersonsList}, props) => {

    const countries = require('../../countryData/en/countries.json')
    const navigate = useNavigate()
    const location = useLocation()
    const [openSnack, setOpenSnack] = useState(false)
    const [page, setPage] = useState(1)
    const [entries, setEntries] = useState(4)
    const [listPaginated, setListPaginated] = useState({})
    const [filterState, setFilterState] = useState({
        name: '',
        sorting: 'az',
        nationality: '',
        yearfrom: null,
        yearto: null
    })


    const filtering = useCallback((list, values) => {
        let personlist = list
        switch (values.sorting) {
            case 'az':
                personlist.sort((a, b) => (a.last_name > b.last_name) ? 1 : -1)
                break;

            case 'za':
                personlist.sort((a, b) => (a.last_name > b.last_name) ? -1 : 1)
                break;

            case 'oldest':
                personlist.sort((a, b) => (a.birth_date > b.birth_date) ? 1 : -1)
                break;

            case 'youngest':
                personlist.sort((a, b) => (a.birth_date > b.birth_date) ? -1 : 1)
                break;
            
            default:
                personlist.sort((a, b) => (a.last_name > b.last_name) ? 1 : -1)
        }
        if (values.name !== '') {
            personlist = personlist
                .filter((person) => 
                `${person.first_name.toLowerCase()} ${person.last_name.toLowerCase()}`.includes(values.name.toLowerCase())
                )
        }
        if (values.nationality !== '') {
            personlist = personlist.filter((person) => person.nationality === values.nationality)
            }
        if (values.yearfrom !== null) {
            personlist = personlist.filter(
                (person) => 
                    person.birth_date >= new Date(values.yearfrom).toISOString()
                
            )
        }
        if (values.yearto !== null) {
            personlist = personlist.filter(
                (person) => {
                    return person.birth_date <= new Date(values.yearto).toISOString()
                }
            )
        }
        return [...personlist]
    }, [])

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

    const handleSnackClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
          }
          setOpenSnack(false)
          navigate("/persons", {
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


    useEffect(() => {
        if (!loaded && !loading) {
            getPersonsList()
        }
        if (loaded) {
                listPaginator(persons, filterState)
        }
    }, [persons, loaded, loading, getPersonsList, filtering, listPaginator, filterState])

    

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

    const formik = useFormik({
        initialValues: {
            answer: ''
        },
        onSubmit: (values) => alert(JSON.stringify(values, null, 2)),
        validateOnChange: false,
        validateOnBlur: false
    })
    
    return (
        <Grid container spacing={0} alignItems="flex-start" justifyContent="center" border={2} borderColor="red" direction="row">
            <Grid item sm={6} border={1} borderColor="white">
                <Grid container spacing={2}>
                    <Grid item xs={12} border={1} color="green">
                        <Grid container spacing={2} alignItems="center" justifyContent="center" direction='row' border={1}>
                            <Grid item sm={12} display="flex" alignItems='center' justifyContent='center'>
                                <Typography variant="h4" noWrap component="div" sx={{color: 'white'}}>
                                    MENTALIST
                                </Typography>
                                <img src='../cropped-Custom-Logo.png' alt="logo" width='80px' height='65px' style={{marginLeft: '10px'}} /> 
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = (state) => ({
    persons: selectPersons(state),
    loaded: selectPersonsLoaded(state),
    loading: selectPersonsLoading(state),
    error: selectPersonsError(state)
})

const mapDispatchToProps = {
    getPersonsList
}

export default connect(mapStateToProps, mapDispatchToProps)(PersonList)