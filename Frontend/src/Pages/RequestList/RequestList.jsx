import React from 'react'
import RequestCard from '../../Components/RequestCard/RequestCard'
import { Box, Paper, Typography } from '@mui/material'

const RequestList = () => {
    return (
        <>

            <Box sx={{
                padding: '20px 10%',
                display: 'flex',
                gap: '20px',
                width: '100%',
            }}>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '70%'
                }}>
                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Запросы от владельцев</Typography>
                    </Paper>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '20px',
                            width: '100%'
                        }}>

                            <RequestCard />
                            <RequestCard />
                            <RequestCard />


                        </Box>
                    </Paper>



                </Box>

                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    width: '30%',
                    flexShrink: 0
                }}>
                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Фильтрация</Typography>
                    </Paper>
                </Box>


            </Box>

        </>
    )
}

export default RequestList