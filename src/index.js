import React from 'react';
import ReactDOM from 'react-dom/client'; // <--- changed import
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import LearnWords from './LearnWords';
import AddNewWords from './AddNewWords';
import PracticeWords from './PracticeWords';

const root = ReactDOM.createRoot(document.getElementById('root')); // <--- create root

root.render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/learn-words" element={<LearnWords />} />
            <Route path="/add-new-words" element={<AddNewWords />} />
            <Route path="/practice-words" element={<PracticeWords />} />
        </Routes>
    </BrowserRouter>
);
