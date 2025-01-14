import React from 'react'
import ProfileLayout from '../../Components/Layout/ProfileLayout'
import { Paper, Typography, Divider, Box } from '@mui/material'

const AnimalProfiles = () => {
    return (
        <>
            <ProfileLayout>
            <>
            <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Профили ваших животных</Typography>
                <Divider sx={{ marginTop: '20px' }} />

                <Box sx={{ marginTop: '20px' }}>
                    <Typography sx={{ color: '#6b7280' }}>Здесь вы можете создать профили своих животных</Typography>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Электронная почта</Typography>
                    
                </Box>

            </Paper>
        </>
            </ProfileLayout>
        </>

    )
}

export default AnimalProfiles