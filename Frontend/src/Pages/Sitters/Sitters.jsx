import React from "react";
import './Sitters.css'
import SitterCard from '../../Components/SitterCard/SitterCard'
import { getSitters } from "../../api/sitters"
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import {
    Box, Paper, Typography, Slider, FormControl, Select, MenuItem, Checkbox, ListItemText,
    OutlinedInput, TextField, Button
} from "@mui/material";
import CalendarPicker from "../../Components/CalendarPicker/CalendarPicker";

const Sitters = () => {

    const [sliderValue, setSliderValue] = useState(3000)
    const [animalName, setAnimalName] = useState([]);

    const handleAnimalChange = (e) => {
        const {
            target: { value },
        } = e;
        setAnimalName(typeof value === 'string' ? value.split(',') : value);
    }

    const [sitters, setSitters] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSitters()
                setSitters(response.data)
            } catch (e) {
                console.error("Error of receiving sitters: ", e)
            }
        }

        fetchData()
    }, [])

    const handleSliderChange = (event, newValue) => {
        setSliderValue(newValue);
    };
    const disabledDates = [
        dayjs("2025-02-15"),
        dayjs("2025-02-20"),
        dayjs("2025-02-25"),
    ];

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };


    const animals = [
        'Собаки',
        'Кошки',
        'Фермерские животные',
        'Пауки',
        'Рептилии',
        'Грызуны',
        'Птички',
        'Рыбки'
    ]

    const animalTranslations = {
        "Собаки": "Dog",
        "Кошки": "Cat",
        "Фермерские животные": "FarmPet",
        "Пауки": "Spider",
        "Рептилии": "Reptile",
        "Грызуны": "SmallPet",
        "Птички": "Bird",
        "Рыбки": "Fish",
    };


    return (
        <>
            <Box sx={{ padding: '20px 10%', width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>

                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    width: '100%',
                    alignItems: 'stretch'
                }}>
                    <Paper elevation={3} sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '70%',
                        boxSizing: 'border-box',
                        borderRadius: 3,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>
                            Найдено 3888 объявлений ситтеров
                        </Typography>
                    </Paper>

                    <Paper elevation={3} sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '30%',
                        boxSizing: 'border-box',
                        borderRadius: 3,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
                            Фильтрация
                        </Typography>
                    </Paper>
                </Box>

                <Box sx={{
                    display: 'flex',
                    gap: '20px',
                    width: '100%'
                }}>
                    <Box sx={{ display: 'flex', gap: '20px', width: '70%', flexDirection: 'column' }}>
                        {sitters.map((sitter) => (
                            <SitterCard key={sitter.profileid} sitter={sitter} />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', width: '30%', gap: '20px', flexDirection: 'column', overflow: 'hidden' }}>

                        <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box', borderRadius: 3 }}>
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center' }}>Максимальная цена за сутки</Typography>
                            <Box sx={{ display: 'flex', gap: '15px', alignItems: 'center', marginTop: '10px' }}>


                                <Slider
                                    value={sliderValue}
                                    step={100}
                                    min={100}
                                    max={3000}
                                    onChange={handleSliderChange}
                                    sx={{
                                        '& .MuiSlider-thumb': {
                                            '&:hover, &.Mui-focusVisible, &.Mui-active': {
                                                boxShadow: 'none',
                                                outline: 'none',
                                            },
                                            '&.MuiSlider-thumb': {
                                                boxShadow: 'none',
                                                outline: 'none',
                                            },
                                        },
                                    }}

                                />
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', whiteSpace: "nowrap" }}>
                                    {sliderValue === 3000 ? "Любая" : `${sliderValue} ₽`}
                                </Typography>
                            </Box>

                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', marginTop: '10px' }}>Животные</Typography>
                            <FormControl fullWidth size='small' sx={{ marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>

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
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', marginTop: '20px' }}>Местоположение</Typography>
                            <TextField
                                id="location"
                                size="small"
                                fullWidth
                                placeholder="Введите город или область"
                                sx={{ marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}
                            />
                            <Typography sx={{ fontWeight: 'bold', fontSize: '18px', textAlign: 'center', marginTop: '20px' }}>Время передержки</Typography>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} sx={{ marginTop: '10px', width: '100%' }} title="Отдадите" />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} sx={{ marginTop: '20px', width: '100%' }} title="Заберете" />
                            </LocalizationProvider>

                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button variant="contained">Сбросить фильтрацию</Button>
                            </Box>

                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Sitters;
