import React from "react";
import './Navbar.css'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import Logout from '@mui/icons-material/Logout';
import { Avatar, Box, Badge, Tooltip, Link, Button, Container, IconButton, Menu, MenuItem, Divider, ListItemIcon } from '@mui/material';
import axios from "axios"
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
const Navbar = () => {

    const { auth, setAuth } = useAuth()

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const navigate = useNavigate();
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            await axios.post('https://localhost:5000/authentication/logout', {}, { withCredentials: true });
            setAuth({})
            localStorage.removeItem('auth')
            navigate("/")
            
            // sitter newtestloginnn stringgggggggg
            // owner ownerrrrFrontender  123456789
            // full sitter   sitterohsitter  stringgg
            // full owner    ownerohowner   stringgg
        } catch (error) {
            console.error('Ошибка выхода:', error);
        } finally {
            handleClose(); 
        }
    };

    const linkStyle = {
        fontSize: '18px',
        color: '#6b7280',
        fontWeight: 700,
        textDecoration: 'none',
        '&:hover': {
            color: '#2b2b2b',
        },
    }

    return (

        <Box
            sx={{
                width: '100%',
                padding: '15px 10%',
                background: '#D0EFB1',
                boxSizing: 'border-box',
            }}
        >
            {/* <Container maxWidth="lg" sx ={{width:'100%',margin:'0,auto',
                '&>*':{transform:'scale(var(--scale,1))', 
                transformOrigin:'center', 
                transition: 'transform 0.2s ease-in-out',}}}> */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        gap: '15px',
                        alignItems: 'center',
                    }}
                >
                    <Link href="/" sx={linkStyle}>Ситтеры</Link>
                        {auth?.role?.includes('Sitter') && (
                            <>
                                <Link href="/profile/personal/edit" sx={linkStyle}>Личный кабинет</Link>
                                <Link href="/" sx={linkStyle}>Заявки</Link>
                            </>
                        )}
                        {auth?.role?.includes('Owner') && (
                            <>
                                <Link href="/profile/personal/edit" sx={linkStyle}>Личный кабинет</Link>
                                <Link href="/" sx={linkStyle}>Бронирование</Link>
                            </>
                        )}
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        gap: '25px',
                        alignItems: 'center',
                    }}
                >
                    {(auth?.role?.includes('Sitter') || auth?.role?.includes('Owner')) ? (
                        <>
                            <Badge color="error" badgeContent={0} max={99}>
                                <Tooltip title="Уведомления" placement="right-end" enterDelay={1500}>
                                    <Link href="#" underline="none">
                                        <NotificationsRoundedIcon style={{ color: '#6b7280' }} />
                                    </Link>
                                </Tooltip>
                            </Badge>

                            <Tooltip title="Сообщения" placement="right-end" enterDelay={1500}>
                                <Link href="#" underline="none">
                                    <MailRoundedIcon style={{ color: '#6b7280' }} />
                                </Link>
                            </Tooltip>
                            {/* <Link href="#" underline="none">
                                <Avatar

                                    src="https://example.com/your-image-url.jpg"
                                    alt="Н"
                                    sx={{ width: 32, height: 32 }}
                                />
                            </Link> */}

                            {/* <Box sx={{ display: 'flex', alignItems: 'center', textAlign: 'center' }}> */}
                            <Tooltip title="Личная информация" placement="right-end">
                                <IconButton sx={{ padding: 0, margin: 0 }}
                                    onClick={handleClick}
                                    size="small"
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <Avatar src="https://example.com/your-image-url.jpg" sx={{ width: 32, height: 32 }}>Н</Avatar>
                                </IconButton>
                            </Tooltip>
                            {/* </Box> */}
                            <Menu
                                anchorEl={anchorEl}
                                id="account-menu"
                                open={open}
                                onClose={handleClose}
                                onClick={handleClose}
                                slotProps={{
                                    paper: {
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&::before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={handleClose}>
                                    <Avatar /> Profile
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={handleLogout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Выход
                                </MenuItem>
                            </Menu>
                        </>
                    ) : (
                        <>
                            <Link href="authentication/register">
                                <Button variant="contained" color="primary">Зарегистрироваться</Button>
                            </Link>
                            <Link href="authentication/login">
                                <Button variant="contained">Войти</Button>
                            </Link>
                        </>
                    )}

                </Box>
            </Box>
            {/* </Container> */}
        </Box>
    )
}

export default Navbar;