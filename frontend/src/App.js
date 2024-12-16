import { useState } from 'react';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [morseInput, setMorseInput] = useState('');
  const [morseCode, setMorseCode] = useState('');
  const [linkIsAvailable, setLinkIsAvailable] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [isTextInput, setIsTextInput] = useState(true);
  const [plainText, setPlainText] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleMorseChange = (event) => {
    setMorseInput(event.target.value);
  };

  const getMorseData = async () => {
    if (textInput.trim() === '') {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/get_morse_data?text=${encodeURIComponent(textInput)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setMorseCode(result.morse_code);

      const uniqueAudioUrl = `http://localhost:5000/static/morse_audio.wav?timestamp=${Date.now()}`;
      setLinkIsAvailable(true);
      setAudioUrl(uniqueAudioUrl);
      const audio = new Audio(uniqueAudioUrl);
      await audio.play();
      console.log('Morse code:', result.morse_code);
    } catch (error) {
      console.error('Error fetching morse data:', error);
    }
  };

  const getPlainTextFromMorse = async () => {
    if (morseInput.trim() === '') {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/get_plain_text_from_morse?morse_code=${encodeURIComponent(morseInput)}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const result = await response.json();
      setPlainText(result.plain_text);
      console.log('Plain text:', result.plain_text);

      const audioUrl = `http://localhost:5000/static/morse_audio.wav?timestamp=${Date.now()}`;
      setAudioUrl(audioUrl);
      const audio = new Audio(audioUrl);
      await audio.play();
    } catch (error) {
      console.error('Error fetching plain text:', error);
    }
  };

  const handleDownload = () => {
    fetch(audioUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'morse-audio.wav';
        link.click();
      })
      .catch((error) => {
        console.error('Error downloading audio:', error);
      });
  };

  const handleRadioChange = (event) => {
    setIsTextInput(event.target.value === 'text');
  };

  return (
    <div className="App">
      <h2 style={{color:"whitesmoke",fontFamily:"'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif"}}>Morse code audio generator</h2>
      <div className="input-container">
        {isTextInput ? (
          <>
            <input
              type="text"
              placeholder="Enter text"
              required
              onChange={handleInputChange}
            />
            <button onClick={getMorseData}>Play</button>
            <p>The morse code is: {morseCode}</p>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Morse code"
              required
              onChange={handleMorseChange}
            />
            <button onClick={getPlainTextFromMorse}>Generate Text</button>
            <p>The plain text is: {plainText}</p>
          </>
        )}

        <div className="radio-buttons">
          <label>
            <input type="radio" value="text" checked={isTextInput} onChange={handleRadioChange} /> Text to Morse
          </label>
          <label>
            <input type="radio" value="morse" checked={!isTextInput} onChange={handleRadioChange} /> Morse to Text
          </label>
        </div>

        {linkIsAvailable && (
          <div>
            <button onClick={handleDownload}>Download Audio</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
