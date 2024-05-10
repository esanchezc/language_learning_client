import React from 'react';

function WordCard({ word, languageCode, translation, showTranslation, onClick }) {
  return (
    <div onClick={onClick}>
      {showTranslation ? (
        // Render the translation here
        <div>{translation}</div>
      ) : (
        // Render the word here
        <div>{word.word}</div>
      )}
    </div>
  );
}

export default WordCard;