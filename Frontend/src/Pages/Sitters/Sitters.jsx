import React from "react";
import './Sitters.css'
import SitterCard from '../../Components/SitterCard/SitterCard'
import { getSitters } from "../../api/sitters"
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateField } from '@mui/x-date-pickers/DateField';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/ru';
import {
    Box, Paper, Typography, Slider, FormControl, Select, MenuItem, Checkbox, ListItemText,
    OutlinedInput, TextField, Button
} from "@mui/material";
import CalendarPicker from "../../Components/CalendarPicker/CalendarPicker";
import { getAllFilteredBoards } from "../../api/boards";
import { ruRU } from '@mui/x-date-pickers/locales';
dayjs.extend(utc);
dayjs.locale('ru');

const Sitters = () => {

    const russianLocale = ruRU.components.MuiLocalizationProvider.defaultProps.localeText;
    const russianLocaleInLower = {
        ...russianLocale,
        fieldYearPlaceholder: (params) => 'г'.repeat(params.digitAmount),
        fieldMonthPlaceholder: () => 'мм',
        fieldDayPlaceholder: () => 'дд',
    };

    const [boardSitters, setBoardSitters] = useState([])
    const [sliderValue, setSliderValue] = useState(3000)
    const [animalName, setAnimalName] = useState(["Любые"]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [isAnySelected, setIsAnySelected] = useState(true);
    const [boardCount, setBoardCount] = useState(0)
    const [filteredData, setFilteredData] = useState({
        maxPrice: null,
        animalNames: null,
        startDate: null,
        endDate: null
    })

    const nextDay = startDate ? dayjs(startDate).add(1, 'day') : null;

    useEffect(() => {
        const fetchBoardData = async () => {
            try {
                const response = await getAllFilteredBoards(filteredData)
                setBoardSitters(response.data)
                setBoardCount(response.data.length)
                console.log("BOARD DATA IS ",response.data)
            } catch (e) {
                console.error("Error of receiving filtered boards: ", e)
            }
        }

        fetchBoardData()
    }, [filteredData])

    const handleAnimalChange = (e) => {
        const { value } = e.target;
        let selectedAnimals = typeof value === "string" ? value.split(",") : value;

        if (selectedAnimals.includes("Любые")) {
            if (selectedAnimals.length > 1) {
                selectedAnimals = selectedAnimals.filter(animal => animal !== "Любые");
                setIsAnySelected(false);
            } else {
                setIsAnySelected(true);
                setAnimalName(["Любые"]);
                setFilteredData(prevState => ({
                    ...prevState,
                    animalNames: null
                }));
                return;
            }
        }

        if (selectedAnimals.length === 0) {
            setIsAnySelected(true);
            setAnimalName(["Любые"]);
            setFilteredData(prevState => ({
                ...prevState,
                animalNames: null
            }));
            return;
        }

        const translatedAnimals = selectedAnimals.map(animal => animalTranslations[animal] || animal);
        setIsAnySelected(false);
        setAnimalName(selectedAnimals);
        setFilteredData(prevState => ({
            ...prevState,
            animalNames: translatedAnimals
        }));
    };


    const handleSliderChange = (event, newValue) => {
        const filteredValue = newValue === 3000 ? null : newValue;

        setSliderValue(newValue);

        setFilteredData(prevState => ({
            ...prevState,
            maxPrice: filteredValue
        }));

        console.log("FILTERED DATA IS", {
            ...filteredData,
            maxPrice: filteredValue
        });
    };

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
        'Любые',
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

    const getBoardCountString = () => {
        if (boardCount === 0) {
            return "Объявлений не найдено"
        }
        else if (boardCount === 1) {
            return `Найдено ${boardCount} объявление`
        }
        else if (boardCount > 1 && boardCount < 5) {
            return `Найдено ${boardCount} объявления ситтеров`
        }
        else {
            return `Найдено ${boardCount} объявлений ситтеров`
        }
    }

    const handleStartDateChange = (newDate) => {
        setStartDate(newDate);

        // сбрасываем endDate, если она раньше новой startDate
        if (endDate && dayjs(endDate).isBefore(dayjs(newDate).add(1, 'day'))) {
            setEndDate(null);
        }

        setFilteredData(prev => ({ ...prev, startDate: newDate }));
    }

    // const handleEndDateChange = (newDate) => {
    //     setEndDate(newDate);
    //     setFilteredData(prev => ({ ...prev, endDate: newDate, startDate: startDate }));
    // }
    const handleEndDateChange = (newDate) => {
        setEndDate(newDate);
    
        const isValidStart = startDate && dayjs(startDate).isValid();
        const isValidEnd = newDate && dayjs(newDate).isValid();
    
        if (isValidStart && isValidEnd && dayjs(newDate).isAfter(dayjs(startDate))) {
            setFilteredData(prev => ({
                ...prev,
                //startDate: startDate,
                endDate: newDate
            }));
        }
    }

    const handleResetFilters = () => {
        // Сбрасываем состояния к начальным значениям
        setSliderValue(3000);
        setAnimalName(["Любые"]);
        setStartDate(null);
        setEndDate(null);
        setIsAnySelected(true);
        
        // Сбрасываем filteredData к начальным значениям
        setFilteredData({
            maxPrice: null,
            animalNames: null,
            startDate: null,
            endDate: null
        });
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
                        //borderRadius: 3,
                        flexGrow: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Typography sx={{ fontWeight: 'bold', fontSize: '22px' }}>
                            {getBoardCountString()}
                        </Typography>
                    </Paper>

                    <Paper elevation={3} sx={{
                        backgroundColor: '#D0EFB1',
                        padding: '20px',
                        width: '30%',
                        boxSizing: 'border-box',
                        //borderRadius: 3,
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
                        {boardSitters.map((bs) => (
                            <SitterCard key={bs.sitterId} boardSitter={bs} />
                        ))}
                    </Box>

                    <Box sx={{ display: 'flex', width: '30%', gap: '20px', flexDirection: 'column', overflow: 'hidden' }}>

                        <Paper elevation={3} sx={{ backgroundColor: '#D0EFB1', padding: '20px', width: '100%', boxSizing: 'border-box' }}>
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
                            {/* <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} sx={{ marginTop: '10px', width: '100%' }} title="Отдадите" />
                            </LocalizationProvider>

                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <CalendarPicker disabledDates={disabledDates} disableTooltip={'На передержке будут другие животные'} sx={{ marginTop: '20px', width: '100%' }} title="Заберете" />
                            </LocalizationProvider> */}
                            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru" localeText={russianLocaleInLower}>
                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '10px' }}>
                                    Отдадите
                                </Typography>
                                <DateField
                                    value={startDate}
                                    onChange={handleStartDateChange}
                                    size='small'
                                    sx={{ background: '#e0e0e0', width: '100%', marginTop: '10px' }}
                                />

                                <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '20px' }}>
                                    Заберете
                                </Typography>
                                <DateField
                                    value={endDate}
                                    onChange={handleEndDateChange}
                                    size='small'
                                    disabled={!startDate}
                                    minDate={nextDay}
                                    sx={{ background: '#e0e0e0', width: '100%', marginTop: '10px' }}
                                />
                            </LocalizationProvider>

                            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                <Button variant="contained" onClick={handleResetFilters}>Сбросить фильтры</Button>
                            </Box>

                        </Paper>
                    </Box>
                </Box>
            </Box>
        </>
    )
}

export default Sitters;
