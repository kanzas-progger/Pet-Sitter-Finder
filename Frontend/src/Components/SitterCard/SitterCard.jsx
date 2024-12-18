import React from 'react';
import './SitterCard.css'
import { Card, CardContent, CardMedia, Typography, Box, Avatar, Tooltip, Link } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faFishFins, faHorse, faDove, faSpider } from '@fortawesome/free-solid-svg-icons';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { GiGecko } from "react-icons/gi";



//dog cat reptile fish bird farmPets smallPets   #D0EFB1
const SitterCard = () => {
  return (
    <Card sx={{
      display: 'flex', maxWidth: 600, boxShadow: 3,
      borderRadius: 3, margin: 2, backgroundColor: '#D0EFB1'
    }}>
      {/* Фото профиля */}
      <CardMedia sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          src="https://example.com/your-image-url.jpg"
          alt="Дарья Л."
          sx={{ width: 150, height: 150, margin: 2 }}
        />
      </CardMedia>

      {/* Содержимое карточки */}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h6" component="div" fontWeight="bold" color="primary">
          <Link
            href="#"
            underline="none"
            color="inherit"
            sx={{
              fontWeight: 'bold',
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
                textDecorationColor: 'inherit',
              },
            }}> Фамилия Имя
          </Link>

        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '15px' }}>
          Город, Улица
        </Typography>

        {/* Рейтинг */}
        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <Tooltip title="Средняя оценка пользователей" placement="top">
            <StarIcon sx={{ fill: '#FFD700', stroke:'#9B2D20',strokeWidth: 1.5, fontSize: '20px', marginLeft: '-4px', marginBottom:'2.5px' }} />
          </Tooltip>
          <Typography variant="body2" sx={{ fontWeight: 'bold', ml: 0.5, fontSize: '16px' }}>
            5.0
          </Typography>
          <Typography variant="body2" color="warning" sx={{ fontWeight: 'bold', ml: 0.5, fontSize: '16px' }}>
            2 отзыва
          </Typography>
          
        </Box>

        {/* Приветствие и описание */}
        <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold', fontSize: '16px' }}>
          Всем привет Меня зовут Даша, и я очень люблю домашних животных,
          сама всю жизнь прожила с ними в семейном доме!
        </Typography>

        <Box display="flex" alignItems="center" mt={1} gap={1}>
          <Tooltip title="Собаки" placement="top">
            <FontAwesomeIcon icon={faDog} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Кошки" placement="top">
            <FontAwesomeIcon icon={faCat} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Рыбки" placement="top">
            <FontAwesomeIcon icon={faFishFins} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Фермерские животные" placement="top">
            <FontAwesomeIcon icon={faHorse} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Птички" placement="top">
            <FontAwesomeIcon icon={faDove} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Пауки" placement="top">
            <FontAwesomeIcon icon={faSpider} style={{ color: '#4D7298', fontSize: 20 }} />
          </Tooltip>
          <Tooltip title="Рептилии" placement="top">
            <span style={{ display: 'flex', alignItems: 'center' }}>
              <GiGecko style={{ color: '#4D7298', fontSize: '20px' }} />
            </span>
          </Tooltip>
          <Tooltip title="Грызуны" placement="top">
            <PestControlRodentIcon sx={{ color: '#4D7298', fontSize: 25 }} />
          </Tooltip>
        </Box>



      </CardContent>

      {/* Цена */}
      <Box sx={{ display: 'flex',
       flexDirection: 'column', 
        alignItems: 'center',
         justifyContent: 'center',
          p: 2,
          marginBottom:3.5 }}>
        <Typography variant="h6" component="div" fontWeight="bold" color="#f57c00">
          600 ₽
        </Typography>
        <Typography variant="body2" color="text.secondary" fontSize="14px">
          за сутки
        </Typography>
      </Box>
    </Card>
  );
};

export default SitterCard;
