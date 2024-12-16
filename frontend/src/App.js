import { useState } from 'react';
import './App.css';

function App() {
  const [textInput, setTextInput] = useState('');
  const [morseCode, setMorseCode] = useState('');

  const handleInputChange = (event) => {
    setTextInput(event.target.value);
  };

  const getMorseData = async () => {
    if (textInput.trim() === '') {
      alert("Enter some text");
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
      const audio = new Audio(uniqueAudioUrl);
      audio.onplay = () => {
        ballAnimate(result.morse_code);  
      };
      await audio.play();
      console.log("Morse code:", result.morse_code);
    } catch (error) {
      console.error("Error fetching morse data:", error);
    }
  };

  function ballAnimate(morse_code) {
    
    const ball = document.querySelector('.ball');
    if (!ball) return; 

    let duration = 0;

    const animate = (type, time) => {
        const inClass = `${type}-in`;
        const outClass = `${type}-out`;

        setTimeout(() => {
            ball.classList.add(inClass);
            setTimeout(() => {
                ball.classList.remove(inClass);
                ball.classList.add(outClass);
                setTimeout(() => {
                    ball.classList.remove(outClass);
                }, time); 
            }, 100); 
        }, duration);

        duration += time + 100;
    };

    for (const character of morse_code) {
        if (character === '.') {
            animate('dot', 100);
        } else if (character === '-') {
            animate('dash', 300);
        }
    }
}

  const playAudio = () => {
    getMorseData();
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
      </div>
      <div className="container">
        <div className="ball"></div>
      </div>
    </div>
  );
}

export default App;
