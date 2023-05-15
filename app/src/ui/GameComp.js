import { useEffect, useState } from "react"
import { Link} from "react-router-dom"
import { Button, Grid, Typography, Collapse } from "@mui/material"
import axios from "axios"

const GameComp = (props) => {
    const apiUrl = 'http://localhost:4000/'
    const timeoutValue = 450
    const [collapseState, setCollapseState] = useState(false)
    const [imgUrl, setImgUrl] = useState("")
    const [gameState, setGameState] = useState({
        answered_yes: false,
        instance: {},
        excluded: []
    })
    const [currentQuestion, setCurrentQuestion] = useState({
        question: "",
        value: {}
    })

    const handleClick = (ans) => {
        setCollapseState(false)
        const questionKey = Object.keys(currentQuestion.value)[0]
        // Jeśli odpowiedź brzmi "Tak"
        if (ans) {
            setGameState({
                answered_yes: true,
                instance: {
                    ...gameState.instance,
                    [questionKey]: currentQuestion.value[questionKey]
                },
                excluded: []
            })
        // Jeśli odpowiedź brzmi "Nie"
        } else {
            setGameState({
                answered_yes: false,
                instance: {
                    ...gameState.instance
                },
                excluded: [
                    ...gameState.excluded,
                    currentQuestion.value[questionKey]
                ]
            })
        }

    }

    const handleRestart = () => {
        setCollapseState(false)
        setTimeout(() => {
            setGameState({
                answered_yes: false,
                instance: {},
                excluded: []
            })
            setImgUrl("")
            setCurrentQuestion({
                question: "",
                value: {}
            })
        }, timeoutValue)
    }


    useEffect(() => {
        setCollapseState(false)
        const fetchData = async () => {
            const res = await axios.post("http://localhost:5000", gameState)
            setCurrentQuestion(res.data)
            console.log(res.data)
            if (!res.data.question.includes("?")) {
                if (res.data.value.guess != null) {
                    axios.get(`${apiUrl}api/humans/img/${res.data.value.guess}`)
                    .then(imgRequest => {
                        setImgUrl(`https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${imgRequest.data}`)
                    })
                    .catch(err => {
                        setImgUrl('../default_person.png')
                    })

                } else {
                    setImgUrl('../default_person.png')
                }
                
            } else {
                setCollapseState(true)
            }
        }
        setTimeout(async () => {
            fetchData()
        }, timeoutValue)
        
    }, [gameState])


    
    return (
        <Grid container spacing={0} alignItems="flex-start" justifyContent="center" direction="row">
            <Grid item xs={12} sm={10} md={8} lg={6}>
                <Grid container spacing={0} direction="column">
                    <Grid item xs={4} display="flex" alignItems='center' justifyContent='center' margin={1}>
                        <Link to="/main" style={{textDecoration: 'none'}}>
                            <Typography variant='h4' noWrap component="div" sx={{color: 'white'}}>
                                MENTALIST
                            </Typography>
                        </Link>
                        <Link to="/main">
                            <img src='../cropped-Custom-Logo.png' alt="logo" width='80px' height='65px' style={{marginLeft: '10px'}} /> 
                        </Link>
                    </Grid>
                    
                    <Grid item xs={12} display="flex" bgcolor="#003575" color="white" justifyContent="center" borderRadius={7}>
                        <Collapse in={collapseState}>
                            <Grid container spacing={0} direction="row" padding={3}>
                                <Grid item xs={12} display="flex" justifyContent="center">
                                    <Grid container spacing={0} justifyContent="center">
                                        <Grid item xs={12} display="flex" justifyContent="center">
                                            <Typography fontSize={{md: '4.5ex', xs: '4ex'}} sx={{ color: 'white'}}>
                                                <i>{currentQuestion.question}</i>
                                            </Typography>
                                        </Grid>
                                   
                                        { (imgUrl !== "") ? 
                                        <>
                                        <Grid item xs={12} display="flex" justifyContent="center" >
                                            <img 
                                            alt="Person's portrait"
                                            src={imgUrl}
                                            style={{
                                                maxWidth: '60%',
                                                // maxHeight: '60%',
                                                height: '100%'
                                            }}
                                            onLoad={() => {
                                                setCollapseState(true)
                                                }}></img> 
                                            {/* <Button variant="contained" fullWidth color="error" onClick={() => handleClick(false)}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>Restart</b>
                                                </Typography>
                                            </Button> */}
                                        </Grid>
                                        <Grid item xs={6} display="flex" justifyContent="center" marginTop={"1ex"}>
                                            <Button variant="contained" fullWidth color="error" onClick={() => handleRestart()}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>Restart</b>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                        </>
                                        :
                                        <Grid item xs={12}>
                                            <></>
                                        </Grid> }
                                    </Grid>
                                </Grid>
                                <Grid item xs={12}>
                                    { (imgUrl === "" ) ? 
                                    <Grid container spacing={3} justifyContent="center" alignItems="center" padding={4}>
                                        <Grid item xs={4} md={3} xl={2.5}>
                                            <Button variant="contained" fullWidth color="error" onClick={() => handleClick(false)}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>NO</b>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4} md={3} xl={2.5}>
                                            <Button variant="contained" fullWidth color="success" onClick={() => handleClick(true)}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>YES</b>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    :
                                    <></>}
                                    
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default GameComp