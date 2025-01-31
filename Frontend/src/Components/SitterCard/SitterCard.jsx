import React from 'react';
import './SitterCard.css'
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Tooltip, Link } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faFishFins, faHorse, faDove, faSpider } from '@fortawesome/free-solid-svg-icons';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { GiGecko } from "react-icons/gi";



//dog cat reptile fish bird farmPets smallPet   #D0EFB1
const SitterCard = ({ sitter }) => {

  const about = "Всем привет! Меня зовут Даша! Я очень люблю домашних животных!"

  const {
    firstname,
    lastname,
    login,
    profileImagePath,
    city,
    address,
    rating,
    rateCount,
    pricePerDay,
    animals
  } = sitter;

  const avatarAlt = firstname?.[0]?.toUpperCase() || ""


  const animalInfo = {
    Dog: { icon: faDog, title: 'Собаки', fontSize: '20px' },
    Cat: { icon: faCat, title: 'Кошки', fontSize: '20px' },
    Fish: { icon: faFishFins, title: 'Рыбки', fontSize: '20px' },
    Bird: { icon: faDove, title: 'Птички', fontSize: '20px' },
    Reptile: { icon: GiGecko, title: 'Рептилии', fontSize: '20px' },
    Spider: { icon: faSpider, title: 'Пауки', fontSize: '20px' },
    Horse: { icon: faHorse, title: 'Фермерские животные', fontSize: '20px' },
    SmallPet: { icon: PestControlRodentIcon, title: 'Грызуны', fontSize: '25px' },
  }

  return (
    <Card sx={{
      display: 'flex', maxWidth: 800, boxShadow: 3,
      borderRadius: 3, margin: 2, backgroundColor: '#D0EFB1'
    }}>
      {/* Фото профиля */}
      <CardMedia sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          src={`https://localhost:5000${profileImagePath}`}
          alt={avatarAlt}
          sx={{ width: 150, height: 150, margin: 2 }}
        />
      </CardMedia>

      {/* Содержимое карточки */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold" color="primary">
          <Link
            href={`https://localhost:5173/${login}`}
            underline="none"
            color="inherit"
            sx={{
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: 'inherit',
              },
            }}> {`${firstname} ${lastname}`}
          </Link>

        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '15px' }}>
          {city || "Город не указан"}, {address || "Адрес не указан"}
        </Typography>

        {/* Рейтинг */}
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <Tooltip title="Средняя оценка пользователей" placement="top">
            <StarIcon sx={{ fill: '#FFD700', stroke: '#9B2D20', strokeWidth: 1.5, fontSize: '20px', marginLeft: '-4px', marginBottom: '2.5px' }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 0.5, fontSize: '16px' }}>
            {rating.toFixed(1)}
          </Typography>
          <Typography variant="body2" color="warning" sx={{ fontWeight: 'bold', ml: 0.5, fontSize: '16px' }}>
            {rateCount} отзывов
          </Typography>

        </Box>

        <Box display="flex" alignItems="center" mt={1} gap={1}>
          {animals.map((animal, index) => {
            const animalData = animalInfo[animal];
            if (!animalData) return null;

            const { icon, title, fontSize } = animalData;

            return (
              <Tooltip key={index} title={title} placement="top">
                {typeof icon === 'function' ? (
                  <span style={{ display: 'flex', alignItems: 'center', fontSize }}>
                    {React.createElement(icon, { style: { color: '#4D7298', fontSize } })}
                  </span>
                ) : (
                  <FontAwesomeIcon icon={icon} style={{ color: '#4D7298', fontSize }} />
                )}
              </Tooltip>
            );
          })}
        </Box>

      </CardContent>

      {/* Цена */}
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}>
        {pricePerDay > 0 ? (
          <>
            <Typography variant="h6" component="div" fontWeight="bold" color="#f57c00">
              {`${pricePerDay} ₽`}
            </Typography>
            <Typography variant="body2" color="text.secondary" fontSize="14px">
              за сутки
            </Typography>
          </>
        ) : (<Typography variant="h6" component="div" fontWeight="bold" color="#f57c00">
          Цена не указана
        </Typography>)}

      </Box>
    </Card>
  );
};

export default SitterCard;
