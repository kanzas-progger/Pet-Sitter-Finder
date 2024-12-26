import React from 'react'
import { Paper, Box, Typography, Divider, Button, TextField, InputAdornment } from "@mui/material"

const EditContact = () => {
    return (
        <>
            <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Контактная информация
                    <Divider sx={{ marginTop: '20px' }} />
                </Typography>

                <Box sx={{ marginTop: '20px' }}>
                    <Typography sx={{ color: '#6b7280' }}>Укажите, как с вами смогут связываться ситтеры</Typography>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Электронная почта</Typography>
                    <TextField
                        id="profile-link"
                        size="small"
                        sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Номер мобильного телефона</Typography>
                    <TextField
                        id="profile-link"
                        size="small"
                        type='number'
                        sx={{
                            width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' }, '& input[type=number]': {
                                '-moz-appearance': 'textfield'
                            },
                            '& input[type=number]::-webkit-outer-spin-button': {
                                '-webkit-appearance': 'none',
                                margin: 0
                            },
                            '& input[type=number]::-webkit-inner-spin-button': {
                                '-webkit-appearance': 'none',
                                margin: 0
                            }
                        }}
                        slotProps={{
                            input: {
                                startAdornment: <InputAdornment position="start">+</InputAdornment>,
                            },
                        }}
                    />

                </Box>

                <Button variant="contained" color="primary" sx={{ marginTop: '30px' }}>
                    Сохранить
                </Button>
            </Paper>
        </>
    )
}

export default EditContact