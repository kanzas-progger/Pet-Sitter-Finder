import React from 'react'
import MainHeader from '../../Components/MainHeader/MainHeader'
import Navbar from '../../Components/Navbar/Navbar'
import { Paper, Avatar, Box, Link, Typography } from "@mui/material"

const Personal = (isAuthenticated) => {
  return (
    <>
      <MainHeader />
      <Navbar isAuthenticated={isAuthenticated} />

      <Box sx={{
        padding: '20px 10%',
        display: 'flex',
        gap: '20px',
        width: '100%',
        backgroundColor: ''
      }}>

        <Paper elevation={3} sx={{ padding: '20px', width: '400px', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href="#" underline="none">
              <Avatar

                src="https://example.com/your-image-url.jpg"
                alt="Н"
                sx={{ width: 64, height: 64 }}
              />
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="#" underline="none" sx={{
                fontWeight: 'bold', fontSize: '18px', color: 'black', '&:hover': {
                  textDecoration: 'underline',
                  textDecorationColor: 'inherit',
                },
              }}>Фамилия Имя</Link>
              <Typography sx={{ color: '#6b7280' }}>user_login</Typography>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
          <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Личная информация</Typography>
          <Box sx={{ borderBottom: '1px solid black', marginTop: '8px' }} />

        </Paper>


      </Box>

    </>

  )
}

export default Personal