import React from 'react'
import { Paper, Box, Typography, Divider, Button, TextField, InputAdornment } from "@mui/material"
import { updateOwnerPersonal } from "../../api/owners"
import { updateSitterPersonal } from '../../api/sitters'
import { useNavigate } from 'react-router'
import useProfile from '../../hooks/useProfile'
import useAuth from '../../hooks/useAuth'

const EditContact = () => {

    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfile()
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { id, value } = e.target
        setProfile(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = async () => {
        try {

            if (auth?.role?.includes('Owner')) {
                const response = await updateOwnerPersonal(profile)
                if (response?.data) {
                    console.log(response.data)
                }
            }
            else if (auth?.role?.includes('Sitter')) {
                const response = await updateSitterPersonal(profile)
                if (response?.data) {
                    console.log(response.data)
                }
            }

            navigate(0)
        } catch (e) {
            console.error(e)
        }
    }


    return (
        <>
            <Paper elevation={3} sx={{ backgroundColor:'#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Контактная информация</Typography>
                <Divider sx={{ marginTop: '20px' }} />

                <Box sx={{ marginTop: '20px' }}>
                    <Typography sx={{ color: '#6b7280' }}>Укажите, как с вами смогут связываться ситтеры</Typography>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Электронная почта</Typography>
                    <TextField
                        id="email"
                        size="small"
                        value={`${profile.email}`}
                        onChange={handleChange}
                        sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Номер мобильного телефона</Typography>
                    <TextField
                        id="phoneNumber"
                        size="small"
                        value={`${profile.phoneNumber}`}
                        onChange={handleChange}
                        sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                    />
                    {/* <TextField
                        id="phoneNumber"
                        size="small"
                        type='number'
                        value={`${profile.phoneNumber}`}
                        onChange={handleChange}
                        sx={{
                            width: '70%', 
                            marginTop: '10px', 
                            '& .MuiOutlinedInput-root': { background: '#e0e0e0' }, '& input[type=number]': {
                                MozAppearance: 'textfield'
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                                WebkitAppearance: 'none',
                                margin: 0
                            }
                        }}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">+7</InputAdornment>,
                            },
                        }}
                    /> */}

                </Box>

                <Button variant="contained" color="primary" onClick={handleSubmit} sx={{ marginTop: '30px' }}>
                    Сохранить
                </Button>
            </Paper>
        </>
    )
}

export default EditContact