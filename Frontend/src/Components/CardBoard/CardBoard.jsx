import React from 'react'
import {
    Box, Typography, Button, Card, CardActions, CardContent, IconButton, Tooltip, Dialog
    , DialogTitle, DialogContent, DialogActions, FormControl, Select, MenuItem, Checkbox,
    OutlinedInput, ListItemText, TextField
} from "@mui/material"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faFishFins, faDove, faSpider } from '@fortawesome/free-solid-svg-icons';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { GiGecko } from "react-icons/gi";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import useProfile from '../../hooks/useProfile';
import { faHorse } from '@fortawesome/free-solid-svg-icons';


const CardBoard = ({ board, onHandleDelete, onHandleUpdate }) => {

    const {
        id,
        sitterId,
        animalNames,
        content,
        price,
        createdAt
    } = board

    const { auth, setAuth } = useAuth()
    const { profile, setProfile } = useProfile()
    const [animalName, setAnimalName] = useState([]);
    const navigate = useNavigate()
    // const animalInfo = {
    //     Dog: { icon: faDog, title: 'Собаки', fontSize: '20px' },
    //     Cat: { icon: faCat, title: 'Кошки', fontSize: '20px' },
    //     Fish: { icon: faFishFins, title: 'Рыбки', fontSize: '20px' },
    //     Bird: { icon: faDove, title: 'Птички', fontSize: '20px' },
    //     Reptile: { icon: <GiGecko />, title: 'Рептилии', fontSize: '20px' },
    //     Spider: { icon: faSpider, title: 'Пауки', fontSize: '20px' },
    //     FarmPet: { icon: faHorse, title: 'Фермерские животные', fontSize: '20px' },
    //     SmallPet: { icon: <PestControlRodentIcon  sx={{fontSize:'25px', p:0, m:0}}/>, title: 'Грызуны', fontSize: '25px' },
    // }

    const animalInfo = {
        Dog: { icon: faDog, title: 'Собаки' },
        Cat: { icon: faCat, title: 'Кошки' },
        Fish: { icon: faFishFins, title: 'Рыбки' },
        Bird: { icon: faDove, title: 'Птички' },
        Reptile: { icon: <GiGecko />, title: 'Рептилии' },
        Spider: { icon: faSpider, title: 'Пауки' },
        FarmPet: { icon: faHorse, title: 'Фермерские животные' },
        SmallPet: { icon: <PestControlRodentIcon />, title: 'Грызуны' },
    };

    const animalTranslations = {
        "Собаки": "Dog",
        "Кошки": "Cat",
        "Фермерские животные": "FarmPet",
        "Пауки": "Spider",
        "Рептилии": "Reptile",
        "Грызуны": "SmallPet",
        "Птички": "Bird",
        "Рыбки": "Fish",
    }

    const reversedTranslations = Object.fromEntries(
        Object.entries(animalTranslations).map(([ru, en]) => [en, ru])
    )

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    }

    const [open, setOpen] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);

    const [putData, setPutData] = useState({
        boardId: id,
        animalNames: animalNames.map(name => reversedTranslations[name] || name),
        content: content,
        price: price,
        createdAt: createdAt
    })

    const handleClickOpen = () => {
        setOpen(true);
    }
    const handleClose = () => {
        setOpen(false);
    }

    const handleClickOpenDetails = () => {
        setOpenDetails(true);
    }
    const handleCloseDetails = () => {
        setOpenDetails(false);
    }

    const handleChangeDetails = () => {
        handleCloseDetails()
        handleClickOpen()
    }

    const handleAnimalChange = (e) => {
        const selectedAnimal = e.target.value
        setPutData((prevData) => ({ ...prevData, animalNames: selectedAnimal }))
    }

    const onHandleUpdateBoard = (e) => {
        e.preventDefault()

        const animalNamesToSend = putData.animalNames.map(name => animalTranslations[name])

        const dataToSend = {
            ...putData,
            animalNames: animalNamesToSend,
            price: parseInt(putData.price, 10)
        }

        onHandleUpdate(dataToSend)
        handleClose()
    }

    const handleSubmitRequest = () => {
        navigate("/boardings/request", {
            state: {
                boardAnimals: animalNames.map(name => reversedTranslations[name]),
                boardPrice: price
            }
        });
    };

    return (
        <>
            <Card sx={{
                display: 'flex', flexDirection: 'column', width: "100%", maxWidth: '350px', boxShadow: 3,
                borderRadius: 3, backgroundColor: '#b3d89c', marginTop: '20px',
            }}>
                <CardContent>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', textAlign: 'center' }}>
                        Передержка животных
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: 'column', marginTop: "20px", alignItems: 'center' }}>
                        {/* <Box display="flex" gap={1} justifyContent="center">
                            {animalNames.map((animal, index) => {
                                const animalData = animalInfo[animal];
                                if (!animalData) return null;

                                const { icon, title, fontSize } = animalData;

                                return (
                                    <Tooltip key={index} title={title} placement="top">
                                        {React.isValidElement(icon) ? (
                                            <span style={{ display: 'flex', alignItems: 'center', fontSize }}>{icon}</span>
                                        ) : (
                                            <FontAwesomeIcon icon={icon} style={{ color: 'black', fontSize }} />
                                        )}
                                    </Tooltip>
                                );
                            })}
                        </Box> */}

                        <Box display="flex" gap={1} justifyContent="center" alignItems="center" sx={{ flexWrap: 'wrap', minHeight: "90px" }}>
                            {animalNames.map((animal, index) => {
                                const animalData = animalInfo[animal];
                                if (!animalData) return null;

                                const { icon, title } = animalData;

                                return (
                                    <Tooltip key={index} title={title} placement="top">
                                        <Box
                                            display="flex"
                                            alignItems="center"
                                            justifyContent="center"
                                            width={40}
                                            height={40}
                                        >
                                            {React.isValidElement(icon) ? (
                                                React.cloneElement(icon, { style: { fontSize: '24px', color: 'black' } })
                                            ) : (
                                                <FontAwesomeIcon icon={icon} style={{ fontSize: '24px', color: 'black' }} />
                                            )}
                                        </Box>
                                    </Tooltip>
                                );
                            })}
                        </Box>



                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: "20px",
                            alignItems: 'center'
                        }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>
                                Цена
                            </Typography>
                            <Typography sx={{ marginTop: "10px", color: '#f57c00', fontWeight: 'bold', fontSize: '26px' }}>
                                {price} ₽
                            </Typography>
                            <Typography sx={{ color: '#6b7280', fontSize: '16px' }}>
                                за сутки
                            </Typography>
                        </Box>
                    </Box>

                </CardContent>

                {(auth?.role?.includes('Owner')) &&
                    <>
                        <CardActions sx={{ justifyContent: 'center' }}>
                            <Button onClick={handleSubmitRequest} variant="contained" sx={{ marginTop: '-10px', marginBottom: '10px' }}>
                                Отправить заявку
                            </Button>
                        </CardActions>
                    </>}

                {(auth?.userId === sitterId) &&
                    <>
                        <CardActions sx={{ justifyContent: 'center' }}>

                            <Tooltip title="Подробнее" placement="top">
                                <IconButton size="small" onClick={handleClickOpenDetails}>
                                    <HelpOutlineIcon />
                                </IconButton>
                            </Tooltip>


                            <Tooltip title="Изменить" placement="top">
                                <IconButton size="small" onClick={handleClickOpen}>
                                    <EditNoteOutlinedIcon />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Удалить" placement="top">
                                <IconButton size="small" onClick={() => onHandleDelete(id)}>
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Tooltip>

                        </CardActions>
                    </>

                }

            </Card>

            <Dialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                fullWidth={true}
                maxWidth="sm"
            >
                <form onSubmit={onHandleUpdateBoard}>
                    <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                        Изменить
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
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
                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Текст объявления</Typography>
                        <TextField
                            id='content'
                            required
                            value={putData.content}
                            onChange={(e) => setPutData((prevData) => ({ ...prevData, content: e.target.value }))}
                            multiline
                            minRows={4}
                            placeholder="Введите текст объявления..."
                            size='small'
                            sx={{
                                width: '100%',
                                marginTop: '10px',
                                '& .MuiOutlinedInput-root': { background: '#e0e0e0' },
                                '& textarea': { overflow: 'hidden', resize: 'none' }
                            }}
                        />

                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Животные</Typography>
                        <FormControl size='small' sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                            <Select
                                id="demo-multiple-checkbox"
                                multiple
                                value={putData.animalNames}
                                onChange={handleAnimalChange}
                                input={<OutlinedInput />}
                                renderValue={(selected) => selected.join(', ')}
                                MenuProps={MenuProps}
                                required
                            >
                                {profile?.animals?.map((name) => {
                                    const translatedName = reversedTranslations[name] || name;
                                    return (
                                        <MenuItem key={name} value={translatedName}>
                                            <Checkbox checked={putData.animalNames.includes(translatedName)} />
                                            <ListItemText primary={translatedName} />
                                        </MenuItem>
                                    );
                                })}
                            </Select>
                        </FormControl>

                        <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Цена за сутки</Typography>
                        <TextField
                            id="pricePerDay"
                            size="small"
                            type="number"
                            value={putData.price}
                            onChange={(e) => setPutData((prevData) => ({ ...prevData, price: e.target.value }))}
                            required
                            sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                        />

                    </DialogContent>
                    <DialogActions sx={{ backgroundColor: '#b3d89c' }}>
                        <Button autoFocus type="submit" variant="contained">
                            Применить изменения
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Подробности объявления*/}
            <Dialog
                onClose={handleCloseDetails}
                aria-labelledby="customized-dialog-title"
                open={openDetails}
                fullWidth={true}
                maxWidth="sm"
            >
                <DialogTitle sx={{ m: 0, p: 2, backgroundColor: '#b3d89c', fontWeight: 'bold' }} id="customized-dialog-title">
                    Подробности объявления
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={handleCloseDetails}
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
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Текст объявления</Typography>
                    <TextField
                        id='content'
                        required
                        value={content}
                        multiline
                        minRows={4}
                        placeholder="Введите текст объявления..."
                        size='small'
                        sx={{
                            width: '100%',
                            marginTop: '10px',
                            '& .MuiOutlinedInput-root': { background: '#e0e0e0' },
                            '& textarea': { overflow: 'hidden', resize: 'none' }
                        }}
                        readOnly
                        disabled
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Животные</Typography>
                    {/* <Box display="flex" gap={1} justifyContent="left" sx={{ marginTop: '10px' }}>
                        {animalNames.map((animal, index) => {
                            const animalData = animalInfo[animal];
                            if (!animalData) return null;

                            const { icon, title, fontSize } = animalData;

                            return (
                                <Tooltip key={index} title={title} placement="top">
                                    {React.isValidElement(icon) ? (
                                        <span style={{ display: 'flex', alignItems: 'center', fontSize }}>{icon}</span>
                                    ) : (
                                        <FontAwesomeIcon icon={icon} style={{ color: 'black', fontSize }} />
                                    )}
                                </Tooltip>
                            );
                        })}
                    </Box> */}

                    <Box display="flex" gap={1} justifyContent="left" sx={{ marginTop: '10px' }}>
                        {animalNames.map((animal, index) => {
                            const animalData = animalInfo[animal];
                            if (!animalData) return null;

                            const { icon, title } = animalData;

                            return (
                                <Tooltip key={index} title={title} placement="top">
                                    <Box
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        width={20}
                                        height={20}
                                    >
                                        {React.isValidElement(icon) ? (
                                            React.cloneElement(icon, { style: { fontSize: '20px', color: 'black' } })
                                        ) : (
                                            <FontAwesomeIcon icon={icon} style={{ fontSize: '20px', color: 'black' }} />
                                        )}
                                    </Box>
                                </Tooltip>
                            );
                        })}
                    </Box>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Цена за сутки</Typography>
                    <TextField
                        id="pricePerDay"
                        size="small"
                        type="number"
                        value={price}
                        required
                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                        readOnly
                        disabled
                    />

                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#b3d89c' }}>
                    <Button autoFocus onClick={handleChangeDetails} variant="contained">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CardBoard