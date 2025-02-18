import React from 'react'
import { Paper, Avatar, Typography, Box } from '@mui/material'

const FullAnimalProfile = () => {
    return (
        <>
            <Box sx={{
                padding: '20px 10%',
                display: 'flex',
                gap: '20px',
                width: '100%',
                justifyContent:'center'
            }}>
                <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '80%', boxSizing: 'border-box' }}>
                    <Box sx={{ display: 'flex', alignItems:'center'}}>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <Avatar
                                src='https://img.dogsy.ru/dogsy-users-pictures/1080x0/my/Y5/6MqY9k_R0Yy_WDzIYVoQsF2pGZ_T4jPS.jpeg'
                                sx={{ width: 250, height: 250, margin: 5 }}
                            />
                            <Typography sx={{
                                fontWeight: 'bold',
                                backgroundColor: '#b3d89c',
                                fontSize: '24px',
                                color: 'black',
                                padding: '8px 15px',
                                borderRadius: '10px',
                                marginTop: '-20px',
                                boxShadow: 4,
                                cursor: 'pointer'

                            }}>
                                Клык
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '26px', cursor: 'pointer'}}>Профиль питомца</Typography>

                            <Box sx={{ marginTop: '20px', cursor: 'pointer', maxWidth: 'fit-content' }}>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Порода:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>двортерьер</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Пол:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>мужской</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Возраст:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>1 год и 8 месяцев</Typography>
                                </Box>
                            </Box>

                            <Box sx={{ marginTop: '20px' }}>
                                {/* <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>Владелец</Typography>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Имя:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>двортерьер</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Номер телефона:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>+79797979876</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px' }}>Email:</Typography>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', color: '#6b7280' }}>ownermail@yandex.ru</Typography>
                                </Box> */}
                                <Typography sx={{ fontWeight: 'bold', fontSize: '22px', cursor: 'pointer', maxWidth: 'fit-content' }}>Дополнительная информация</Typography>
                                <Typography sx={{
                                    color: '#6b7280',
                                    fontWeight: 'bold',
                                    fontSize: '18px',
                                    cursor: 'pointer',
                                    overflowWrap: 'break-word',
                                    marginTop: '20px'
                                }}>
                                    Дополнительная информация про питомца 
                                </Typography>
                            </Box>

                        </Box>
                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default FullAnimalProfile