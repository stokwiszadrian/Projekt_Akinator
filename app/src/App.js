import { Button, Grid, Typography, Accordion, AccordionDetails, AccordionSummary, Box, AppBar, CssBaseline, IconButton, Drawer, Toolbar, createTheme, ThemeProvider, createMuiTheme} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import MenuIcon from '@mui/icons-material/Menu'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#770091',
    minHeight: '100vh',
  }
})
);

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Mono',
      'monospace'
    ].join(',')
  }
})

function App(props) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  const { window } = props
  const [mobileOpen, setMobileOpen] = useState(false)

  const styles = useStyles()

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const drawer = (
    <Grid container direction="column" alignItems="stretch" justifyContent="center" classes={{ root: styles.root }}>
            <Grid item xs={1}>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} elevation={20}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ bgcolor: '#600075', width: 1 }}
              >
                <Typography variant="h5" sx={{ margin: 'auto', color: 'white' }}>
                  Filmy
                </Typography>
              </AccordionSummary>
              <AccordionDetails
              sx={{
                padding: 0
              }}>

                <Button variant="outlined" fullWidth onClick={() => navigate("/movies")} sx={{ borderColor: '#770091' }}>
                  <Typography variant="h6" sx={{ color: 'black' }}>
                    <i>Lista filmów</i>
                  </Typography>
                </Button>

                <Button variant="outlined" fullWidth onClick={() => navigate("/movies/addmovie")} sx={{ borderColor: '#770091' }}>
                  <Typography variant="h6" sx={{ color: 'black' }}>
                    <i>Dodaj nowy film</i>
                  </Typography>
                </Button>

              </AccordionDetails>
            </Accordion>
            </Grid>
            <Grid item xs={1}>
            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} elevation={20}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ bgcolor: '#600075', width: 1 }}
              >
                <Typography variant="h5" sx={{ margin: 'auto', color: 'white' }}>
                  Osoby
                </Typography>
              </AccordionSummary>
              <AccordionDetails
              sx={{
                padding: 0
              }}>

                <Button variant="outlined" fullWidth onClick={() => navigate("/persons")} sx={{ borderColor: '#770091' }}>
                  <Typography variant="h6" sx={{ color: 'black' }}>
                    <i>Lista osób</i>
                  </Typography>
                </Button>

                <Button variant="outlined" fullWidth onClick={() => navigate("/persons/addperson")} sx={{ borderColor: '#770091' }}>
                  <Typography variant="h6" sx={{ color: 'black' }}>
                    <i>Dodaj nową osobę</i>
                  </Typography>
                </Button>

              </AccordionDetails>
            </Accordion>
            </Grid>
            <Grid item xs={1}>
            <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')} elevation={20}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                sx={{ bgcolor: '#600075', width: 1 }}
              >
                <Typography variant="h5" sx={{ margin: 'auto', color: 'white' }}>
                  Statystyki
                </Typography>
              </AccordionSummary>
              <AccordionDetails
              sx={{
                padding: 0
              }}>

                <Button variant="outlined" fullWidth onClick={() => navigate("/stats")} sx={{ borderColor: '#770091' }}>
                  <Typography variant="subtitle1" sx={{ color: 'black' }}>
                    <i><b>Sprawdź</b></i>
                  </Typography>
                </Button>

              </AccordionDetails>
            </Accordion>
            </Grid>
          </Grid>
  )

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
<ThemeProvider theme={theme}>
  <Box sx={{ display: 'flex', backgroundColor: '#034957', height: '100vh'}}>
    <CssBaseline />
      {/* <AppBar
        position="fixed"
        sx={{
          width: { md: `100%`},
          height: { md: `10%`, sm: `15%`}
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h4" noWrap component="div">
            MENTALIST
          </Typography>
        </Toolbar>
      </AppBar> */}
      {/* <Box
        component="nav"
        sx={{ width: { md: '20%', xl: '15%' }, flexShrink: { sm: 10 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(!mobileOpen)}
          classes={{ paper: styles.root }}
          ModalProps={{
            keepMounted: true
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '60%' },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: { md: '20%', xl: '15%' } },
          }}
          classes={{ paper: styles.root }}
          open
        >
          {drawer}
        </Drawer>
      </Box> */}
      <Box
        component="main"
        sx={{ 
          display: 'flex', 
          flexGrow: 1, 
          p: 2, 
          width: { md: `100%` }, 
          height: { md: `100%` } 
        }}
      >
        {/* <Toolbar
        classes={{
          root: styles.abRoot,
          positionStatic: styles.abStatic
        }} /> */}
        <Outlet />
      </Box>
  </Box>
</ThemeProvider>
  );
}

export default App;

