import React from 'react';
import './SitterCard.css'
import { Card, CardMedia, Typography, Box, Avatar, Tooltip, Link, Button } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog, faCat, faFishFins, faHorse, faDove, faSpider } from '@fortawesome/free-solid-svg-icons';
import PestControlRodentIcon from '@mui/icons-material/PestControlRodent';
import { GiGecko } from "react-icons/gi";
import useAuth from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';



//dog cat reptile fish bird farmPets smallPet   #D0EFB1
const SitterCard = ({ boardSitter }) => {

  const { auth, setAuth } = useAuth()
  const navigate = useNavigate()

  const {
    sitterId,
    boardId,
    firstname,
    lastname,
    login,
    profileImage,
    city,
    address,
    rating,
    rateCount,
    price,
    animalNames,
    content
  } = boardSitter;

  const avatarAlt = firstname?.[0]?.toUpperCase() || ""


  const animalInfo = {
    Dog: { icon: faDog, title: 'Собаки', fontSize: '20px' },
    Cat: { icon: faCat, title: 'Кошки', fontSize: '20px' },
    Fish: { icon: faFishFins, title: 'Рыбки', fontSize: '20px' },
    Bird: { icon: faDove, title: 'Птички', fontSize: '20px' },
    Reptile: { icon: <GiGecko />, title: 'Рептилии', fontSize: '20px' },
    Spider: { icon: faSpider, title: 'Пауки', fontSize: '20px' },
    FarmPet: { icon: faHorse, title: 'Фермерские животные', fontSize: '20px' },
    SmallPet: { icon: <PestControlRodentIcon sx={{ fontSize: '25px', p: 0, m: 0 }} />, title: 'Грызуны', fontSize: '25px' },
  }

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

  const handleSubmitRequest = () => {
    navigate("/boardings/request", {
      state: {
        boardAnimals: animalNames.map(name => reversedTranslations[name]),
        boardPrice: price,
        boardId: boardId,
        sitterId: sitterId
      }
    });
  };

  return (
    <Card sx={{
      display: 'flex', width: '100%', boxShadow: 3,
      //borderRadius: 3, 
      backgroundColor: '#D0EFB1'
    }}>
      {/* Фото профиля */}
      <CardMedia sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Avatar
          src={`https://localhost:5000${profileImage}`}
          alt={avatarAlt}
          sx={{ width: 150, height: 150, margin: 2 }}
        />
      </CardMedia>

      <Box sx={{ display: 'flex', flexDirection: 'column', marginTop: 2, width: '100%' }}>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Box>
                <Typography variant="h6" component="div" fontWeight="bold" color="black">
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
              </Box>
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '15px' }}>
              {city || "Город не указан"}, {address || "адрес не указан"}
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

          </Box>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: 2

          }}>

            {price > 0 ? (
              <>
                <Typography variant="h6" component="div" fontWeight="bold" color="#f57c00">
                  {`${price} ₽`}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontSize="14px">
                  за сутки
                </Typography>
              </>
            ) : (<Typography variant="h6" component="div" fontWeight="bold" color="#f57c00">
              Цена не указана
            </Typography>)}
          </Box>
        </Box>



        <Box sx={{ display: 'flex', alignItems: 'flex-start', mt: 2 }}>
          <Box>
            <Typography variant="body2" sx={{
              fontWeight: 'bold',
              fontSize: '16px',
              wordBreak: 'break-word',
              overflowWrap: 'break-word'
            }}>
              {content}
            </Typography>
          </Box>


          <Box sx={{ marginRight: 2, marginLeft: 2 }}>
            {auth?.role?.includes('Owner') ? (<>
              <Button variant='contained' onClick={handleSubmitRequest} sx={{ whiteSpace: 'nowrap' }}>Отправить заявку</Button>
            </>) : (auth?.role?.includes('Sitter') ? (<> </>) : (<>
              <Tooltip
                title={<p style={{
                  fontSize: "12px"
                }}>Отправлять заявки могут только авторизованные пользователи</p>}
                placement='top'>
                <span>
                  <Button variant='contained' disabled sx={{ whiteSpace: 'nowrap' }}>Отправить заявку</Button>
                </span>
              </Tooltip>
            </>)

            )}

          </Box>

        </Box>

        {/* <Box display="flex" alignItems="center" mt={1} mb={2} gap={1}>
          {animalNames.map((animal, index) => {
            const animalData = animalInfo[animal];
            if (!animalData) return null;

            const { icon, title, fontSize } = animalData;

            return (
              <Tooltip key={index} title={title} placement="top">
                {typeof icon === 'function' ? (
                  <span style={{ display: 'flex', alignItems: 'center', fontSize }}>
                    {React.createElement(icon, { style: { color: 'black', fontSize } })}
                  </span>
                ) : (
                  <FontAwesomeIcon icon={icon} style={{ color: 'black', fontSize }} />
                )}
              </Tooltip>
            );
          })}
        </Box> */}
        <Box display="flex" alignItems="center" mt={1} mb={2} gap={1}>
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
        </Box>

      </Box>

    </Card>
  );
};

export default SitterCard;