import './App.css'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import Sitters from './Pages/Sitters/Sitters'
import Registration from './Pages/Registration/Registration'
import Login from './Pages/Login/Login'
import Personal from './Pages/Personal/Personal'
import Animals from './Pages/Animals/Animals'
import { Routes, Route, Navigate, Outlet } from "react-router-dom"
import Layout from './Components/Layout/Layout'
import RequireAuth from './Components/RequireAuth/RequireAuth'
import Contact from './Pages/Contact/Contact'
import { ProfileProvider } from './context/ProfileProvider'
import AnimalProfiles from './Pages/AnimalProfiles/AnimalProfiles'

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
              <Route path="profile" element=
                {<ProfileProvider>
                  <Outlet />
                </ProfileProvider>}>
                <Route index element={<Navigate to="/profile/personal/edit" replace />} />
                <Route path="personal/edit" element={<Personal />}></Route>
                <Route path="contact/edit" element={<Contact />}></Route>
                <Route path="animals/edit" element={<Animals />}></Route>
                <Route path="animals/profiles" element={<AnimalProfiles />}></Route>
              </Route>
            </Route>
            {/* Sitter protected routes */}

          </Route>
        </Routes>
      </ThemeProvider>
    </>
  )
}

export default App
