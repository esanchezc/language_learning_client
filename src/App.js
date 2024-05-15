import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import PracticeWords from './PracticeWords';
import LearnWords from './LearnWords';
import AddNewWords from './AddNewWords';
import './styles/base.css';

function App() {
    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Word Learner</h1>
            <form>
                <div className="translation-section" style={{ textAlign: 'center' }}>
                    <Link to="/learn-words" className="next-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Learn words</Link>
                    <Link to="/add-new-words" className="next-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Add new words</Link>
                    <Link to="/practice-words" className="next-button" style={{ display: 'inline-block', textDecoration: 'none' }}>Practice words</Link>
                </div>
            </form>
            <Routes>
                <Route path="/learn-words" element={<LearnWords />} />
                <Route path="/add-new-words" element={<AddNewWords />} />
                <Route path="/practice-words" element={<PracticeWords />} />
            </Routes>
        </div>
    );
}

export default App;