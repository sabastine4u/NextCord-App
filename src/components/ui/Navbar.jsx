import React from 'react'
import {AppBar, Toolbar, Typography, Button, IconButton, Box, container} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle'


// npm install @mui/material @emotion/react @emotion/styled @mui/icons-material

function Navbar() {
    const navItems = ['Home', 'About', 'Contact'];
  return (
    <AppBar position='static' sx={{backgroundColor: '#d7b5aa'}}>
        <container maxWidth='xl'>
            <Toolbar disableGutters>
                <IconButton
                size='large'
                edge='start'
                color='inherit'
                aria-label='menu'
                sx={{mr:2, display: {xs: 'flex', md: 'none'}}}
                >
                    <MenuIcon/>
                </IconButton>
                <Typography
                variant='h6'
                component="div"
                sx={{flexGrow: 1, fontWeight: 'bold', cursor: 'pointer'}}
                >Onion Kitchen</Typography>

                <Box sx={{display:{xs: 'none', md: 'flex'}}}>
                    {navItems.map((item)=>(
                        <Button key={item} sx={{ color: '#fff', mx: 1}}>{item}</Button>
                    ))}
                </Box>
                <IconButton
                size='large'
                aria-label= 'account of current user'
                color='inherit'
                >
                    <AccountCircle/>

                </IconButton>
            </Toolbar>
        </container>
    </AppBar>
  )
}

export default Navbar