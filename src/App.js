import React from 'react';
import Generator from './Generator';
import Verify from './Verify';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  
  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Router>
            <Routes>
              <Route path="/user/verify/:token" element={<Verify/>}/>
              <Route path="/" element={<Generator />} />
            </Routes>
        </Router>
      </ThemeProvider>
  );
}

export default App;