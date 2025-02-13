import React from 'react'
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { Box, Paper, Avatar, Typography, Link, TextField } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const Request = () => {

    const location = useLocation();
    const navigate = useNavigate();
    const { animals, pricePerDay } = location.state || {}

    // useEffect(() => {
    //     if (!animals || !pricePerDay) {
    //         navigate("/"); 
    //     }
    // }, [animals, pricePerDay, navigate]);

    // if (!animals || !pricePerDay) return null;

    return (
        <>
            <Box sx={{
                padding: '20px 10%',
                display: 'flex',
                gap: '20px',
                width: '100%',
                flexDirection: 'column'
            }}>
                <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Avatar sx={{ width: 64, height: 64 }}>

                            </Avatar>
                            <Link href="#" underline="none" sx={{
                                fontWeight: 'bold', fontSize: '18px', color: 'black', '&:hover': {
                                    textDecoration: 'underline',
                                    textDecorationColor: 'inherit',
                                },
                            }}>Ситтер Ситтеров</Link>
                        </Box>

                    </Box>
                </Paper>

                <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                    <Typography sx={{ textAlign: 'center', fontWeight: 'bold', color: 'black', fontSize: '32px', padding: '0 20px' }}>
                        Оставить заявку
                    </Typography>
                    <Box sx={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                        <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px' }}>
                            Животные
                        </Typography>

                        <Typography sx={{ fontWeight: 'bold', color: 'black', fontSize: '22px', marginTop:'20px' }}>
                            Период передержки
                        </Typography>

                        <Box sx={{ display: 'flex', gap:'20px', marginTop:'20px' }}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label="Отдадите"
                                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                                    format="DD.MM.YYYY"
                                />
                                <DatePicker
                                    label="Заберете"
                                    format="DD.MM.YYYY"
                                    sx={{ backgroundColor: "white", borderRadius: "4px" }}
                                />
                            </LocalizationProvider>
                        </Box>


                    </Box>
                </Paper>
            </Box>
        </>
    )
}

export default Request