import React from 'react'
import { Paper, Dialog, DialogContent, DialogTitle, Typography, Box, Link, Button, IconButton, Tooltip } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getShortSitterProfile } from '../../api/sitters';
import { getShortOwnerProfile } from '../../api/owners';

const RequestCard = ({ request = [] }) => {

    const {
        requestId,
        sitterId,
        ownerId,
        createdAt,
        startDate,
        endDate,
        ownerMessage,
        status,
        totalPrice,
        requestAnimals
    } = request

    const { auth, setAuth } = useAuth()

    const hasProfileAnimals = true

    const [open, setOpen] = useState(false);
    const [shortProfile, setShortProfile] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth?.role?.includes('Sitter')) {
                    const response = await getShortOwnerProfile(ownerId)
                    setShortProfile(response.data) //firstname lastname login
                } else {
                    const response = await getShortSitterProfile(sitterId)
                    setShortProfile(response.data)
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [shortProfile])

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    const formatDate = (date) => {
        const formatedDate = new Date(date).toLocaleDateString('ru-RU')
        return formatedDate
    }

    const getDays = () => {
        const date1 = new Date(startDate)
        const date2 = new Date(endDate)

        date1.setUTCHours(0, 0, 0, 0)
        date2.setUTCHours(0, 0, 0, 0)

        const difference = Math.abs(date2 - date1)
        const diffDays = Math.floor(difference / (1000 * 60 * 60 * 24))

        let diffDaysValidString = `${diffDays} суток`
        if (diffDays === 1) {
            diffDaysValidString = `${diffDays} сутки`
        }

        return diffDaysValidString;
    }

    const animalTranslations = {
        "Dog": "Собаки",
        "Cat": "Кошки",
        "FarmPet": "Фермерские животные",
        "Spider": "Пауки",
        "Reptile": "Рептилии",
        "SmallPet": "Грызуны",
        "Bird": "Птички",
        "Fish": "Рыбки",
    };

    return (
        <>
            <Paper elevation={3} sx={{ border: '3px solid #6b7280', borderRadius: 3, backgroundColor: '#b3d89c', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: 'max-content' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                        {auth?.role?.includes('Sitter') ? (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        ) : (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос к ситтеру</Typography>
                        )}

                        <Link href={`https://localhost:5173/${shortProfile?.login}`} target="_blank" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>{shortProfile?.firstname} {shortProfile?.lastname}</Link>
                    </Box>

                    <Box sx={{ marginLeft: 'auto' }}>
                        <Typography sx={{ color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>{formatDate(createdAt)}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животные: </Typography>
                    {requestAnimals.map((a) => (
                        <Typography key={a.name} sx={{ color: '#6b7280', fontWeight: 'bold' }}>{animalTranslations[a.name]} ({a.count})</Typography>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Профили животных: </Typography>
                    <Typography sx={{
                        fontWeight: 'bold',
                        color: '#6b7280',
                        '&:hover': {
                            textDecoration: 'underline',
                            textDecorationColor: 'inherit',
                        },
                    }}>Бася
                    </Typography>
                    <Typography sx={{
                        fontWeight: 'bold',
                        color: '#6b7280',
                        '&:hover': {
                            textDecoration: 'underline',
                            textDecorationColor: 'inherit',
                        },
                    }}>Метяся
                    </Typography>

                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Период передержки: </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px' }}>{formatDate(startDate)}</Typography>
                    <ArrowRightAltIcon />
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px' }}>{formatDate(endDate)}</Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>{getDays()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Примерная стоимость передержки: </Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold', fontSize: '18px' }}>{totalPrice} ₽</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Статус: </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#4D7298', borderRadius: '12px', padding: '4px 8px' }}>{status}</Typography>
                    {/* <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px 8px' }}>Принято</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px 8px' }}>Отклонено</Typography>  */}
                    {/* <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#6b7280', borderRadius: '12px', padding: '4px 8px' }}>Просмотрено</Typography> */}
                </Box>

                <Box sx={{ display: 'flex', marginTop: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        {auth?.role?.includes('Sitter') ? (<>
                            <Button variant='contained'>Принять</Button>
                            <Button variant='contained' color='error'>Отклонить</Button>
                        </>) : (<>
                            <Button variant='contained' color='error'>Отозвать</Button>
                        </>)}

                    </Box>
                    {ownerMessage !== null && (
                        <Box>
                            <Tooltip title='Подробнее' placement='top'>
                                <IconButton onClick={handleClickOpen}>
                                    <InfoIcon sx={{ fill: '#6b7280', fontSize: '30px' }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                </Box>
            </Paper>


            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{ p: 2, backgroundColor: '#b3d89c', textAlign: 'center' }} id="customized-dialog-title">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', justifyContent: 'center' }}>
                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        <Link component={RouterLink} to="/requests" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>Виталий Войтинцев</Link> */}

                        {auth?.role?.includes('Sitter') ? (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        ) : (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос к ситтеру</Typography>
                        )}

                        <Link href={`https://localhost:5173/${shortProfile?.login}`} target="_blank"  underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>{shortProfile?.firstname} {shortProfile?.lastname}</Link>
                    </Box>

                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[700],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: '#b3d89c' }}>
                    <Box sx={{ padding: '4px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Сообщение от владельца: </Typography>
                        <Typography sx={{ color: '#6b7280', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', overflowWrap: 'break-word' }}>
                            {ownerMessage}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default RequestCard