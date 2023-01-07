import { useEffect, useState } from "react"
import { connect, useSelector } from "react-redux"
import { getPersonsList } from "./../ducks/persons/operations"
import { getActorList } from "../ducks/actors/operations"
import { getMoviesList } from "../ducks/movies/operations"
import { selectPersons, selectPersonsLoaded, selectPersonsLoading, selectPersonsError } from "./../ducks/persons/selectors"
import { selectMoviesLoaded, selectMoviesLoading, selectMovieError } from "../ducks/movies/selectors"
import { selectActors, selectActorsLoading, selectActorsLoaded, selectActorsError } from "../ducks/actors/selectors"
import { Pie, Bar } from 'react-chartjs-2';
import ErrorModal from "./modals/ErrorModal"
import { Grid, Button } from "@mui/material"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
  } from 'chart.js';

ChartJS.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );


const PersonList = ({getPersonsList, getActorList, getMoviesList}, props) => {

    const persons = useSelector(state => selectPersons(state))
    const actors = useSelector(state => selectActors(state))
    const personsLoaded = useSelector(state => selectPersonsLoaded(state))
    const moviesLoaded = useSelector(state => selectMoviesLoaded(state))
    const actorsLoaded = useSelector(state => selectActorsLoaded(state)) 
    const moviesLoading = useSelector(state => selectMoviesLoading(state))
    const personsLoading = useSelector(state => selectPersonsLoading(state))
    const actorsLoading = useSelector(state => selectActorsLoading(state))
    const moviesError = useSelector(state => selectMovieError(state))
    const personsError = useSelector(state => selectPersonsError(state))
    const actorsError = useSelector(state => selectActorsError(state))

    useEffect(() => {
        if (!personsLoaded && !personsLoading){
            getPersonsList()
        }
        else if (!moviesLoaded && !moviesLoading) {
            getMoviesList()
        }
        else if (!actorsLoaded && !actorsLoading) {
            getActorList()
        }
    }, [personsLoaded, getPersonsList, actorsLoaded, getActorList, moviesLoaded, getMoviesList, personsLoading, actorsLoading, moviesLoading])

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

    const randomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
    // Countries chart stuff
    const countries = [...new Set(actors.map(actor => persons.find(person => person.id === actor.person_id) ? persons.find(person => person.id === actor.person_id).nationality : null))]
    const countriesCounted = actors.reduce((acc, actor) => {
        const personActor = persons.find(person => person.id === actor.person_id)
        if (personActor){
            if (!Object.keys(acc).includes(personActor.nationality)) {
                return {
                    ...acc,
                    [personActor.nationality]: 1
                }
            }
            return {
                ...acc,
                [personActor.nationality]: acc[personActor.nationality] + 1
            }
        }
        else return {...acc}
    }, {})
    const countriesDataset = Object.keys(countriesCounted).map(c => countriesCounted[c])
    const colors = countriesDataset.map(c => `rgba(${randomInt(30, 255)}, ${randomInt(30, 255)}, ${randomInt(30, 255)},`)
    const countryData = {
        labels: countries,
        datasets: [
          {
            label: '',
            data: countriesDataset,
            backgroundColor: colors.map(color => color + ' 0.4)'),
            borderColor: colors.map(color => color + ' 1)'),
            borderWidth: 1,
          },
        ],
      };

    // Actors chart stuff
    const [displayedNr, setDisplayedNr] = useState(5)
    const options = {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: false,
            text: 'Chart.js Bar Chart',
          },
        },
      };

    const personsAggregated = actors.reduce((acc, actor) => {
        if (!Object.keys(acc).includes(String(actor.person_id))) {
            return {
                ...acc,
                [actor.person_id]: 1
            }
        }
        return {
            ...acc,
            [actor.person_id]: acc[actor.person_id] + 1
        }
    }, {})

    const personsAggregatedNames = Object.keys(personsAggregated)
        .map(key => ({
                name: persons.find(p => p.id === parseInt(key)).first_name + " " + persons.find(p => p.id === parseInt(key)).last_name,
                actedIn: personsAggregated[key]
            })
        )
        .sort((a, b) => a.actedIn > b.actedIn ? -1 : 1)

    const personsData = {
        labels: personsAggregatedNames.map(p => p.name).slice(0, displayedNr),
        datasets: [
            {
                label: 'Liczba filmów',
                data: personsAggregatedNames.map(p => p.actedIn).slice(0, displayedNr),
                backgroundColor: 'rgba(255, 80, 80, 0.8)'
            }
        ]
    }

    return (
        <Grid container justifyContent='space-around' alignItems='center'>
            {chooseErrorModal(moviesError, personsError, actorsError)}
            <Grid item xs={8} md={3}>
                <h4>Ilość aktorów w poszczegółnych krajach</h4>
                <Pie data={countryData} />
            </Grid>
            <Grid item xs={10} md={6}>
                <h4>Najpopularniejsi aktorzy</h4>
                <Bar options={options} data={personsData} />
                <Button variant='outlined' onClick={() => setDisplayedNr(10)}>10 aktorów</Button>
                <Button variant='outlined' onClick={() => setDisplayedNr(5)}>5 aktorów</Button>
            </Grid>
        </Grid>
    )
}

const mapDispatchToProps = {
    getPersonsList,
    getMoviesList,
    getActorList
}

export default connect(null, mapDispatchToProps)(PersonList)