import React from 'react'
import { Paper, Dialog, DialogContent, DialogTitle, Typography, Box, Link, Button, IconButton, Tooltip, TextareaAutosize } from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const RequestCard = () => {

    const hasProfileAnimals = true

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <Paper elevation={3} sx={{ border: '3px solid #6b7280', borderRadius: 3, backgroundColor: '#b3d89c', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: 'max-content' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        <Link href="" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>Виталий Войтинцев</Link>
                    </Box>

                    <Box sx={{ marginLeft: 'auto' }}>
                        <Typography sx={{ color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>22.04.2025</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животные: </Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>Кошки (2)</Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>Собаки (1) </Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>Рептилии (1)</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Период передержки: </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px' }}>14.04.2025</Typography>
                    <ArrowRightAltIcon />
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px' }}>22.04.2025</Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>(8 суток)</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Примерная стоимость передержки: </Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold', fontSize: '18px' }}>1200 ₽</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Статус: </Typography>
                    {/* <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#4D7298', borderRadius: '12px', padding: '4px 8px' }}>Новая</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px 8px' }}>Принято</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px 8px' }}>Отклонено</Typography> */}
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#6b7280', borderRadius: '12px', padding: '4px 8px' }}>Просмотрено</Typography>
                </Box>

                <Box sx={{ display: 'flex', marginTop: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button variant='contained'>Принять</Button>
                        <Button variant='contained' color='error'>Отклонить</Button>
                    </Box>
                    <Box>
                        <Tooltip title='Подробнее' placement='top'>
                            <IconButton onClick={handleClickOpen}>
                                <InfoIcon sx={{ fill: '#6b7280', fontSize: '30px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
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
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        <Link component={RouterLink} to="/requests" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>Виталий Войтинцев</Link>
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
                            Сообщение от владельца данному ситеру  Сообщение от владельца данному ситеру  Сообщение от владельца данному ситеру  Сообщение от владельца данному ситеру Сообщение от владельца данному ситеру Сообщение от владельца данному ситеру Сообщение от владельца данному ситеру Сообщение от владельца данному ситеру Сообщение от владельца данному ситеру
                        </Typography>
                    </Box>

                    <Box sx={{ padding: '4px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '20px', cursor: 'pointer' }}>Питомцы владельца: </Typography>
                    </Box>

                    {(hasProfileAnimals ? (<>
                        <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px', flexWrap: 'wrap' }}>
                            <Link component={RouterLink} to="/" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                                fontWeight: 'bold', color: '#fff', fontSize: '16px', background: '#4D7298', padding: '4px 8px', borderRadius: '8px', '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>Бася</Link>
                            <Link component={RouterLink} to="/" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                                fontWeight: 'bold', color: '#fff', fontSize: '16px', background: '#4D7298', padding: '4px 8px', borderRadius: '8px', '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>Муся</Link>
                            <Link component={RouterLink} to="/" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                                fontWeight: 'bold', color: '#fff', fontSize: '16px', background: '#4D7298', padding: '4px 8px', borderRadius: '8px', '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>Метяся</Link>
                        </Box>
                    </>) : (<>
                        <Typography sx={{
                            color: '#fff',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginTop: '10px',
                            background: '#4D7298',
                            padding: '4px 8px',
                            borderRadius: '8px',
                            maxWidth: 'fit-content'
                        }}>Владелец не указывал профили своих питомцев</Typography>
                    </>))}

                </DialogContent>
            </Dialog>
        </>
    )
}

export default RequestCard