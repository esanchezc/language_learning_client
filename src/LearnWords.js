import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './styles/base.css';

function LearnWords() {
    const [words, setWords] = useState([]);
    const [error, setError] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [image, setImage] = useState('');
    const [translation, setTranslation] = useState('');

    const handleNextClick = useCallback(() => {
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        setError(null); // Clear the error message
    }, [words, currentWordIndex]);

    const handlePrevClick = useCallback(() => {
        setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length);
        setError(null); // Clear the error message
    }, [words, currentWordIndex]);

    const handleLanguageChange = useCallback((event) => {
        setSelectedLanguage(event.target.value);
        setError(null); // Clear the error message
    }, []);

    const onImageError = useCallback((event) => {
        event.target.src = '/icons/empty-basket.png';
    }, []);

    const imageComponent = useMemo(() => {
        if (words.length > 0) {
            return (
                <div className="image-container">
                    <img src={image} alt="Word" onError={onImageError} />
                    <label className="original-word">{words[currentWordIndex].word}</label>
                    <label className="translated-word">{translation}</label>
                </div>
            );
        }
        return null;
    }, [words, image, currentWordIndex, translation]);

    const languageSelect = useMemo(() => {
        return (
            <select
                data-testid="language-select"
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
        );
    }, [languages, selectedLanguage]);

    return (
        <form className="centered-form">
            <h1>Learn Words</h1>
            {languageSelect}
            {imageComponent}
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
                </div>
            )}
        </form>
    );
}

export default LearnWords;