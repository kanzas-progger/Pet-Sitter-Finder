import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sitters from './Pages/Sitters/Sitters';
import Registration from './Pages/Registration/Registration'

const theme = createTheme({
  palette: {
    primary: {
      main: '#4D7298',
    },
  },
  typography: {
    fontFamily: `"PT Sans", serif`, // Ваш шрифт по умолчанию
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '14px',
          fontWeight: '700',
          //fontFamily: `"PT Sans", serif`,
        },
      },
    },
  },
})

//#9DC3C2    #77A6B6

function App() {

  return (
    <>
      <ThemeProvider theme={theme}>
        {/* <Sitters /> */}
        <Registration />
      </ThemeProvider>
    </>
  )
}

export default App
