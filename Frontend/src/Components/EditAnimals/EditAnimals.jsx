import React from 'react'
import { Paper, Typography, Divider, Box, Button } from '@mui/material'

const EditAnimals = () => {
  return (
    <>
     <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Информация о ваших животных</Typography>
                <Divider sx={{ marginTop: '20px' }} />

                <Box sx={{ marginTop: '20px' }}>
                    <Typography sx={{ color: '#6b7280' }}>Здесь вы можете создать профили ваших животных</Typography>

                </Box>

                <Button variant="contained" color="primary" sx={{ marginTop: '30px' }}>
                    Сохранить
                </Button>
            </Paper>
    </>
  )
}

export default EditAnimals