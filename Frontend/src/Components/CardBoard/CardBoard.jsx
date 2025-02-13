import React from 'react'
import {
    Paper, Box, Typography, Divider, Button, Card, CardActions, CardContent, IconButton, Tooltip, Dialog
    , DialogTitle, DialogContent, DialogActions, TextareaAutosize, FormControl, Select, MenuItem, Checkbox,
    OutlinedInput, ListItemText, TextField
} from "@mui/material"
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faFishFins, faHorse, faDove, faSpider } from '@fortawesome/free-solid-svg-icons';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { GiGecko } from "react-icons/gi";
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const CardBoard = () => {

    const { auth, setAuth } = useAuth()
    const navigate = useNavigate()
    const animalInfo = {
        Dog: { icon: faDog, title: 'Собаки', fontSize: '20px' },
        Cat: { icon: faCat, title: 'Кошки', fontSize: '20px' },
        Fish: { icon: faFishFins, title: 'Рыбки', fontSize: '20px' },
        Bird: { icon: faDove, title: 'Птички', fontSize: '20px' },
        Reptile: { icon: <GiGecko />, title: 'Рептилии', fontSize: '20px' },
        Spider: { icon: faSpider, title: 'Пауки', fontSize: '20px' },
        Horse: { icon: faHorse, title: 'Фермерские животные', fontSize: '20px' },
        SmallPet: { icon: <PestControlRodentIcon />, title: 'Грызуны', fontSize: '25px' },
    }

    const animals = ['Dog', 'Cat', 'Fish', 'Bird', 'Reptile', 'Spider', 'Horse', 'SmallPet']
    //const animals = ['Dog','Cat']
    //const animals = ['Dog']

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

    const [animalName, setAnimalName] = useState([]);
    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
        //setAnimalIsValid(false)
    }

    const handleSubmitRequest = () => {
        navigate("/boardings/request", {
            state: {
                animals: animals, 
                pricePerDay: 1200 
            }
        });
    };


    //https://admin24.ru/help-center/interface-applications //interface
    // color #D0EFB1

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
                        <Box display="flex" gap={1} justifyContent="center">
                            {animals.map((animal, index) => {
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
                                1200 ₽
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

                {(auth?.userId === "4567f41e-7a7f-47db-a5dd-8635e4d14a8f") &&
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
                                <IconButton size="small">
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
                <DialogContent dividers sx={{backgroundColor: '#b3d89c'}}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Текст объявления</Typography>
                    <TextareaAutosize
                        id='about'
                        minRows={4}
                        placeholder="Введите текст объявления..."
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            fontSize: '16px',
                            padding: '8px 15px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'none',
                            background: '#e0e0e0'
                        }}
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Животные</Typography>
                    <FormControl sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                        <Select
                            id="demo-multiple-checkbox"
                            multiple
                            value={animalName}
                            onChange={handleAnimalChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                        >
                            {animals.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={animalName.includes(name)} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Цена за сутки</Typography>
                    <TextField
                        id="pricePerDay"
                        size="small"
                        type="number"
                        required
                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                    />

                </DialogContent>
                <DialogActions sx={{backgroundColor: '#b3d89c'}}>
                    <Button autoFocus onClick={handleClose} variant="contained">
                        Применить изменения
                    </Button>
                </DialogActions>
            </Dialog>

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
                <DialogContent dividers sx={{backgroundColor: '#b3d89c'}}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px' }}>Текст объявления</Typography>
                    <TextareaAutosize
                        id='about'
                        minRows={4}
                        value={"Some input readonly value for test"}
                        style={{
                            width: '100%',
                            marginTop: '10px',
                            fontSize: '16px',
                            padding: '8px 15px',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            resize: 'none',
                            background: '#e0e0e0'
                        }}
                        readOnly
                        disabled
                    />

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Животные</Typography>
                    <FormControl sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
                        <Select
                            id="demo-multiple-checkbox"
                            multiple
                            value={animalName}
                            onChange={handleAnimalChange}
                            input={<OutlinedInput />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            disabled
                        >
                            {animals.map((name) => (
                                <MenuItem key={name} value={name}>
                                    <Checkbox checked={animalName.includes(name)} />
                                    <ListItemText primary={name} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>Цена за сутки</Typography>
                    <TextField
                        id="pricePerDay"
                        size="small"
                        type="number"
                        required
                        sx={{ width: '100%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                        readOnly
                        value="100"
                        disabled
                    />

                </DialogContent>
                <DialogActions sx={{backgroundColor: '#b3d89c'}}>
                    <Button autoFocus onClick={handleChangeDetails} variant="contained">
                        Изменить
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default CardBoard