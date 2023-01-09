import { useEffect, useState } from "react"
import { Link} from "react-router-dom"
import { Button, Grid, Typography, Collapse } from "@mui/material"


const PersonList = (props) => {
    const [collapseState, setCollapseState] = useState(false)
    const [questionNumber, setQuestionNumber] = useState(1)
    const [answers, setAnswers] = useState({})

    const mockHandleClick = (value) => {
        setCollapseState(false)
        setTimeout(() => {
            setCollapseState(true)
            setQuestionNumber(questionNumber + 1)
            setAnswers({
            ...answers,
            [questionNumber]: value
        })
        if ( questionNumber >= 10 ) {
            alert(JSON.stringify(answers))
            setQuestionNumber(1)
            setAnswers({})
        }
            setCollapseState(true)
        }, 450)
    }

    useEffect(() => {
        setCollapseState(true)
    }, [])


    
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
                                    <Typography fontSize={{md: '4.5ex', xs: '3ex'}} sx={{ color: 'white'}}>
                                        <i>Question no. {questionNumber}</i>
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={3} justifyContent="center" alignItems="center" padding={4}>
                                        <Grid item xs={4} md={3} xl={2.5}>
                                            <Button variant="contained" fullWidth color="error" onClick={() => mockHandleClick("NO")}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>NO</b>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                        <Grid item xs={4} md={3} xl={2.5}>
                                            <Button variant="contained" fullWidth color="success" onClick={() => mockHandleClick("YES")}>
                                                <Typography variant="h5" sx={{ color: 'white' }}>
                                                    <b>YES</b>
                                                </Typography>
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Collapse>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default PersonList