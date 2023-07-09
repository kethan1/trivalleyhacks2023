import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import axios from "axios";

import Home from './components/Home/Home.js';
import Upload from './components/Upload/Upload.js';
import Course from './components/Course/Course.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route index element={<Home />} />
          <Route path="upload" element={<Upload />} />
          <Route path="course/:courseName" element={<Course />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
