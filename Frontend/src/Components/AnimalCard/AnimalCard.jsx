import React from 'react'
import { Card, CardMedia, CardContent, Box, Typography, CardActions, Tooltip, IconButton, Dialog, DialogTitle, DialogActions } from '@mui/material'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';

const AnimalCard = () => {
    return (
        <>
            <Card sx={{
                display: 'flex', flexDirection: 'column', width: "100%", maxWidth: '350px', boxShadow: 3,
                borderRadius: 3, backgroundColor: '#b3d89c', marginTop: '20px',
            }}>

                <CardContent>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                        Клык
                    </Typography>
                    <CardMedia
                        sx={{ height: 160, borderRadius: 4, marginTop: '15px', border: '#D0EFB1 solid 3px', boxShadow: 3 }}
                        image="https://img.dogsy.ru/dogsy-users-pictures/1080x0/my/Y5/6MqY9k_R0Yy_WDzIYVoQsF2pGZ_T4jPS.jpeg"
                    />
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Возраст:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            1 год и 8 месяцев
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Пол:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            мужской
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                            Порода:
                        </Typography>
                        <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                            двортерьер
                        </Typography>
                    </Box>
                </CardContent>

                <CardActions sx={{ justifyContent: 'center', marginTop:'-10px' }}>

                    <Tooltip title="Подробнее" placement="top">
                        <IconButton size="small">
                            <HelpOutlineIcon />
                        </IconButton>
                    </Tooltip>


                    <Tooltip title="Изменить" placement="top">
                        <IconButton size="small">
                            <EditNoteOutlinedIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="Удалить" placement="top">
                        <IconButton size="small">
                            <DeleteOutlineIcon />
                        </IconButton>
                    </Tooltip>

                </CardActions>

            </Card>
        </>
    )
}

export default AnimalCard