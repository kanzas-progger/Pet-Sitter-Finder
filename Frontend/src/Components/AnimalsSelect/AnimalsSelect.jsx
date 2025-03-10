// import React from 'react'

// const AnimalsSelect = () => {

//     const ITEM_HEIGHT = 48;
//     const ITEM_PADDING_TOP = 8;
//     const MenuProps = {
//       PaperProps: {
//         style: {
//           maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//           width: 250,
//         },
//       },
//     };

//     return (
//         <>
//             <FormControl size='small' sx={{ width: '70%', marginTop: '10px', '& .MuiOutlinedInput-root': { background: '#e0e0e0' } }}>
//                 <Select
//                     id="demo-multiple-checkbox"
//                     multiple
//                     value={animalName}
//                     onChange={handleAnimalChange}
//                     input={<OutlinedInput />}
//                     renderValue={(selected) => selected.join(', ')}
//                     MenuProps={MenuProps}
//                 >
//                     {animals.map((name) => (
//                         <MenuItem key={name} value={name}>
//                             <Checkbox checked={animalName.includes(name)} />
//                             <ListItemText primary={name} />
//                         </MenuItem>
//                     ))}
//                 </Select>
//             </FormControl>
//         </>
//     )
// }

// export default AnimalsSelect