import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './containers/dashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box } from '@mui/material';

function App() {
  return (
    <Box sx={{scrollbarColor: 'black gray'}}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Dashboard></Dashboard>} />
          </Routes>
        </div>
      </Router>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark" 
        style={{ color: 'white' }}
      />
    </Box>

  );
}

export default App;