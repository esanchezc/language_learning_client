import React, { useState, useEffect } from 'react';

function PracticeWords() {
    const [selectedLanguage, setSelectedLanguage] = useState('');
    const [languages, setLanguages] = useState([]);
    const [userAnswer, setUserAnswer] = useState('');
    const [image, setImage] = useState(''); 
    const [correctAnswer, setCorrectAnswer] = useState(''); 

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
                const randomWord = data[Math.floor(Math.random() * data.length)];
                setImage(`/icons/${randomWord.word}.png`); // assuming that the image is named as the word and stored in the 'icons' directory
                setCorrectAnswer(randomWord.word);
            });
    }, []);

    const handleCheck = () => {
        fetch(`/words/${correctAnswer}/translations/${selectedLanguage}`)
            .then(response => response.json())
            .then(data => {
                const correctTranslation = data.translation;
                if (userAnswer.toLowerCase() === correctTranslation.toLowerCase()) {
                    alert('Correct!');
                } else {
                    alert(`Incorrect. The correct answer is ${correctTranslation}.`);
                }
            })
            .catch(error => {
                console.error(error);
                alert('An error occurred while checking the answer.');
            });
    };

    const handleLanguageChange = (event) => {
        setSelectedLanguage(event.target.value);
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
                    <label>{correctAnswer}</label>
                </div>
                <input type="text" value={userAnswer} onChange={(e) => setUserAnswer(e.target.value)} />
                <button onClick={handleCheck}>Check</button>
            </form>
        </div>
    );
}

export default PracticeWords;