import React from 'react'
import {
    Box, Paper, Link, Avatar, Typography, Button, IconButton,
    ImageList, ImageListItem, Rating, TextareaAutosize, CircularProgress, Dialog, DialogContent
} from '@mui/material'
import StarIcon from '@mui/icons-material/Star';
import PhoneRoundedIcon from '@mui/icons-material/PhoneRounded';
import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import DeleteIcon from '@mui/icons-material/Delete';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getFullSitterProfile } from '../../api/sitters'
import useAuth from '../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { useParams } from "react-router-dom"
import { getUserIdWithRoles } from '../../api/authentication';
import { createReview, deleteReview } from '../../api/reviews';
import Review from '../../Components/Review/Review';
import { useNavigate } from 'react-router-dom';
import { getFullOwnerProfile } from '../../api/owners';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import CardBoard from '../../Components/CardBoard/CardBoard';
import { getBoardsForSitter, deleteBoard, updateBoard } from '../../api/boards';

const FullProfile = () => {

    const { login } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [userIdWithRoles, setUserIdWithRoles] = useState(null);
    const { auth, setAuth } = useAuth()
    const [profile, setProfile] = useState(null)
    const [starsValue, setStarsValue] = React.useState(1);
    const [reviewFormData, setReviewFormData] = useState({
        sitterId: '',
        senderId: '',
        stars: '',
        content: ''
    })
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchUserIdWithRoles = async () => {
            try {
                const response = await getUserIdWithRoles(login)
                console.log(response.data)
                if (response.data.roles.length === 0) {
                    console.log("Пользователя с логином ", login, " не существует") // make logic for page
                }
                else {
                    setUserIdWithRoles({ userId: response.data.userId, roles: response.data.roles })
                }

            } catch (e) {
                console.error("Error of receiving user by login: ", e)
            }
        }
        fetchUserIdWithRoles()
    }, [login])

    useEffect(() => {
        if (!userIdWithRoles?.userId) return

        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (userIdWithRoles.roles.includes('Sitter')) {
                    const [profileResponse, boardsResponse] = await Promise.all([
                        getFullSitterProfile(userIdWithRoles.userId),
                        getBoardsForSitter(userIdWithRoles.userId)
                    ])
                    setProfile({
                        ...profileResponse.data,
                        boards: boardsResponse.data
                    })
                    console.log(boardsResponse.data)
                }
                else if (userIdWithRoles.roles.includes('Owner')) {
                    const response = await getFullOwnerProfile(userIdWithRoles.userId)
                    setProfile(response.data)
                    console.log(response.data)
                }
                else {
                    console.log('Another role')
                }

            } catch (e) {
                console.error("Error of receiving profile: ", e)
            } finally {
                setIsLoading(false);
            }
        }

        fetchData()
    }, [userIdWithRoles])

    const handleReviewContentChange = (e) => {
        const { id, value } = e.target;
        setReviewFormData((prevData) => ({ ...prevData, [id]: value }));
    }

    const handleCreateReview = async () => {
        const dataToSend = {
            ...reviewFormData,
            sitterId: `${profile?.sitterId}`,
            senderId: `${auth?.userId}`,
            stars: parseInt(starsValue, 10),
        }
        console.log("Review data is ", dataToSend);
        try {
            const response = await createReview(dataToSend)
            console.log(response.data)
        } catch (e) {
            console.error(e)
        }
        navigate(0)
    }

    const handleDeleteReview = async ({ sitterId, reviewId }) => {

        const dataToSend = { sitterId, reviewId }
        try {
            await deleteReview(dataToSend)
            setProfile((prevState) => ({
                ...prevState,
                reviews: prevState.reviews.filter(review => review.reviewId !== reviewId),
            }));
        } catch (e) {
            console.error("Error of deleting review ", e)
        }
        //navigate(0)
    }

    const navigateToProfilePersonal = () => {
        navigate('/profile/personal/edit')
    }



    const handleOpenSlider = (index) => {
        setCurrentIndex(index);
        setOpen(true);
    }

    const handleCloseSlider = () => {
        setOpen(false);
    }

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? profile?.profilePhotos.length - 1 : prevIndex - 1))
    }

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex === profile?.profilePhotos.length - 1 ? 0 : prevIndex + 1))
    }

    //Boards

    const handleDeleteBoard = async (id) => {
        try {
            await deleteBoard(id)
            setProfile((prevProfile) => ({
                ...prevProfile,
                boards: prevProfile.boards.filter((board) => board.id !== id)
            }))
        } catch (e) {
            console.error("Error with delete board", e)
        }

    }

    const handleUpdateBoard = async (data) => {
        try {
            const response = await updateBoard(data)
            setProfile((prevProfile) => ({
                ...prevProfile,
                boards: prevProfile.boards.map(board =>
                    board.id === response?.data?.id ? response.data : board
                )
            }))
            
        } catch (e) {
            console.error("Error with update board", e)
        }

    }


    const animalTranslations = {
        Dog: "Собаки",
        Cat: "Кошки",
        FarmPet: "Фермерские животные",
        Spider: "Пауки",
        Reptile: "Рептилии",
        SmallPet: "Грызуны",
        Bird: "Птички",
        Fish: "Рыбки",
    }

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                    backgroundColor: '#b3d89c',
                }}
            >
                <CircularProgress />
                <Typography sx={{ marginLeft: '20px', fontSize: '18px' }}>Идет загрузка...</Typography>
            </Box>
        );
    }

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
                    width: '340px',
                    flexShrink: 0
                }}>
                    <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                        <Box sx={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Link href={`https://localhost:5173/${profile?.login}`} underline="none">
                                    <Avatar

                                        src={`https://localhost:5000${profile?.profileImage}`}
                                        alt="Н"
                                        sx={{ width: 128, height: 128 }}
                                    />
                                </Link>
                            </Box>
                            <Box sx={{ padding: '0 20px', display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                                <Link href={`https://localhost:5173/${profile?.login}`} underline="none" sx={{
                                    fontWeight: 'bold', fontSize: '25px', color: 'black', '&:hover': {
                                        textDecoration: 'underline',
                                        textDecorationColor: 'inherit',
                                    },
                                }}>{profile?.firstname} {profile?.lastname}</Link>

                                {(userIdWithRoles?.roles?.includes('Sitter')) ? (
                                    <>
                                        <Typography sx={{ color: '#6b7280', marginTop: '10px' }}>Ситтер, {profile?.age} лет</Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ color: '#6b7280', marginTop: '10px' }}>Владелец животного, {profile?.age} лет</Typography>
                                    </>
                                )}

                                <Typography sx={{ color: '#6b7280' }}>
                                    {profile?.country || 'Страна не указана'}, {profile?.city || 'город не указан'}, {profile?.address || 'адрес не указан'}
                                </Typography>

                                {auth?.role?.includes('Sitter') || auth?.role?.includes('Owner') ? (
                                    (auth?.userId !== userIdWithRoles.userId) ? (
                                        <Button variant="contained" sx={{ marginTop: '10px' }}>Отправить сообщение</Button>
                                    ) : null
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
                            {(userIdWithRoles?.roles?.includes('Sitter')) ? (
                                <>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Передержка животных</Typography>
                                </>
                            ) : (
                                <>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Мои животные</Typography>
                                </>
                            )
                            }


                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px', padding: '0 10px', marginLeft: '10px' }}>
                                {profile?.animals?.map((animal, index) => (
                                    <Typography key={index} sx={{ color: '#6b7280', marginTop: '5px' }}>
                                        {animalTranslations[animal] || animal}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                    {(userIdWithRoles?.roles.includes('Sitter')) &&
                        <>
                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Средний рейтинг</Typography>
                                    <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px', marginLeft: '8px' }}>


                                        <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, fontSize: '40px', marginLeft: '10px' }} />
                                        <Typography sx={{ fontSize: '25px', fontWeight: 'bold', marginTop: '5px' }}>{profile?.rating}</Typography>
                                        <Typography sx={{ color: '#6b7280', marginTop: '13px' }}>Количество отзывов: {profile?.rateCount}</Typography>
                                    </Box>
                                </Box>
                            </Paper>
                        </>
                    }

                    {(profile?.email.trim() !== "" || profile?.phoneNumber.trim() !== "") && (
                        <>
                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', padding: '0 20px' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Контакты</Typography>

                                    <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '15px', gap: '10px', marginLeft: '1px' }}>
                                        {(profile?.phoneNumber.trim() !== "") && (<>
                                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                                <PhoneRoundedIcon sx={{
                                                    color: 'white',
                                                    backgroundColor: '#4D7298',
                                                    borderRadius: '50%',
                                                    fontSize: '30px',
                                                    padding: '6px'
                                                }} />
                                                <Typography sx={{ marginTop: '2px' }}>{profile?.phoneNumber}</Typography>
                                            </Box>
                                        </>)}

                                        {(profile?.email.trim() !== "") && (<>
                                            <Box sx={{ display: 'flex', gap: '10px' }}>
                                                <EmailRoundedIcon sx={{
                                                    color: 'white',
                                                    backgroundColor: '#4D7298',
                                                    borderRadius: '50%',
                                                    fontSize: '30px',
                                                    padding: '6px'
                                                }} />
                                                <Typography sx={{ marginTop: '2px' }}>{profile?.email}</Typography>
                                            </Box>
                                        </>)}

                                    </Box>
                                </Box>
                            </Paper>
                        </>)}

                </Box>







                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', boxSizing: 'border-box' }}>
                    {(profile?.profilePhotos?.length === 0 && profile?.about.trim() === "") && (<>
                        <Paper elevation={3} sx={{
                            backgroundColor: '#D0EFB1',
                            padding: '20px',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '25px' }}>Информация о профиле</Typography>
                                <TextSnippetIcon sx={{ color: '#6b7280', fontSize: '100px', marginTop: '100px' }} />

                                {(auth?.userId === userIdWithRoles?.userId) ? (
                                    <>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px' }}>Нет информации о профиле</Typography>
                                        <Typography sx={{ color: '#6b7280' }}>
                                            Напишите пару абзацев о себе.
                                            Вы также можете добавить фото к своему профилю в личном кабинете
                                        </Typography>
                                        <Button onClick={navigateToProfilePersonal} variant="contained" sx={{ marginTop: '10px', marginBottom: '194px' }}>
                                            Личный кабинет
                                        </Button>
                                    </>) : (
                                    <>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px', marginBottom: '264px' }}>Нет информации о профиле</Typography>

                                    </>
                                )}

                            </Box>
                        </Paper>
                    </>)}

                    {(profile?.profilePhotos?.length > 0) &&
                        <>
                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Мои фото</Typography>
                                <ImageList
                                    cols={3}
                                    gap={8}
                                    sx={{
                                        marginTop: '20px',
                                        maxWidth: '100%',
                                        height: 'auto',
                                    }}
                                >
                                    {profile?.profilePhotos.map((photo, index) => (
                                        profile?.profilePhotos.length > 6 && index === 5 ? (
                                            <ImageListItem
                                                key={index}
                                                cols={1}
                                                rows={1}
                                                sx={{
                                                    aspectRatio: '1 / 1',
                                                }}
                                                onClick={() => handleOpenSlider(5)}
                                            >
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
                                                        {profile?.profilePhotos.length} фото
                                                    </Typography>
                                                </Box>
                                            </ImageListItem>
                                        ) : index < 6 ? (
                                            <ImageListItem
                                                key={index}
                                                cols={1}
                                                rows={1}
                                                sx={{
                                                    position: 'relative',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    aspectRatio: '1 / 1', // Квадратное соотношение сторон
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
                                                onClick={() => handleOpenSlider(index)}
                                            >
                                                <img
                                                    src={`https://localhost:5000${photo}`}
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
                                                    <VisibilityIcon sx={{ fontSize: 40, cursor: 'pointer' }} />

                                                </Box>
                                            </ImageListItem>
                                        ) : null
                                    ))}
                                </ImageList>

                                <Dialog open={open} onClose={handleCloseSlider} maxWidth="md">
                                    <DialogContent
                                        sx={{
                                            position: 'relative',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#000',
                                            padding: 0
                                        }}
                                    >
                                        <Box sx={{
                                            width: '100%',
                                            height: '40px',
                                            backgroundColor: '#4D7298',
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            gap: '3px'

                                        }}>
                                            <IconButton
                                                onClick={handleCloseSlider}
                                                sx={{ color: 'white' }}
                                            >
                                                <CloseIcon />
                                            </IconButton>
                                            {/* <Tooltip title='Удалить фото' placement="top">
                            <IconButton
                                onClick={handleDeletePhoto}
                                sx={{ position: 'absolute', top: 8, right: 40, color: 'white' }}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip> */}
                                        </Box>
                                        <IconButton
                                            onClick={handlePrev}
                                            sx={{ position: 'absolute', left: 8, color: 'white' }}
                                        >
                                            <ArrowBackIosIcon />
                                        </IconButton>
                                        <img
                                            src={`https://localhost:5000${(profile?.profilePhotos[currentIndex])}`}
                                            alt={`Фото ${currentIndex + 1}`}
                                            style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                                        />
                                        <IconButton
                                            onClick={handleNext}
                                            sx={{ position: 'absolute', right: 8, color: 'white' }}
                                        >
                                            <ArrowForwardIosIcon />
                                        </IconButton>
                                    </DialogContent>
                                </Dialog>

                            </Paper>
                        </>
                    }

                    {(profile?.about) &&
                        <>
                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Обо мне</Typography>
                                <Typography sx={{ marginTop: '10px', fontWeight: 'bold', fontSize: '16px', textAlign: 'left' }}>
                                    {profile.about}
                                </Typography>
                            </Paper>
                        </>
                    }

                    {(userIdWithRoles?.roles?.includes('Sitter')) &&
                        <>
                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Мои объявления</Typography>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(3, 1fr)',
                                        gap: '20px',
                                        justifyItems: 'center',
                                    }}
                                >
                                    {profile?.boards.map((b) => (
                                        <CardBoard key={b.id} board={b} onHandleDelete={handleDeleteBoard} onHandleUpdate={handleUpdateBoard} />
                                    ))}

                                </Box>
                            </Paper>

                            <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '25px', textAlign: 'center' }}>Отзывы</Typography>
                                {(auth?.role?.includes('Owner')
                                    && auth?.userId !== profile?.sitterId
                                    && !profile?.reviews?.some(review => review.senderId === auth.userId)
                                ) &&
                                    <>
                                        <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: '20px', marginLeft: '83px', marginBottom: '30px' }}>

                                            <Rating
                                                sx={{ marginBottom: '10px' }}
                                                name="rate-from-owner"
                                                value={starsValue}
                                                onChange={(event, newValue) => {
                                                    setStarsValue(newValue < 1 ? 1 : newValue);
                                                }}
                                                icon={
                                                    <StarIcon
                                                        sx={{
                                                            fill: '#FFD700',
                                                            stroke: '#9B2D20',
                                                            strokeWidth: 1.5,
                                                            marginRight: '5px',
                                                        }} />
                                                }
                                                emptyIcon={
                                                    <StarIcon
                                                        sx={{
                                                            fill: 'transparent',
                                                            stroke: '#6b7280',
                                                            strokeWidth: 1.5,
                                                            marginRight: '5px',
                                                        }}
                                                    />
                                                }
                                            />

                                            <TextareaAutosize
                                                id='content'
                                                minRows={4}
                                                placeholder="Оставить отзыв ситтеру..."
                                                value={reviewFormData.content}
                                                onChange={handleReviewContentChange}
                                                style={{
                                                    width: '90%',
                                                    marginTop: '10px',
                                                    fontSize: '16px',
                                                    padding: '8px 15px',
                                                    border: '1px solid #ccc',
                                                    borderRadius: '4px',
                                                    resize: 'none',
                                                    background: '#e0e0e0'
                                                }}
                                            />

                                            <Button onClick={handleCreateReview} variant="contained" sx={{
                                                marginTop: '20px',
                                                alignSelf: 'flex-start'
                                            }}>Отправить</Button>

                                        </Box>
                                    </>}

                                {(profile?.reviews?.length > 0) ? (
                                    <>
                                        {profile?.reviews?.map((review) => (
                                            <Review key={review.reviewId} review={review} onHandleDelete={handleDeleteReview} />
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', padding: '0 20px', textAlign: 'center', marginTop: '10px' }}>Отзывов нет</Typography>
                                    </>
                                )
                                }

                            </Paper>
                        </>
                    }


                </Box>

            </Box>
        </>
    )
}

export default FullProfile