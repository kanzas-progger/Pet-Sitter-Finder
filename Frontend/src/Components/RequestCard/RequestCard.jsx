import React from 'react'
import {
    Paper, Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle, Typography, Box, Link, Button,
    IconButton, Tooltip, Avatar
} from '@mui/material'
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';
import { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { getShortSitterProfile } from '../../api/sitters';
import { getShortOwnerProfile } from '../../api/owners';
import { updateStatus, deleteRequest } from '../../api/requests';
import { useNavigate } from 'react-router-dom';
import { getOwnerAnimalProfileById } from '../../api/animals';
import PetsIcon from '@mui/icons-material/Pets';

const RequestCard = ({ request = [] }) => {

    const navigate = useNavigate()
    const {
        requestId,
        sitterId,
        ownerId,
        createdAt,
        startDate,
        endDate,
        ownerMessage,
        status,
        totalPrice,
        requestAnimals
    } = request

    const { auth, setAuth } = useAuth()

    const hasProfileAnimals = true

    const [open, setOpen] = useState(false);
    const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
    const [shortProfile, setShortProfile] = useState(null)
    const [groupedAnimals, setGroupedAnimals] = useState([]);
    const [animalProfileIds, setAnimalProfileIds] = useState([]);
    const [animalProfiles, setAnimalProfiles] = useState([])
    const [selectedAnimalProfile, setSelecteAnimalProfile] = useState(null)
    const [isSelectedAnimalOpen, setIsSelectedAnimalOpen] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (auth?.role?.includes('Sitter')) {
                    const response = await getShortOwnerProfile(ownerId)
                    setShortProfile(response.data) //firstname lastname login
                } else {
                    const response = await getShortSitterProfile(sitterId)
                    setShortProfile(response.data)
                }
            } catch (e) {
                console.error(e)
            }
        }
        fetchData()
    }, [])

    useEffect(() => {
        if (requestAnimals && requestAnimals.length > 0) {
            // Группировка животных по имени и суммирование их количества
            const animalGroups = {};
            const profileIds = [];

            requestAnimals.forEach(animal => {
                // Добавление в массив ID профилей
                if (animal.animalProfileId) {
                    profileIds.push(animal.animalProfileId);
                }

                // Группировка по имени и суммирование количества
                if (!animalGroups[animal.name]) {
                    animalGroups[animal.name] = {
                        name: animal.name,
                        count: 0
                    };
                }
                animalGroups[animal.name].count += animal.count;
            });

            // Преобразование объекта групп в массив
            const groupedAnimalsArray = Object.values(animalGroups);

            setGroupedAnimals(groupedAnimalsArray);
            setAnimalProfileIds(profileIds);
        }
    }, [requestAnimals]);

    useEffect(() => {
        const fetchAnimalProfiles = async () => {
            if (animalProfileIds.length > 0) {
                try {
                    const profiles = await Promise.all(
                        animalProfileIds.map(async (id) => {
                            const response = await getOwnerAnimalProfileById(id)
                            return response.data;
                        })
                    );
                    setAnimalProfiles(profiles);

                } catch (e) {
                    console.error('Error of receiving animalProfiles:', e);
                }
            }
        };

        fetchAnimalProfiles();
    }, [animalProfileIds]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    }

    const formatDate = (date) => {
        const formatedDate = new Date(date).toLocaleDateString('ru-RU')
        return formatedDate
    }

    const getDays = () => {
        const date1 = new Date(startDate)
        const date2 = new Date(endDate)

        date1.setUTCHours(0, 0, 0, 0)
        date2.setUTCHours(0, 0, 0, 0)

        const difference = Math.abs(date2 - date1)
        const diffDays = Math.floor(difference / (1000 * 60 * 60 * 24))

        let diffDaysValidString = `${diffDays} суток`
        if (diffDays === 1) {
            diffDaysValidString = `${diffDays} сутки`
        }

        return diffDaysValidString;
    }

    const handleConfirmDialogClose = () => {
        setIsConfirmDialogOpen(false)
    }

    const handleConfirmDialogOpen = () => {
        setIsConfirmDialogOpen(true)
    }

    const updateRequestStatusWithDisabledDates = async () => {
        const dataToSend = {
            "requestId": requestId,
            "isDatesDisabled": true
        }
        try {
            const response = await updateStatus(dataToSend)
            console.log(response.data)
            handleConfirmDialogClose()
            navigate(0)
        } catch (e) {
            console.error(e)
        }
    }

    const updateRequestStatusWithoutDisabledDates = async () => {
        const dataToSend = {
            "requestId": requestId,
            "isDatesDisabled": false
        }
        try {
            const response = await updateStatus(dataToSend)
            console.log(response.data)
            handleConfirmDialogClose()
            navigate(0)
        } catch (e) {
            console.error(e)
        }
    }

    const handleDeleteRequest = async () => {
        try {
            const response = await deleteRequest(requestId)
            console.log(response.data)
            navigate(0)
        }
        catch (e) {
            console.error(e)
        }
    }


    const animalTranslations = {
        "Dog": "Собаки",
        "Cat": "Кошки",
        "FarmPet": "Фермерские животные",
        "Spider": "Пауки",
        "Reptile": "Рептилии",
        "SmallPet": "Грызуны",
        "Bird": "Птички",
        "Fish": "Рыбки",
    };

    const statusTranslations = {
        "New": "Новая",
        "Accepted": "Принятая",
        "AcceptedAndDatesIsDisabled": "Принятая",
        "Rejected": "Отказанная",
        "Cancelled": "Отмененная",
        "Processing": "В ожидании"
    }

    const statusBackgroundColor = {
        "New": "#4D7298",
        "Accepted": "#31c434",
        "AcceptedAndDatesIsDisabled": "#31c434",
        "Rejected": "#f44336",
        "Cancelled": "#f44336",
        "Processing": "#6b7280"
    }

    const handleAnimalProfileClick = (animalProfile) => {
        console.log('Информация о животном:', animalProfile);
        setSelecteAnimalProfile(animalProfile)
        setIsSelectedAnimalOpen(true)
    }

    const handleAnimalProfileDialogClose = () => {
        setIsSelectedAnimalOpen(false)
    }

    const getStaticImagePath = (fullImagePath) => {
        if (!fullImagePath) {
            return null
        }
        const fileName = fullImagePath.split('/').pop();
        const newPath = `https://localhost:5000/animals/uploads/img/${fileName}`;

        return newPath;
    }

    const getAgeString = (birthdayUtc) => {
        const birthday = new Date(birthdayUtc);
        const now = new Date();

        let years = now.getFullYear() - birthday.getFullYear();
        let months = now.getMonth() - birthday.getMonth();

        if (months < 0) {
            years -= 1;
            months += 12;
        }

        const getYearLabel = (num) => {
            if (num % 10 === 1 && num % 100 !== 11) return "год";
            if ([2, 3, 4].includes(num % 10) && ![12, 13, 14].includes(num % 100)) return "года";
            return "лет";
        };

        const getMonthLabel = (num) => {
            if (num === 1) return "месяц";
            if ([2, 3, 4].includes(num)) return "месяца";
            return "месяцев";
        };

        if (years > 0 && months > 0) {
            return `${years} ${getYearLabel(years)} и ${months} ${getMonthLabel(months)}`;
        } else if (years > 0) {
            return `${years} ${getYearLabel(years)}`;
        } else {
            return `${months} ${getMonthLabel(months)}`;
        }
    }

    return (
        <>
            <Paper elevation={3} sx={{ border: '3px solid #6b7280', borderRadius: 3, backgroundColor: '#b3d89c', width: '100%', boxSizing: 'border-box', padding: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', position: 'relative', minWidth: 'max-content' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
                        {auth?.role?.includes('Sitter') ? (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        ) : (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос к ситтеру</Typography>
                        )}

                        <Link href={`https://localhost:5173/${shortProfile?.login}`} target="_blank" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>{shortProfile?.firstname} {shortProfile?.lastname}</Link>
                    </Box>

                    <Box sx={{ marginLeft: 'auto' }}>
                        <Typography sx={{ color: '#6b7280', cursor: 'pointer', whiteSpace: 'nowrap' }}>{formatDate(createdAt)}</Typography>
                    </Box>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животные: </Typography>
                    {groupedAnimals.map((a) => (
                        <Typography key={a.name} sx={{ color: '#6b7280', fontWeight: 'bold' }}>{animalTranslations[a.name]} ({a.count})</Typography>
                    ))}
                </Box>
                {animalProfileIds.length > 0 && (
                    <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', cursor: 'pointer' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Профили животных: </Typography>
                        {animalProfiles.map((profile) => (
                            <Typography
                                key={profile.animalProfileId}
                                onClick={() => handleAnimalProfileClick(profile)}
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#6b7280',
                                    '&:hover': {
                                        textDecoration: 'underline',
                                        textDecorationColor: 'inherit',
                                    },
                                }}>{profile.name}
                            </Typography>
                        ))}
                    </Box>
                )}

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Период передержки: </Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px' }}>{formatDate(startDate)}</Typography>
                    <ArrowRightAltIcon />
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px' }}>{formatDate(endDate)}</Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>{getDays()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Примерная стоимость передержки: </Typography>
                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold', fontSize: '18px' }}>{totalPrice} ₽</Typography>
                </Box>

                <Box sx={{ display: 'flex', maxWidth: 'fit-content', gap: '10px', marginTop: '10px', alignItems: 'center', cursor: 'pointer' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Статус: </Typography>
                    <Typography sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        backgroundColor: statusBackgroundColor[status],
                        borderRadius: '12px',
                        padding: '4px 8px'
                    }}>{statusTranslations[status]}</Typography>
                    {/* <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#31c434', borderRadius: '12px', padding: '4px 8px' }}>Принято</Typography>
                    <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#f44336', borderRadius: '12px', padding: '4px 8px' }}>Отклонено</Typography>  */}
                    {/* <Typography sx={{ color: '#fff', fontWeight: 'bold', backgroundColor: '#6b7280', borderRadius: '12px', padding: '4px 8px' }}>Просмотрено</Typography> */}
                </Box>

                <Box sx={{ display: 'flex', marginTop: '20px', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        {auth?.role?.includes('Sitter') ? (
                            status == 'New' || status == 'Processing' ? (<>
                                <Button variant='contained' onClick={handleConfirmDialogOpen} >Принять</Button>
                                <Button variant='contained' color='error' onClick={handleDeleteRequest}>Отклонить</Button>
                            </>) : (<>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>Принятые заявки автоматически удаляются после окончания передержки</Typography>
                            </>)
                        ) : (
                        status == 'New' || status == 'Processing' ? (
                            <>
                            <Button variant='contained' color='error' onClick={handleDeleteRequest}>Отозвать</Button>
                            </>
                        ) : (
                            <>
                            <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>Принятые заявки автоматически удаляются после окончания передержки</Typography>
                            </>
                        ))}

                    </Box>
                    {ownerMessage !== null && (
                        <Box>
                            <Tooltip title='Подробнее' placement='top'>
                                <IconButton onClick={handleClickOpen}>
                                    <InfoIcon sx={{ fill: '#6b7280', fontSize: '30px' }} />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    )}

                </Box>
            </Paper>

            <Dialog
                open={isConfirmDialogOpen}
                onClose={handleConfirmDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle sx={{ p: 2, backgroundColor: '#b3d89c', textAlign: 'center' }} id="alert-dialog-title">
                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>{"Отметить даты заявки занятыми?"}</Typography>
                </DialogTitle>
                <DialogContent dividers sx={{ backgroundColor: '#b3d89c' }}>
                    <DialogContentText id="alert-dialog-description">
                        <Typography sx={{ color: '#6b7280', fontWeight: 'bold', cursor: 'pointer' }}>
                            {"Это делается для того, чтобы другие владельцы могли видеть только свободные даты"}
                        </Typography>

                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center', gap: 2, backgroundColor: '#b3d89c' }}>
                    <Button onClick={updateRequestStatusWithDisabledDates} variant='contained'>ок</Button>
                    <Button onClick={updateRequestStatusWithoutDisabledDates} variant='contained' autoFocus>
                        не отмечать
                    </Button>
                </DialogActions>
            </Dialog>


            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{ p: 2, backgroundColor: '#b3d89c', textAlign: 'center' }} id="customized-dialog-title">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px', whiteSpace: 'nowrap', justifyContent: 'center' }}>
                        {/* <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        <Link component={RouterLink} to="/requests" target="_blank" rel="noopener noreferrer" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>Виталий Войтинцев</Link> */}

                        {auth?.role?.includes('Sitter') ? (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос от владельца</Typography>
                        ) : (
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>Запрос к ситтеру</Typography>
                        )}

                        <Link href={`https://localhost:5173/${shortProfile?.login}`} target="_blank" underline="none" sx={{
                            fontWeight: 'bold', fontSize: '18px', whiteSpace: 'nowrap', color: 'black', '&:hover': {
                                textDecoration: 'underline',
                                textDecorationColor: 'inherit',
                            },
                        }}>{shortProfile?.firstname} {shortProfile?.lastname}</Link>
                    </Box>

                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[700],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: '#b3d89c' }}>
                    <Box sx={{ padding: '4px' }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>Сообщение от владельца: </Typography>
                        <Typography sx={{ color: '#6b7280', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', overflowWrap: 'break-word' }}>
                            {ownerMessage}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* animalProfileDetails */}
            <Dialog
                onClose={handleAnimalProfileDialogClose}
                aria-labelledby="customized-dialog-title"
                open={isSelectedAnimalOpen}
                fullWidth={true}
                maxWidth="md"
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold', textAlign: 'center' }} id="customized-dialog-title">
                    Подробнее о профиле животного
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleAnimalProfileDialogClose}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers sx={{ backgroundColor: '#b3d89c' }}>

                    <Box sx={{ display: 'flex', gap: '20px', justifyContent: 'flex-start' }}>

                        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Животное:</Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {animalTranslations[selectedAnimalProfile?.animalName]}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    Кличка:
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {selectedAnimalProfile?.name}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    Возраст:
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {getAgeString(selectedAnimalProfile?.birthday)}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    Пол:
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {selectedAnimalProfile?.gender}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    Вид или порода:
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {selectedAnimalProfile?.type}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                    Количество:
                                </Typography>
                                <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                    {selectedAnimalProfile?.count}
                                </Typography>
                            </Box>
                            {selectedAnimalProfile?.description.length > 0 && (
                                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column' }}>
                                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                        Дополнительная информация:
                                    </Typography>
                                    <Typography sx={{ color: '#6b7280', fontWeight: 'bold' }}>
                                        {selectedAnimalProfile?.description}
                                    </Typography>
                                </Box>
                            )}

                        </Box>

                        <Box sx={{ width: '100%' }}>
                            <Avatar
                                src={getStaticImagePath(selectedAnimalProfile?.profileImage)}
                                sx={{
                                    bgcolor: '#BDBDBD',
                                    width: 'auto',
                                    height: '210px',
                                    boxShadow: 2,
                                    border: '2px solid #D0EFB1',
                                    '& img': {
                                        objectFit: 'cover',
                                        width: '100%',
                                        height: '100%',
                                    }
                                }}

                                variant="rounded" > <PetsIcon sx={{ fill: '#e0e0e0', fontSize: '200px' }} />
                            </Avatar>
                        </Box>
                    </Box>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default RequestCard