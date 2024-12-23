import React from "react";
import {Container} from "@mui/material";
import './MainHeader.css'

const MainHeader = () => {
    return (
        <header className="header">
            {/* <Container maxWidth="lg" sx ={{width:'100%',margin:'0,auto','&>*':{transform:'scale(var(--scale,1))', transformOrigin:'center', transition: 'transform 0.2s ease-in-out',}}}> */}
            <a href="/" className="logo">Pet Sitter Finder</a>
            {/* </Container> */}
        </header>
    )
}

export default MainHeader;