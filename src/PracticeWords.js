import React, { useState, useEffect } from 'react';
import 'font-awesome/css/font-awesome.min.css';



function PracticeWords() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [image, setImage] = useState('');
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [wordName, setWordName] = useState('');
    const [isCorrect, setIsCorrect] = useState(null);
    const [words, setWords] = useState([]);
    const [currentWord, setCurrentWord] = useState({});

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
                const randomWord = data[Math.floor(Math.random() * data.length)];
                setCurrentWord(randomWord);
                setImage(`/icons/${randomWord.word}.png`);
                setCorrectAnswer(randomWord.id);
                setWordName(randomWord.word);
            });
    }, []);

    const handleCheck = (event) => {
        event.preventDefault();
        fetch(`/words/${correctAnswer}/translations/${selectedLanguage}`)
            .then(response => response.json())
            .then(data => {
                const correctTranslation = data.translation;
                if (userAnswer.toLowerCase() === correctTranslation.toLowerCase()) {
                    setIsCorrect(true);
                } else {
                    setIsCorrect(false);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
    };

    const handleNext = () => {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(randomWord);
        setImage(`/icons/${randomWord.word}.png`);
        setCorrectAnswer(randomWord.id);
        setWordName(randomWord.word);
        setUserAnswer('');
        setIsCorrect(null);
    };


    const onImageError = (event) => {
        event.target.src = '/icons/empty-basket.png';
    }

    return (
        <div className="centered-form">
            <h1>Practice Words</h1>
            <form>
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
                <div className="image-container">
                    <img src={image} alt="Fruit" className="image" onError={onImageError} />
                    <label>{wordName}</label>
                </div>
                <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                <div className="button-group">
                    <button type="submit" onClick={handleCheck}>Check</button>
                    {isCorrect && (
                        <button onClick={handleNext}>Next</button>
                    )}
                    {isCorrect === false && (
                        <button onClick={handleNext}>Skip</button>
                    )}
                </div>
                {isCorrect !== null && (
                    <div>
                        {isCorrect ? (
                            <div className='correct'>
                                Correct! <i class="fa fa-check" aria-hidden="true"></i>
                            </div>
                        ) : (
                            <div className='incorrect'>
                                Incorrect. Try again! <i class="fa fa-times" aria-hidden="true"></i>
                            </div>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}

export default PracticeWords;