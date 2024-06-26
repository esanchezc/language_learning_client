import React, { useState, useEffect, useRef } from 'react';
import deburr from 'lodash.deburr';

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
    const [correctCount, setCorrectCount] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [newLanguage, setNewLanguage] = useState('');
    const inputRef = useRef(null);

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
        if (selectedLanguage) {
            fetchWords(selectedLanguage);
        }
    }, [selectedLanguage]);

    const fetchWords = (language) => {
        fetch(`/words/${language}`)
            .then(response => response.json())
            .then(data => {
                const shuffledData = data.sort(() => Math.random() - 0.5);
                setWords(shuffledData.slice(0, 10));
                const randomWord = shuffledData[0];
                setCurrentWord(randomWord);
                setImage(`/icons/${randomWord.word.toLowerCase()}.png`);
                setCorrectAnswer(randomWord.id);
                setWordName(randomWord.word);
            });
    };

    const checkUserAnswer = async () => {
        const response = await fetch(`/words/${correctAnswer}/translations/${selectedLanguage}`);
        const data = await response.json();
        const correctTranslation = data.translation;
        const cleanUserAnswer = deburr(userAnswer.toLowerCase());
        const cleanCorrectTranslation = deburr(correctTranslation.toLowerCase());
        if (cleanUserAnswer && cleanCorrectTranslation) {
            if (cleanUserAnswer === cleanCorrectTranslation) {
                setIsCorrect(true);
                setCorrectCount(correctCount + 1);
                setWords(words.filter(word => word.id !== correctAnswer));
                setIncorrectCount(0);
            } else {
                setIsCorrect(false);
                setIncorrectCount(incorrectCount + 1);
            }
        }
    };

    const handleCheck = async (event) => {
        event.preventDefault();
        if (userAnswer.trim() !== '') {
            setUserAnswer(userAnswer.trim());
            await checkUserAnswer();
            if (!isCorrect) {
                setUserAnswer('');
                inputRef.current.focus();
            }
        }
    };

    const handleLanguageChange = (event) => {
        setNewLanguage(event.target.value);
        if (correctCount > 0) {
            setShowDialog(true);
        } else {
            setSelectedLanguage(event.target.value);
        }
    };

    const handleNext = (event) => {
        event.preventDefault();
        if (words.length > 0) {
            const randomWord = words[Math.floor(Math.random() * words.length)];
            setCurrentWord(randomWord);
            setImage(`/icons/${randomWord.word.toLowerCase()}.png`);
            setCorrectAnswer(randomWord.id);
            setWordName(randomWord.word);
            setUserAnswer('');
            setIsCorrect(null);
            setIncorrectCount(0);
            inputRef.current.focus();
        } else {
            setImage('/icons/celebration.png');
        }
    };

    const handlePracticeAgain = () => {
        setCorrectCount(0);
        setIncorrectCount(0);
        setUserAnswer('');
        setIsCorrect(null);
        fetchWords(selectedLanguage);
    }

    const handleSkip = () => {
        handleNext();
    };

    const handleDialogConfirm = () => {
        setSelectedLanguage(newLanguage);
        setCorrectCount(0);
        setShowDialog(false);
    };

    const handleDialogCancel = () => {
        setShowDialog(false);
    };

    const onImageError = (event) => {
        event.target.src = '/icons/empty-basket.png';
    }

    return (
        <div className="centered-form">
            {showDialog && (
                <div className="modal-dialog">
                    <div className="modal-content">
                        <h3>Are you sure you want to switch languages?</h3>
                        <p>This will reset your correct answers count.</p>
                        <button data-testid="dialog-confirm-button" onClick={handleDialogConfirm}>Yes</button>
                        <button onClick={handleDialogCancel}>No</button>
                    </div>
                </div>
            )}
            <h1>Practice Words</h1>
            {words.length > 0 ? (
                <p data-testid="correct-answers" className="correct-answers">Correct Answers: {correctCount}</p>
            ) : (
                <div className="celebration-container">
                    <img src="/icons/celebration.png" alt="Celebration" className="celebration-image" />
                    <h2 data-testid="celebration-message" className="congratulations-message">Congratulations! You have correctly answered all words.</h2>
                    <div className="button-group">
                        <button data-testid="practice-again-button" onClick={handlePracticeAgain}>Practice again</button>
                        <button onClick={() => window.location.href = '/'}>Home</button>
                    </div>
                </div>
            )}
            <form>
                {words.length > 0 && (
                    <select
                        data-testid="select-language"
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
                )}
                {words.length > 0 && (
                    <div className="image-container">
                        <img src={image} alt="Fruit" className="image"  onError={onImageError} data-testid="word-image" />
                        <label data-testid="word-label">{wordName}</label>
                    </div>
                )}
                {words.length > 0 && (
                    <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} ref={inputRef} data-testid="answer-input" />
                )}
                {words.length > 0 && (
                    <div className="button-group">
                        {!isCorrect && (
                            <button data-testid="check-button" type="submit" onClick={handleCheck} disabled={incorrectCount >= 3} className={incorrectCount >= 3 ? 'disabled-button' : ''}>Check</button>
                        )}
                        {(isCorrect || incorrectCount >= 3) && (
                            <button data-testid="next-button" autoFocus onClick={handleNext}>Next</button>
                        )}
                        {isCorrect === false && incorrectCount < 3 && (
                            <button data-testid="skip-button" onClick={handleSkip}>Skip</button>
                        )}
                    </div>
                )}
                {isCorrect !== null && words.length > 0 && incorrectCount < 3 && (
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
                {incorrectCount >= 3 && (
                    <p data-testid="correct-translation" className="correct-translation">Correct translation: {currentWord.translation}</p>
                )}
            </form>
        </div>
    );
}

export default PracticeWords;