import React, { useState, useEffect } from 'react';
import './styles/base.css';

function LearnWords() {
    const [words, setWords] = useState([]);
    const [error, setError] = useState(null);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [image, setImage] = useState('');
    const [translation, setTranslation] = useState('');

    useEffect(() => {
        fetch('/languages')
            .then(response => response.json())
            .then(data => {
                setLanguages(data);
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
                setCurrentWordIndex(Math.floor(Math.random() * data.length));
            })
            .catch(error => {
                setError(error.message)
            });
    }, []);

    useEffect(() => {
        if (words.length > 0 && selectedLanguage) {
            const currentWord = words[currentWordIndex];
            setImage(`/icons/${currentWord.word}.png`);
            fetch(`/words/${currentWord.id}/translations/${selectedLanguage}`)
                .then(response => response.json())
                .then(data => {
                    if (data.translation) {
                        setTranslation(data.translation);
                    } else {
                        setTranslation('');
                        setError('Translation not found.');
                    }
                })
                .catch(error => {
                    setError('Error parsing JSON response.');
                });
        }
    }, [currentWordIndex, selectedLanguage, words]); // add words to the dependency array

    const handleNextClick = () => {
        setCurrentWordIndex((currentWordIndex + 1) % words.length);
        setError(null); // Clear the error message
    };

    const handlePrevClick = () => {
        setCurrentWordIndex((currentWordIndex - 1 + words.length) % words.length);
        setError(null); // Clear the error message
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
        setError(null); // Clear the error message
    };

    const onImageError = (event) => {
        event.target.src = '/icons/empty-basket.png';
    }

    return (
        <form className="centered-form">
            <h1>Learn Words</h1>
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
            {words.length > 0 && (
                <div className="image-container">
                    <img src={image} alt="Word" onError={onImageError} />
                    <label className="original-word">{words[currentWordIndex].word}</label>
                    <label className="translated-word">{translation}</label>
                </div>
            )}
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