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
            .catch(error => console.error(error));
    }, []);

    const handleAddTranslation = () => {
        setTranslations([...translations, { languageCode: '', translation: '' }]);
    };

    const handleRemoveTranslation = (index) => {
        setTranslations(translations.filter((translation, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/words', { word, translations });
            setSuccess(response.data.message);
            setError(null);
        } catch (err) {
            setError(err.response.data.message);
            setSuccess(null);
        }
    };

    return (
        <div>
            <h1>Add New Word</h1>
            <form onSubmit={handleSubmit}>
                <label>Word:</label>
                <input type="text" value={word} onChange={(e) => setWord(e.target.value)} required />
                <br />
                <h2>Translations:</h2>
                {translations.map((translation, index) => (
                    <div key={index} className="translation-section">
                        <label>Language Code:</label>
                        <select
                            value={translation.languageCode}
                            onChange={(e) => {
                                const newTranslations = [...translations];
                                newTranslations[index].languageCode = e.target.value;
                                setTranslations(newTranslations);
                            }}
                            required
                        >
                            <option value="">Select Language</option>
                            {languages.map(language => (
                                <option key={language.id} value={language.code}>
                                    {language.name}
                                </option>
                            ))}
                        </select>
                        <label>Translation:</label>
                        <input
                            type="text"
                            value={translation.translation}
                            onChange={(e) => {
                                const newTranslations = [...translations];
                                newTranslations[index].translation = e.target.value;
                                setTranslations(newTranslations);
                            }}
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