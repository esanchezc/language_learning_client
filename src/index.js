import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import LearnWords from './LearnWords';
import AddNewWords from './AddNewWords';

ReactDOM.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/learn-words" element={<LearnWords />} />
            <Route path="/add-new-words" element={<AddNewWords />} />
        </Routes>
    </BrowserRouter>,
    document.getElementById('root')
);