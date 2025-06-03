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
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <form onSubmit={handleSubmit}>
                <h1 className="text-center mb-4">Word to Translate</h1>
                <div className="mb-3">
                  <input id="word" type="text" className="form-control" value={word} onChange={(e) => setWord(e.target.value)} required />
                </div>
                <h2 className="mb-3">Translations:</h2>
                {translations.map((translation, index) => (
                  <div key={index} className="translation-section mb-3">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <select id="languageCode" className="form-select" data-testid="language-select" value={translation.languageCode} onChange={(e) => handleLanguageChange(index, e.target.value)} required>
                          <option value="">Select Language</option>
                          {languages.map((language) => (
                            <option key={language.id} value={language.code}>{language.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-6">
                        <input id="translation" type="text" className="form-control" value={translation.translation} onChange={(e) => handleTranslationChange(index, e.target.value)} required />
                      </div>
                      <div className="col-md-2">
                        <button onClick={() => handleRemoveTranslation(index)} className="btn btn-secondary btn-sm">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button onClick={handleAddTranslation} className="btn btn-secondary mb-3">Add Translation</button>
                <button type="submit" className="btn btn-primary mb-3">Create Word</button>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
              {success && <p className="text-success mt-3">{success}</p>}
            </div>
          </div>
        </div>
      );
}

export default AddNewWords;