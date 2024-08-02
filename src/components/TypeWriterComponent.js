import React, { useState, useEffect } from 'react';
import './TypeWriterComponent.css';

const TypeWriterComponent = ({ words, period }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [txt, setTxt] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(200);

  useEffect(() => {
    let ticker = setTimeout(() => {
      tick();
    }, delta);

    return () => clearTimeout(ticker);
  }, [txt, isDeleting]);

  const tick = () => {
    const i = wordIndex % words.length;
    const fullTxt = words[i];

    if (isDeleting) {
      setTxt(fullTxt.substring(0, txt.length - 1));
    } else {
      setTxt(fullTxt.substring(0, txt.length + 1));
    }

    setDelta(isDeleting ? 100 : 200 - Math.random() * 100);

    if (!isDeleting && txt === fullTxt) {
      setTimeout(() => setIsDeleting(true), period);
    } else if (isDeleting && txt === '') {
      setIsDeleting(false);
      setWordIndex(wordIndex + 1);
    }
  };

  return (
    <div className="typewrite">
      <span className="wrap">{txt}</span>
    </div>
  );
};

export default TypeWriterComponent;
