import React from 'react'
import { Paper, Avatar, Box, Link, Typography, Divider } from "@mui/material"
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Link as RouterLink, useLocation } from 'react-router-dom'

const ProfileMenu = () => {

    const [ownerProfile, setOwnerProfile] = useState([])

    const dividerRefs = {
        personal: React.createRef(),
        animals: React.createRef(),
        contact: React.createRef(),
      };

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            "https://localhost:5000/api/owners/profile/personal/edit",
            {
              withCredentials: true
  
            })
          setOwnerProfile(response.data)
        } catch (e) {
          console.error("Error of receiving ownerProfile: ", e)
        }
      }
  
      fetchData()
    }, [])

    const linkStyle = (isActive) => ({
        fontWeight: 'bold',
        textDecoration: 'none',
    color: isActive ? 'white' : '#6b7280',
   padding: '20px',
   backgroundColor: isActive ? '#4D7298' : 'transparent'
    })

    const ProfileMenuLink = ({ to, children, upperDividerRef, lowerDividerRef}) => {
        const location = useLocation(); 
    const isActive = location.pathname === to; 

    return (
        <RouterLink to={to}
        style={linkStyle(isActive)}
        onMouseEnter={(e) => {
            if(!isActive)
            {
                e.target.style.color = '#2b2b2b';
            e.target.style.backgroundColor = '#e0e0e0';
            if (upperDividerRef?.current) {
                upperDividerRef.current.style.opacity = '0';
              }
              if (lowerDividerRef?.current) {
                lowerDividerRef.current.style.opacity = '0';
              }
            }
            
          }}
          onMouseLeave={(e) => {
            if(!isActive)
            {
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
  
    return (
      <>
  
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            width: '340px',
            flexShrink: 0
          }}>
            <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Link href="#" underline="none">
                  <Avatar
  
                    src={`https://localhost:5000${ownerProfile.profileImage}`}
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
  
            {/* <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}> */}
            <Paper elevation={3} sx={{ width: '100%', boxSizing: 'border-box' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
  
                {/* <Link href="/personal/edit"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#6b7280',
                    padding: '20px',
                    '&:hover': {
                      color: '#2b2b2b',
                      backgroundColor: '#e0e0e0',
                    },
                    '&:hover + .MuiDivider-root': {
                      opacity: 0
                    }
                  }}>Личная информация</Link>
                <Divider variant='middle' />
                <Link href="/animals/edit"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#6b7280',
                    padding: '20px',
                    '&:hover': {
                      color: '#2b2b2b',
                      backgroundColor: '#e0e0e0',
                    },
                    '&:hover + .MuiDivider-root': {
                      opacity: 0
                    }
                  }}>Профили животных</Link>
                <Divider variant='middle' /> */}
  
                {/* <Link href="/contact/edit"
                  sx={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#6b7280',
                    padding: '20px',
                    '&:hover': {
                      color: '#2b2b2b',
                      backgroundColor: '#e0e0e0',
                    },
                  }}>Контакты</Link> */}
                  {/* <RouterLink to="/profile/contact/edit"
                  style={{
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    color: '#6b7280',
                    padding: '20px'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#2b2b2b';
                    e.target.style.backgroundColor = '#e0e0e0';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#6b7280';
                    e.target.style.backgroundColor = 'transparent';
                  }}
                  >Контакты</RouterLink> */}
                  <ProfileMenuLink to={'/profile/personal/edit'} 
                  lowerDividerRef={dividerRefs.personal}  >
                  Личная информация</ProfileMenuLink>
                  <Divider ref={dividerRefs.personal} variant="middle" />
                  <ProfileMenuLink to={'/profile/animals/edit'} 
                  lowerDividerRef={dividerRefs.animals}
                  upperDividerRef={dividerRefs.personal} >
                  Мои животные</ProfileMenuLink>
                  <Divider ref={dividerRefs.animals} variant="middle" />
                  <ProfileMenuLink to={'/profile/contact/edit'} upperDividerRef={dividerRefs.animals}
                  >Контакты</ProfileMenuLink>
              </Box>
            </Paper>
          </Box>
      </>
  
    )
}

export default ProfileMenu


// import React from 'react'
// import { Paper, Avatar, Box, Typography, Divider } from "@mui/material"
// import { Link as RouterLink, useLocation } from 'react-router-dom'
// import { useState, useEffect } from 'react'
// import axios from 'axios'

// const ProfileMenu = () => {
//     const [ownerProfile, setOwnerProfile] = useState([])
//     const location = useLocation()

//     useEffect(() => {
//       const fetchData = async () => {
//         try {
//           const response = await axios.get(
//             "https://localhost:5000/api/owners/profile/personal/edit",
//             {
//               withCredentials: true
//             })
//           setOwnerProfile(response.data)
//         } catch (e) {
//           console.error("Error of receiving ownerProfile: ", e)
//         }
//       }
  
//       fetchData()
//     }, [])

//     const linkStyle = (path) => ({
//       fontWeight: 'bold',
//       textDecoration: 'none',
//       color: '#6b7280',
//       padding: '20px',
//       backgroundColor: location.pathname === path ? '#ffebee' : 'transparent',
//       display: 'block',
//       '&:hover': {
//         color: '#2b2b2b',
//         backgroundColor: location.pathname === path ? '#ffebee' : '#e0e0e0',
//       },
//       '&:hover + .MuiDivider-root': {
//         opacity: 0
//       }
//     })
  
//     return (
//       <Box sx={{
//         display: 'flex',
//         flexDirection: 'column',
//         gap: '20px',
//         width: '340px',
//         flexShrink: 0
//       }}>
//         <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
//           <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
//             <RouterLink to="#" style={{ textDecoration: 'none' }}>
//               <Avatar
//                 src={`https://localhost:5000${ownerProfile.profileImage}`}
//                 alt="Н"
//                 sx={{ width: 64, height: 64 }}
//               />
//             </RouterLink>
//             <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//               <RouterLink to="#" style={{
//                 textDecoration: 'none',
//                 fontWeight: 'bold',
//                 fontSize: '18px',
//                 color: 'black',
//                 '&:hover': {
//                   textDecoration: 'underline',
//                   textDecorationColor: 'inherit',
//                 }
//               }}>Фамилия Имя</RouterLink>
//               <Typography sx={{ color: '#6b7280' }}>user_login</Typography>
//             </Box>
//           </Box>
//         </Paper>

//         <Paper elevation={3} sx={{ width: '100%', boxSizing: 'border-box' }}>
//           <Box sx={{ display: 'flex', flexDirection: 'column' }}>
//             <RouterLink 
//               to="/profile/personal/edit"
//               style={linkStyle('/profile/personal/edit')}
//               component={Typography}
//             >
//               Личная информация
//             </RouterLink>
//             <Divider variant='middle' />
            
//             <RouterLink 
//               to="/profile/animals/edit"
//               style={linkStyle('/profile/animals/edit')}
//               component={Typography}
//             >
//               Профили животных
//             </RouterLink>
//             <Divider variant='middle' />
            
//             <RouterLink 
//               to="/profile/contact/edit"
//               style={linkStyle('/profile/contact/edit')}
//               component={Typography}
//             >
//               Контакты
//             </RouterLink>
//           </Box>
//         </Paper>
//       </Box>
//     )
// }

// export default ProfileMenu