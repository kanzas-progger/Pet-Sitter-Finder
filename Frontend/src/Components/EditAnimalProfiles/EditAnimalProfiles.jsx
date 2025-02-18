import React from 'react'
import { Paper, Typography, Divider, Box, Button } from '@mui/material'
import CardBoard from '../CardBoard/CardBoard'
import AnimalCard from '../AnimalCard/AnimalCard'

const EditAnimalProfiles = () => {
    return (
        <>

            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Профили ваших животных</Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop:'20px' }}>
                    <Divider />

                    <Typography sx={{ color: '#6b7280' }}>Здесь вы можете создать профили своих питомцев </Typography>

                    <Button variant="contained" color="primary" sx={{ maxWidth: 'fit-content' }}>
                        Создать профиль питомца
                    </Button>
                    <Divider sx={{marginTop:'5px'}}/>
                </Box>

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '20px',
                        justifyItems: 'center',
                        marginTop:'5px'
                    }}
                >
                    <CardBoard />
 
                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />
                    <AnimalCard />

                </Box>

            </Paper>
        </>
    )
}

export default EditAnimalProfiles