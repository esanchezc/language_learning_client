import React from 'react';
import { Link } from 'react-router-dom';

function App() {
    return (
        <div>
            <h1 style={{textAlign: 'center'}}>Word Learner</h1>
            <form>
                <div className="translation-section" style={{textAlign: 'center'}}>
                    <Link to="/learn-words" className="next-button" style={{display: 'inline-block', textDecoration: 'none'}}>Learn words</Link>
                    <Link to="/add-new-words" className="next-button" style={{display: 'inline-block', textDecoration: 'none'}}>Add new words</Link>
                </div>
            </form>
        </div>
    );
}

export default App;