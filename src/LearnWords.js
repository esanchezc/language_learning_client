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
            setImage(`/icons/${currentWord.word.toLowerCase()}.png`);
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
        <div className="container-fluid py-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <form className="centered-form">
                        <div className="text-center mb-4">
                            <h1 className="display-4">Learn Words</h1>
                        </div>

                        <div className="mb-4">
                            <select
                                data-testid="language-select"
                                className="form-select select-language"
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
                        </div>

                        {words.length > 0 && (
                            <div className="mb-4">
                                <div className="image-container">
                                    <img src={image} alt="Word" onError={onImageError} className="img-fluid custom-image" />
                                    <label className="original-word">{words[currentWordIndex].word}</label>
                                    <label className="translated-word">{translation}</label>
                                </div>
                            </div>
                        )}

                        <div className="mb-4">
                            <div className="d-flex justify-content-center">
                                <button
                                    type="button"
                                    className="btn btn-secondary me-2"
                                    onClick={handlePrevClick}
                                >
                                    Prev
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary ms-2"
                                    onClick={handleNextClick}
                                >
                                    Next
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div>
                                <p className="text-danger text-center">{error}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LearnWords;