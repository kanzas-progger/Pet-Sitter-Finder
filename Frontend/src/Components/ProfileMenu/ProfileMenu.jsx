import React from 'react'
import { Paper, Avatar, Box, Link, Typography, Divider } from "@mui/material"
import { Link as RouterLink, useLocation } from 'react-router-dom'
import useProfile from '../../hooks/useProfile'
import useAuth from '../../hooks/useAuth'

const ProfileMenu = () => {

  const { auth, setAuth } = useAuth()
  const { profile } = useProfile()

  const dividerRefs = {
    personal: React.createRef(),
    animals: React.createRef(),
    animalProfiles: React.createRef(),
    pricePerDay: React.createRef(),
    contact: React.createRef(),
    photos: React.createRef(),
    boardings: React.createRef(),
    notifications: React.createRef()
  };

  const linkStyle = (isActive) => ({
    fontWeight: 'bold',
    textDecoration: 'none',
    color: isActive ? 'white' : '#6b7280',
    padding: '20px',
    backgroundColor: isActive ? '#4D7298' : 'transparent'
  })

  const ProfileMenuLink = ({ to, children, upperDividerRef, lowerDividerRef }) => {
    const location = useLocation();
    const isActive = location.pathname === to;

    return (
      <RouterLink to={to}
        style={linkStyle(isActive)}
        onMouseEnter={(e) => {
          if (!isActive) {
            e.target.style.color = '#2b2b2b';
            e.target.style.backgroundColor = '#b3d89c';
            if (upperDividerRef?.current) {
              upperDividerRef.current.style.opacity = '0';
            }
            if (lowerDividerRef?.current) {
              lowerDividerRef.current.style.opacity = '0';
            }
          }

        }}
        onMouseLeave={(e) => {
          if (!isActive) {
            e.target.style.color = '#6b7280';
            e.target.style.backgroundColor = 'transparent';
            if (upperDividerRef?.current) {
              upperDividerRef.current.style.opacity = '1';
            }
            if (lowerDividerRef?.current) {
              lowerDividerRef.current.style.opacity = '1'
            }

          }

        }}>
        {children}
      </RouterLink>
    )
  }

  const avatarAlt = profile?.firstname?.[0]?.toUpperCase() || ""

  return (
    <>

      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '340px',
        flexShrink: 0
      }}>
        <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link href={`https://localhost:5173/${profile.login}`} underline="none">
              <Avatar

                src={`https://localhost:5000${profile.profileImage}`}
                sx={{ width: 64, height: 64 }}
              />
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href={`https://localhost:5173/${profile.login}`} underline="none" sx={{
                fontWeight: 'bold', fontSize: '18px', color: 'black', '&:hover': {
                  textDecoration: 'underline',
                  textDecorationColor: 'inherit',
                },
              }}>{profile.firstname} {profile.lastname}</Link>
              <Typography sx={{ color: '#6b7280' }}>{profile.login}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}> */}
        <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>


            <ProfileMenuLink to={'/profile/personal/edit'}
              lowerDividerRef={dividerRefs.personal}>
              Личная информация</ProfileMenuLink>
            <Divider ref={dividerRefs.personal} variant="middle" />

            <ProfileMenuLink to={'/profile/animals/edit'}
              lowerDividerRef={dividerRefs.animals}
              upperDividerRef={dividerRefs.personal} >
              Мои животные</ProfileMenuLink>
            <Divider ref={dividerRefs.animals} variant="middle" />

            {(auth?.role?.includes('Owner')) ? (
              <>
                <ProfileMenuLink to={'/profile/animals/profiles'}
                  lowerDividerRef={dividerRefs.animalProfiles}
                  upperDividerRef={dividerRefs.animals} >
                  Профили моих животных</ProfileMenuLink>
                <Divider ref={dividerRefs.animalProfiles} variant="middle" />

                <ProfileMenuLink to={'/profile/photos/edit'}
                  lowerDividerRef={dividerRefs.photos}
                  upperDividerRef={dividerRefs.animalProfiles} >
                  Фотогаллерея</ProfileMenuLink>
                <Divider ref={dividerRefs.photos} variant="middle" />

                <ProfileMenuLink to={'/profile/contact/edit'}
                  upperDividerRef={dividerRefs.photos}
                  lowerDividerRef={dividerRefs.notifications}
                >Контакты</ProfileMenuLink>
                <Divider ref={dividerRefs.photos} variant="middle" />

              </>) : (
              <>
                <ProfileMenuLink to={'/profile/photos/edit'}
                  lowerDividerRef={dividerRefs.photos}
                  upperDividerRef={dividerRefs.animals} >
                  Фотогаллерея</ProfileMenuLink>
                <Divider ref={dividerRefs.photos} variant="middle" />

                <ProfileMenuLink to={'/profile/boardings/edit'}
                  lowerDividerRef={dividerRefs.boardings}
                  upperDividerRef={dividerRefs.photos} >
                  Объявления</ProfileMenuLink>
                <Divider ref={dividerRefs.boardings} variant="middle" />

                <ProfileMenuLink to={'/profile/contact/edit'}
                  upperDividerRef={dividerRefs.photos}
                  lowerDividerRef={dividerRefs.notifications}
                >Контакты</ProfileMenuLink>
                <Divider ref={dividerRefs.photos} variant="middle" />

              </>)}

            <ProfileMenuLink to={'/profile/notifications'}
              upperDividerRef={dividerRefs.contact} />




          </Box>
        </Paper>
      </Box>
    </>

  )
}

export default ProfileMenu

