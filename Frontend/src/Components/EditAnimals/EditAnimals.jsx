import React from 'react'
import { useState, useEffect } from 'react';
import {
  Paper, Typography, Divider, Box, Button, FormControl, Select, MenuItem, Checkbox,
  InputLabel, OutlinedInput, ListItemText
} from '@mui/material'
import useProfile from '../../hooks/useProfile';
import { useNavigate } from 'react-router'
import axios from 'axios';

const EditAnimals = () => {

  const [animalName, setAnimalName] = useState([]);
  const { profile, setProfile } = useProfile()
  const navigate = useNavigate()



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

  useEffect(() => {
    if (profile?.animals) {
      const translatedAnimals = animals.filter(
        (name) => profile.animals.includes(animalTranslations[name])
      )
      setAnimalName(translatedAnimals)
    }

  }, [profile])

  const handleAnimalChange = (e) => {
    const {
      target: { value },
    } = e;
    setAnimalName(typeof value === 'string' ? value.split(',') : value);
    //setAnimalIsValid(false)
  }

  const handleAnimalsSave = async () => {
    const data = { animals: animalName.map(name => animalTranslations[name])}
    try {
      const response = await axios.post("https://localhost:5000/api/animals/edit", data,
        {
          withCredentials: true
        });
        console.log(response)
      navigate(0); 
    } catch (error) {
      console.error('Ошибка при сохранении данных:', error);
    }
  }

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

  return (
    <>
      <Paper elevation={3} sx={{ padding: '20px', width: '100%', boxSizing: 'border-box' }}>
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Информация о ваших животных</Typography>
        <Divider sx={{ marginTop: '20px' }} />

        <Box sx={{ marginTop: '20px' }}>
          <Typography sx={{ color: '#6b7280' }}>Укажите, какими животными вы владеете</Typography>

          <Typography sx={{ fontWeight: 'bold', fontSize: '16px', marginTop: '30px' }}>Животные <span style={{ color: '#c70000' }}>*</span></Typography>

          <FormControl sx={{ width: '70%', marginTop: '10px' }}>
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

        </Box>

        <Button onClick={handleAnimalsSave} variant="contained" color="primary" sx={{ marginTop: '30px' }}>
          Сохранить
        </Button>
      </Paper>
    </>
  )
}

export default EditAnimals