import React from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import { Box, Paper, Link, Avatar, Typography, Button, ImageList, ImageListItem } from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getFullSitterProfile } from '../../api/sitters'
import useAuth from '../../hooks/useAuth'
import { useState, useEffect } from 'react'

const FullProfile = () => {

    const { auth, setAuth } = useAuth()
    const [sitter, setSitter] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getFullSitterProfile()
                setSitter(response.data)
                console.log(response.data)
            } catch (e) {
                console.error("Error of receiving sitters: ", e)
            }
        }

        fetchData()
    }, [])

    const photos = [
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        "https://images.unsplash.com/photo-1737467026661-31b5a87098fe?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
        "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",

    ];

    const [openSlider, setOpenSlider] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleOpenSlider = (index) => {
    setCurrentIndex(index);
    setOpenSlider(true);
  };

  const handleCloseSlider = () => {
    setOpenSlider(false);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

    return (
        <>
            <Navbar />
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
                    width: '340px',
                    flexShrink: 0
                }}>
                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Link href="#" underline="none">
                                    <Avatar

                                        src={`https://localhost:5000${sitter.profileImage}`}
                                        alt="Н"
                                        sx={{ width: 128, height: 128 }}
                                    />
                                </Link>
                            </Box>
                            <Box sx={{ padding: '0 20px', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                <Link href={`https://localhost:5000/${sitter.login}`} underline="none" sx={{
                                    fontWeight: 'bold', fontSize: '25px', color: 'black', '&:hover': {
                                        textDecoration: 'underline',
                                        textDecorationColor: 'inherit',
                                    },
                                }}>{sitter.firstname} {sitter.lastname}</Link>


                                <Typography sx={{ color: '#6b7280', marginTop: '10px' }}>Ситтер, {sitter.age} лет</Typography>
                                <Typography sx={{ color: '#6b7280' }}>{sitter.country}, {sitter.city}, {sitter.address}</Typography>
                                {(auth?.role?.includes('Sitter') || auth?.role?.includes('Owner')) ? (
                                    <>
                                        <Button variant="contained" sx={{ marginTop: '10px' }}>Отправить сообщение</Button>
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{
                                            borderRadius: '3px',
                                            textAlign: 'center',
                                            color: '#6b7280',
                                            backgroundColor: '#b3d89c',
                                            fontSize: '13px',
                                            fontWeight: 'bold',
                                            marginTop: '10px'
                                        }}>Отправлять сообщения могут только автризованные пользователи</Typography>
                                    </>
                                )}

                            </Box>
                        </Box>
                    </Paper>

                    {/* <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Стоимость передержки</Typography>
                            <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px', padding: '0 20px', marginLeft: '10px' }}>
                                <Typography sx={{ fontSize: '25px', fontWeight: 'bold', }}>{sitter.pricePerDay} ₽</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>за сутки</Typography>
                            </Box>
                        </Box>
                    </Paper> */}

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Передержка животных</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', padding: '0 10px', marginLeft: '10px' }}>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>Собаки</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Средний рейтинг</Typography>
                            <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px', marginLeft: '8px' }}>


                                <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, fontSize: '40px', marginLeft: '10px' }} />
                                <Typography sx={{ fontSize: '25px', fontWeight: 'bold', marginTop: '5px' }}>4.68</Typography>
                                <Typography sx={{ color: '#6b7280', marginTop: '13px' }}>Количество отзывов: {sitter.rateCount}</Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Контакты</Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '15px', gap: '10px', marginLeft: '1px' }}>
                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <PhoneRoundedIcon sx={{
                                        color: 'white',
                                        backgroundColor: '#4D7298',
                                        borderRadius: '50%',
                                        fontSize: '30px',
                                        padding: '6px'
                                    }} />
                                    <Typography sx={{ marginTop: '2px' }}>{sitter.phoneNumber}</Typography>
                                </Box>

                                <Box sx={{ display: 'flex', gap: '10px' }}>
                                    <EmailRoundedIcon sx={{
                                        color: 'white',
                                        backgroundColor: '#4D7298',
                                        borderRadius: '50%',
                                        fontSize: '30px',
                                        padding: '6px'
                                    }} />
                                    <Typography sx={{ marginTop: '2px' }}>{sitter.email}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Мои фото</Typography>

                        <ImageList variant="quilted" cols={3} gap={8} sx={{ marginTop: '20px', borderRadius: 4, overflow: 'hidden' }}>
                            {photos.map((photo, index) => (
                                photos.length > 6 && index === 5 ? (
                                    <ImageListItem key={index} cols={1} rows={1}>
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                backgroundColor: '#4D7298',
                                                borderRadius: 4,
                                                '&:hover': {
                                                    backgroundColor: '#3B5A75',
                                                },
                                            }}
                                        >
                                            <CameraAltIcon sx={{ fontSize: 40, color: 'white' }} />
                                            <Typography
                                                sx={{
                                                    marginLeft: 1,
                                                    fontWeight: 'bold',
                                                    fontSize: '16px',
                                                    color: 'white',
                                                }}
                                            >
                                                {photos.length} фото
                                            </Typography>
                                        </Box>
                                    </ImageListItem>
                                ) : index < 6 ? (
                                    <ImageListItem
                                        key={index}
                                        cols={1}
                                        rows={1}
                                        onClick={() => handleOpenSlider(index)}
                                        sx={{
                                            position: 'relative',
                                            overflow: 'hidden',
                                            borderRadius: 4,
                                            '&:hover': {
                                                '& img': {
                                                    filter: 'brightness(70%)',
                                                },
                                                '& .hover-overlay': {
                                                    opacity: 0.8,
                                                },
                                                '& .visibility-icon': {
                                                    opacity: 1,
                                                },
                                            },
                                        }}
                                    >
                                        <img
                                            src={photo}
                                            alt={`Фото ${index + 1}`}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                transition: 'filter 0.2s ease',
                                            }}
                                        />
                                        {/* Overlay for background color */}
                                        <Box
                                            className="hover-overlay"
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: '#3B5A75',
                                                opacity: 0,
                                                transition: 'opacity 0.2s ease',
                                            }}
                                        />
                                        {/* Visibility Icon */}
                                        <Box
                                            className="visibility-icon"
                                            sx={{
                                                position: 'absolute',
                                                top: '50%',
                                                left: '50%',
                                                transform: 'translate(-50%, -50%)',
                                                opacity: 0,
                                                transition: 'opacity 0.2s ease',
                                                color: 'white',
                                            }}
                                        >
                                            <VisibilityIcon sx={{ fontSize: 40 }} />
                                        </Box>
                                    </ImageListItem>
                                ) : null
                            ))}
                        </ImageList>

                        {/* <Dialog open={openSlider} onClose={handleCloseSlider} maxWidth="lg">
        <DialogContent sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <IconButton
            onClick={handlePrev}
            sx={{ position: 'absolute', left: 0, zIndex: 10 }}
          >
            <ArrowBack />
          </IconButton>
          <img
            src={photos[currentIndex]}
            alt={`Фото ${currentIndex + 1}`}
            style={{ maxHeight: '80vh', maxWidth: '100%' }}
          />
          <IconButton
            onClick={handleNext}
            sx={{ position: 'absolute', right: 0, zIndex: 10 }}
          >
            <ArrowForward />
          </IconButton>
          <IconButton
            onClick={handleCloseSlider}
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              zIndex: 20,
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#f0f0f0' },
            }}
          >
            <Close />
          </IconButton>
        </DialogContent>
      </Dialog> */}

                    </Paper>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Обо мне</Typography>
                        <Typography sx={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px', textAlign: 'left' }}>
                            Добрый день, меня зовут Лера я очень люблю животных и готова позаботиться о ваших любимцах пока вы занимаетесь делами✨

                            Мой опыт:
                            -Жила в большой семье где всегда были питомцы
                            -Увлекаюсь дрессировкой исключительно на позитивном подкреплении
                            -У меня есть маленькая дружелюбная и активная собачка (на фото видно) которая станет отличной компанией вашему питомцу

                            🔥Работаю из дома так что они всегда будут под присмотром

                            Могу взять маленьких и средних собачек или не агрессивную по отношению к собачкам кошку
                        </Typography>
                    </Paper>

                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Отзывы</Typography>

                        <Box sx={{ marginTop: '20px' }}>
                            <Box sx={{ display: 'flex', gap: '20px' }}>
                                <Avatar

                                    src={`https://localhost:5000${sitter.profileImage}`}
                                    alt="Н"
                                    sx={{ width: 64, height: 64 }}
                                />
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Иван Иванов</Typography>
                                    <Typography>
                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, marginRight: '5px' }} />
                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, marginRight: '5px' }} />
                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, marginRight: '5px' }} />
                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, marginRight: '5px' }} />
                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, marginRight: '5px' }} />
                                    </Typography>
                                    <Typography>
                                        Мне кажется моя маленькая капризная Марфа обрела настоящую добрую няню.
                                        С первого дня контакт. Постоянные отчеты. Отличная добрая атмосфера. Очень рекомендую
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Typography sx={{ color: '#6b7280', marginTop: '5px' }}>23.04.22</Typography>
                                        <DeleteIcon sx={{ fill: '#f44336', fontSize:'30px', '&:hover':{fill: '#c9372c'}}} />
                                    </Box>
                                </Box>
                            </Box>
                        </Box>

                        

                    </Paper>
                </Box>

            </Box>
        </>
    )
}

export default FullProfile