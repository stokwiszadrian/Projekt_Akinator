import { Box, CssBaseline, createTheme, ThemeProvider} from '@mui/material';
import { Outlet } from 'react-router';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto Mono',
      'monospace'
    ].join(',')
  }
})

function App(props) {
  return (
<ThemeProvider theme={theme}>
  <Box sx={{ display: 'flex', backgroundColor: '#001c3d', height: '100vh'}}>
    <CssBaseline />
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
        <Outlet />
      </Box>
  </Box>
</ThemeProvider>
  );
}

export default App;

