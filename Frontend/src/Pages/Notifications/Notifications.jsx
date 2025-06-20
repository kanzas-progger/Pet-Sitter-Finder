import React from 'react'
import ProfileLayout from '../../Components/Layout/ProfileLayout'
import { Box, Paper, Typography, Divider} from '@mui/material'
import NotificationCard from '../../Components/NotificationCard/NotificationCard'

const Notifications = () => {
  return (
    <ProfileLayout>
        <Paper elevation={3} sx={{ backgroundColor:'#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Мои уведомления</Typography>
                <Divider sx={{ marginTop: '20px' }} />

                <Box sx={{ marginTop: '20px' }}>
                    <Box sx={{display:'flex', flexDirection:'column', gap:'10px'}}>
                      <NotificationCard />
                      <NotificationCard />
                      <NotificationCard />
                    </Box>
                </Box>
            </Paper>
    </ProfileLayout>
  )
}

export default Notifications