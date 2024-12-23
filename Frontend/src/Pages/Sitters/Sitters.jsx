import React from "react";
import './Sitters.css'
import MainHeader from '../../Components/MainHeader/MainHeader'
import Navbar from '../../Components/Navbar/Navbar'
import SitterCard from '../../Components/SitterCard/SitterCard'
// import {Container} from "@mui/material";
import { getSitters } from "../../api/userProfiles"
import { useEffect, useState } from "react";

const Sitters = ({isAuthenticated}) => {

    const[sitters, setSitters] = useState([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSitters()
                setSitters(response.data)
            } catch(e) {
                console.error("Error of receiving sitters: ", e)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            {/* <div className="sitters-header-container"> */}
                <MainHeader />
                <Navbar isAuthenticated={isAuthenticated}/>
            {/* </div> */}
            {/* <Container maxWidth="lg" sx ={{width:'100%',margin:'0,auto',
                '&>*':{transform:'scale(var(--scale,1))', 
                transformOrigin:'center', 
                transition: 'transform 0.2s ease-in-out',}}}> */}
            <div className="sitters-cards-container">
            {sitters.map((sitter) => (
                    <SitterCard key={sitter.profileid} sitter={sitter} />
                ))}
            </div>
            {/* </Container> */}
        </>
    )
}

export default Sitters;