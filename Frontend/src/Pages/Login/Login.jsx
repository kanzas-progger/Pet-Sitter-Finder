import React from "react";
import { useState } from "react";
import './Login.css'
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Typography, Link, Container } from "@mui/material";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useAuth from "../../hooks/useAuth";


const Login = () => {

    const { setAuth } = useAuth()
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        login: '',
        password: '',
    })

    const navigate = useNavigate();

    const handleFormChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [id]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true)

        const dataToSend = {
            ...formData
        }

        try {
            const response = await axios.post('https://localhost:5000/authentication/login', dataToSend,
                { withCredentials: true }
            )
            console.log("Успешный вход!");

            const token = response.data
            const decodedToken = jwtDecode(token)
            const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const userId = decodedToken["id-"];
            setAuth({ userId, role, token })
            navigate("/");
            setIsLoading(false)
        }
        catch (error) {
            console.error("Произошла ошибка входа")
            console.error(response.data)
        }
    };

    return (
        <>
            <Container maxWidth="lg" sx={{
                width: '100%', margin: '0,auto',
                '&>*': {
                    transform: 'scale(var(--scale,1))',
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease-in-out',
                }
            }}>
                <div className="login-container">
                    <Paper elevation={3} sx={{ padding: '30px' }}>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center'
                            }}
                        >
                            <h2>Вход</h2>
                        </Box>
                        <Box component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: 'flex', flexDirection: 'column', gap: '30px', marginTop: '30px' }}>

                            <TextField id="login"
                                label="Логин"
                                variant="outlined"
                                required
                                value={formData.login}
                                onChange={handleFormChange} />
                            <TextField id="password"
                                label="Пароль"
                                variant="outlined"
                                type="password"
                                required
                                value={formData.password}
                                onChange={handleFormChange} />


                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            >
                                <Button type="submit" loading={isLoading} variant="contained" sx={{ fontSize: '16px' }}>Войти</Button>
                            </Box>
                        </Box>

                    </Paper>

                    <Paper elevation={3} sx={{ padding: '15px', marginTop: '30px', marginBottom: '30px' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Typography variant="body2" fontSize="16px">
                                Нет аккаунта?
                            </Typography>
                            <Link
                                href="/authentication/register"
                                underline="none"
                                sx={{
                                    extDecoration: 'none',
                                    marginLeft: '5px',
                                    '&:hover': { textDecoration: 'underline' }
                                }}>
                                Регистрация
                            </Link>
                        </Box>
                    </Paper>
                </div>
            </Container>
        </>
    )
}

export default Login;