import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Sitters from './Pages/Sitters/Sitters'
import Registration from './Pages/Registration/Registration'
import Login from './Pages/Login/Login'
import Personal from './Pages/Personal/Personal'
import { BrowserRouter, Routes, Route } from "react-router-dom"

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
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Sitters isAuthenticated={false} />}></Route>
            <Route path="/authentication/register" element={<Registration />}></Route>
            <Route path="/authentication/login" element={<Login />}></Route>
            <Route path="/personal" element={<Personal />}></Route>
            {/* <Sitters isAuthenticated={false}/> */}
            {/* <Registration /> */}
            {/* <Login /> */}
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </>
  )
}

export default App
