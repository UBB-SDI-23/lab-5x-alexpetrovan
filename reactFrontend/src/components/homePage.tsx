import { Typography } from "@mui/material";
import React from "react";

const Home:React.FC<{}> = () => {
    return (
        <React.Fragment>
            <Typography
            variant="h5"
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
              }}
            >
                This is the home page.
            </Typography>
        </React.Fragment>
    )
}

export default Home