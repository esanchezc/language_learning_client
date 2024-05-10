import React, { useState, useEffect } from 'react';
import WordCard from './WordCard';
import './App.css';

function LearnWords() {
    const [words, setWords] = useState([]);
    const [error, setError] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [showTranslation, setShowTranslation] = useState(false);
    const [translation, setTranslation] = useState(null);
    const [languages, setLanguages] = useState([]);
    const [selectedLanguage, setSelectedLanguage] = useState('');

    useEffect(() => {
        fetch('/languages')
            .then(response => response.json())
            .then(data => {
                setLanguages(data);
                // Set the default language code to Spanish if it exists in the languages array
                const spanishLanguage = data.find(language => language.name === 'Spanish');
                if (spanishLanguage) {
                    setSelectedLanguage(spanishLanguage.code);
                }
            });
    }, []);

    useEffect(() => {
        fetch('/words')
            .then(response => response.json())
            .then(data => {
                setWords(data);
                // Set the currentWordIndex to a random index within the bounds of the words array
                setCurrentWordIndex(Math.floor(Math.random() * data.length));
            })
            .catch(err => setError(err.message));
    }, []);

    if (words.length === 0) {
        return <div>Loading...</div>;
    }

    const currentWord = words[currentWordIndex];

    const handleNextClick = () => {
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        setShowTranslation(false);
        setTranslation(null);
        setError(null); // Clear the error message
    };

    const handlePrevClick = () => {
        setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length);
        setShowTranslation(false);
        setTranslation(null);
        setError(null); // Clear the error message
    };

    const handleWordClick = () => {
        if (!showTranslation) {
            fetch(`/words/${currentWord.id}/translations/${selectedLanguage}`)
                .then(response => response.text())
                .then(data => {
                    try {
                        const jsonData = JSON.parse(data);
                        if (jsonData.translation) {
                            setTranslation(jsonData.translation);
                        } else {
                            setTranslation(null);
                            setError('Translation not found.');
                        }
                    } catch (error) {
                        setError('Error parsing JSON response.');
                    }
                })
                .catch(err => setError(err.message));
        }
        setShowTranslation(!showTranslation);
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        setError(null); // Clear the error message
    };

    return (
        <form className="centered-form">
            <select
                className="select-language"
                onChange={handleLanguageChange}
                value={selectedLanguage}
            >
                <option value="">Select a language</option>
                {languages.map((language) => (
                    <option key={language.code} value={language.code}>
                        {language.name}
                    </option>
                ))}
            </select>
            <div
                className={`word-card ${showTranslation ? 'word-card-back' : 'word-card-front'}`}
                onClick={handleWordClick} // add the onClick event handler here
            >
                <WordCard
                    word={currentWord}
                    languageCode={selectedLanguage}
                    translation={translation}
                    showTranslation={showTranslation}
                />
            </div>
            <div className="button-container">
                <button
                    type="button"
                    className="prev-button"
                    onClick={handlePrevClick}
                >
                    Prev
                </button>
                <button
                    type="button"
                    className="next-button"
                    onClick={handleNextClick}
                >
                    Next
                </button>
            </div>
            {error && (
                <div>
                    <p style={{ color: 'red' }}>{error}</p>
                    <p>
                        <a href="/add-new-words">Add the missing translation</a>
                    </p>
                </div>
            )}
        </form>
    );
}

export default LearnWords;