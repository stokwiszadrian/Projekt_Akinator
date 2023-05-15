import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button, Typography, Grid, Fade } from "@mui/material"


const MainComp = (props) => {
    const navigate = useNavigate()
    const [mainFade, setMainFade] = useState(false)
    const [buttonFade1, setButtonFade1] = useState(false)
    const [buttonFade2, setButtonFade2] = useState(false)

    const LogoImg = () => {
        let styles = {
            display: 'block',
            'maxWidth': '250px',
            'maxHeight': '200px',
            width: 'auto',
            height: 'auto',
            'marginTop': '20%'
        }

        return (
            (
                <img
                    src='../cropped-Custom-Logo.png'
                    alt="Mentalist Logo"
                    style={styles}
                />
            )
        )
    }


    useEffect(() => {
        setTimeout(() => setMainFade(true), 500)
        setTimeout(() => setButtonFade1(true), 1000)
        setTimeout(() => setButtonFade2(true), 1250)
    }, [])


    const handleClick = (path) => {
        setButtonFade2(false)
        setTimeout(() => setButtonFade1(false), 200)
        setTimeout(() => setMainFade(false), 400)
        setTimeout(() => navigate(path), 1000)
        
    }
    return (

            <Grid container spacing={3} alignItems="center" justifyContent="center">
                <Fade in={mainFade} timeout={{
                        enter: 800,
                        exit: 300
                    }}
                    unmountOnExit>
                    <Grid item xs={12}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center" direction='column'>
                            <Grid item sm={12} md={3} lg={2.5} xl={2}>
                                <Typography variant="h2" noWrap component="div" sx={{color: 'white'}}>
                                    MENTALIST
                                </Typography>
                            </Grid>
                            <Grid item sm={12} md={3} lg={2.5} xl={2}>
                            <LogoImg /> 
                            </Grid>
                        </Grid>
                    </Grid>
                </Fade>
                <Grid item xs={12}>
                    <Grid container spacing={3} alignItems="center" justifyContent="center" direction={{xs: 'column', md: 'row'}}>

                    <Grid item sm={2} justifyContent="center">
                        <Fade in={buttonFade1} timeout={{
                            enter: 500,
                            exit: 300
                        }}
                        unmountOnExit>
                            <Button onClick={() => handleClick('/game')} variant="outlined" fullWidth >
                                <Typography variant="h3" noWrap component="div" sx={{color: 'white'}}>
                                    Play
                                </Typography>
                            </Button>
                        </Fade>
                    </Grid>
                    <Grid item sm={2} justifyContent="center">
                        <Fade in={buttonFade2} timeout={{
                            enter: 500,
                            exit: 300
                        }}
                        unmountOnExit>
                            <Button onClick={() => handleClick('/about')} variant="outlined" fullWidth >
                                <Typography variant="h3" noWrap component="div" sx={{color: 'white'}}>
                                    About
                                </Typography>
                            </Button>
                        </Fade>
                    </Grid>

                    </Grid>
                </Grid>
                
            </Grid>
    )
}

export default MainComp