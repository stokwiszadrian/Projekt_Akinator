import { Form, useFormik, FormikProvider } from "formik"
import { useEffect, useState } from "react"
import { connect, useSelector } from "react-redux"
import { useParams } from "react-router"
import { selectPersonById, selectPersonsError } from "../../ducks/persons/selectors"
import { postPerson, updatePerson } from "../../ducks/persons/operations"
import { useNavigate } from 'react-router-dom'
import { parse, isDate } from "date-fns"
import ErrorModal from "../modals/ErrorModal"
import * as Yup from 'yup'
import { Box } from "@mui/system"
import { TextField, Grid, Autocomplete, Button } from "@mui/material"
import DatePicker from '@mui/lab/DatePicker'
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import AdapterDateFns from '@mui/lab/AdapterDateFns'

const PersonForm = ({postPerson, updatePerson}, props) => {
    const countries = require('../../countryData/en/countries.json')
    const { id } = useParams()
    const navigate = useNavigate()
    const persons = useSelector(state => selectPersonById(state, id))
    const personsError = useSelector(state => selectPersonsError(state))
    

    const parseDateString = (value, originalValue) => {
        const parsedDate = isDate(originalValue)
        ? originalValue
        : parse(originalValue, "yyyy-MM-dd", new Date());

        return parsedDate;
    }

    const [initialValues, setInitialValues] = useState(
        id && persons[0] ? {
            first_name: persons[0].first_name,
            last_name: persons[0].last_name,
            birth_date: new Date(new Date(persons[0].birth_date).valueOf() + (7200*1000)).toISOString().split("T")[0],
            nationality: persons[0].nationality
        }
        : {
            first_name: "",
            last_name: "",
            birth_date: "",
            nationality: ""
        }
    )   

    const handleSubmit = async (values) => {
        if (id) {
            updatePerson({
                ...values,
                birth_date: new Date(values.birth_date).toISOString(),
                id: id
            }, id)
            navigate(`/persons/${id}`, {
                state: {
                    open: true,
                    message: "Osoba została zmieniona"
                }
            })
        }
        else {
            postPerson(values)
            navigate(`/persons`, {
                state: {
                    open: true,
                    message: "Osoba została dodana"
                }
            })
        }

    }

    useEffect(() => {
        if (id && persons[0] && initialValues.first_name === '') {
            setInitialValues({
                first_name: persons[0].first_name,
                last_name: persons[0].last_name,
                birth_date: new Date(new Date(persons[0].birth_date).valueOf() + (7200*1000)).toISOString().split("T")[0],
                nationality: persons[0].nationality 
            })
        }
    }, [id, persons, initialValues])
    
    const personSchema = Yup.object().shape({
        first_name: Yup.string()
        .max(60, "First name can't have more than 60 characters")
        .required('First name is required'),
        last_name: Yup.string()
        .max(60, "Last name can't have more than 60 characters")
        .required('Last name is required'),
        birth_date: Yup.date()
        .transform(parseDateString)
        .max(new Date(), 'Invalid date')
        .required('Birth date is required'),
        nationality: Yup.string()
        .required('Nationality is required')
    })

    const formik = useFormik({
        initialValues: {
            first_name: initialValues.first_name,
            last_name: initialValues.last_name,
            birth_date: initialValues.birth_date,
            nationality: initialValues.nationality,
        },
        onSubmit: (values, {resetForm}) => {
            handleSubmit(values)
            resetForm({
                first_name: "",
                last_name: "",
                birth_date: null,
                nationality: ""
            })
        },
        validationSchema: personSchema
    })

    return (
            <Box sx={{
                padding: 2,
                border: 2,
                borderColor: "#770091"
            }}>
            <FormikProvider value={formik}>
                <Form onSubmit={formik.handleSubmit}>
                    <ErrorModal error={personsError} />
                    <Grid container spacing={2} alignItems="center" margin={0}>
                        <Grid item xs={11} sm={5} lg={3.5}>
                        <TextField
                            error={formik.errors.first_name && formik.touched.first_name}
                            label="Imię"
                            name="first_name"
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            helperText={formik.errors.first_name}
                            fullWidth />
                        </Grid>
                        <Grid item xs={11} sm={5} lg={3.5}>
                        <TextField
                            error={formik.errors.last_name && formik.touched.last_name}
                            label="Nazwisko"
                            name="last_name"
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            helperText={formik.errors.last_name}
                            fullWidth />
                        </Grid>
                        <Grid item xs={11} sm={5} lg={3.5}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DatePicker
                                    label="Data urodzenia"
                                    name="birth_date"
                                    value={formik.values.birth_date}
                                    inputFormat="yyyy/MM/dd"
                                    onChange={value => formik.setFieldValue("birth_date", value)}
                                    renderInput={(params) => <TextField 
                                        {...params} 
                                        error={formik.errors.birth_date && formik.touched.birth_date}
                                        helperText={formik.errors.birth_date}
                                        fullWidth />}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={11} sm={5} lg={3.5}>
                    <Autocomplete
                        fullWidth
                        options={countries}
                        autoHighlight
                        defaultValue={countries.find(c => c.name === formik.values.nationality)}
                        name="nationality"
                        onChange={value => formik.setFieldValue("nationality", value.target.textContent)}
                        getOptionLabel={(option) => option.name}
                        renderOption={(props, option) => (
                            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                            <img
                                loading="lazy"
                                width="20"
                                src={`https://flagcdn.com/w20/${option.alpha2.toLowerCase()}.png`}
                                srcSet={`https://flagcdn.com/w40/${option.alpha2.toLowerCase()}.png 2x`}
                                alt=""
                            />
                            {option.name}
                            </Box>
                        )}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Narodowość"
                            name="nationality"
                            error={formik.errors.nationality && formik.touched.nationality}
                            helperText={formik.errors.nationality}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password',
                            }}
                            />
                        )}
                    />
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
    postPerson,
    updatePerson,
})
export default connect(null, mapDispatchToProps)(PersonForm)