import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/base.css';

function AddNewWords() {
    const [languages, setLanguages] = useState([]);
    const [word, setWord] = useState('');
    const [translations, setTranslations] = useState([{ languageCode: '', translation: '' }]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetch('/languages')
            .then(response => response.json())
            .then(data => setLanguages(data))
            .catch(error => setError('An error occurred while fetching languages'));
    }, []);

    const handleAddTranslation = () => {
        setTranslations([...translations, { languageCode: '', translation: '' }]);
    };

    const handleRemoveTranslation = (index) => {
        setTranslations(translations.filter((translation, i) => i !== index));
    };

    const handleLanguageChange = (index, languageCode) => {
        const newTranslations = translations.map((t, i) => {
            if (i === index) {
                return { ...t, languageCode };
            }
            return t;
        });
        setTranslations(newTranslations);
    };

    const handleTranslationChange = (index, translation) => {
        const newTranslations = [...translations];
        newTranslations[index].translation = translation;
        setTranslations(newTranslations);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/words', { word, translations });
            setSuccess(response.data.message);
            setError(null);
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.message);
            } else {
                setError('An unknown error occurred');
            }
        }
    };

    return (
        <div>
            <h1>Add New Word</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="word">Word:</label>
                <input id="word" type="text" value={word} onChange={(e) => setWord(e.target.value)} required />
                <br />
                <h2>Translations:</h2>
                {translations.map((translation, index) => (
                    <div key={index} className="translation-section">
                        <label htmlFor="languageCode">Language Code:</label>
                        <select id="languageCode"
                            data-testid="language-select"
                            value={translation.languageCode}
                            onChange={(e) => handleLanguageChange(index, e.target.value)}
                            required
                        >
                            <option value="">Select Language</option>
                            {languages.map(language => (
                                <option key={language.id} value={language.code}>
                                    {language.name}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="translation">Translation:</label>
                        <input id="translation"
                            type="text"
                            value={translation.translation}
                            onChange={(e) => handleTranslationChange(index, e.target.value)}
                            required
                        />
                        <button onClick={() => handleRemoveTranslation(index)}>Remove Translation</button>
                    </div>
                ))}

                <button onClick={handleAddTranslation}>Add Translation</button>
                <br />
                <button type="submit">Create Word</button>
            </form>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        </div>
    );
}

export default AddNewWords;