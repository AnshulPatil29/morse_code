import { useState } from 'react';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [morseCode, setMorseCode] = useState('');
  const [linkIsAvailable, setLinkIsAvailable] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const getMorseData = async () => {
    if (textInput.trim() === '') {
      alert('Enter some text');
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

  const playAudio = () => {
    getMorseData();
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

  return (
    <div className="App">
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter text"
          required
          onChange={handleInputChange}
        />
        <button onClick={playAudio}>Play</button>
        <p>The morse code is: {morseCode}</p>
        {linkIsAvailable && (
          <div>
            <button onClick={handleDownload} style={{ padding: '10px 20px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '3px' }}>
              Download Audio
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
