import { Link } from "react-router-dom"
import { Grid, Typography} from "@mui/material"


const PersonList = (props) => {

    return (
        <Grid container spacing={0} alignItems="flex-start" justifyContent="center" direction="row">
            <Grid item xs={12} md={10} lg={8}>
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
                    
                    <Grid item xs={12} display="flex" color="white" borderRadius={7}>

                        <Typography fontSize={{md: '3ex', xs: '2ex'}} sx={{ color: 'white'}}>
                            <p>
                            🇬🇧 Mentalist is a program capable of guessing what kind of person you have in mind. It will ask you a number of yes/no questions on the basis of which it will be able to explcitly state who's on your mind.
                            <br />
                            Works only with real people ( fictional characters are excluded ).
                            </p>
                            <p>
                            🇵🇱 Mentalist to program potrafiący odgadnąć, jaką osobę masz na myśli. Zada Ci on kilka pytań tak/nie, na którch podstawie będzię mógł jednoznacznie stwierdzić kogo masz na myśli.
                            <br />
                            Działa tylko na prawdziwych osobach ( fikcyjne postacie są wykluczone ).
                            </p>
                        </Typography>

                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}


export default PersonList