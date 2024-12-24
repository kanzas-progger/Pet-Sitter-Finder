import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Sitters from './Pages/Sitters/Sitters'
import Registration from './Pages/Registration/Registration'
import Login from './Pages/Login/Login'
import Personal from './Pages/Personal/Personal'
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from './Components/Layout/Layout'
import RequireAuth from './Components/RequireAuth/RequireAuth'

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
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/sitters" replace />} />
            {/* public routes*/}
            <Route path="sitters" element={<Sitters />} />
            <Route path="/authentication/register" element={<Registration />} />
            <Route path="/authentication/login" element={<Login />} />

            {/* protected routes*/}
            <Route element={<RequireAuth allowedRoles={['Sitter', 'Owner']} />}>
              <Route path="/personal" element={<Personal />}></Route>
            </Route>
          </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
