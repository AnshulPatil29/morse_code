import numpy as np
from scipy.io.wavfile import write

def text_to_morse(text):
    """
    Converts a given string into Morse code.

    Args:
        text (str): The input string to convert.

    Returns:
        str: The Morse code representation of the input string.
    """
    morse_code_dict = {
        'A': '.-',
        'B': '-...',
        'C': '-.-.',
        'D': '-..',
        'E': '.',
        'F': '..-.',
        'G': '--.',
        'H': '....',
        'I': '..',
        'J': '.---',
        'K': '-.-',
        'L': '.-..',
        'M': '--',
        'N': '-.',
        'O': '---',
        'P': '.--.',
        'Q': '--.-',
        'R': '.-.',
        'S': '...',
        'T': '-',
        'U': '..-',
        'V': '...-',
        'W': '.--',
        'X': '-..-',
        'Y': '-.--',
        'Z': '--..',
        '1': '.----',
        '2': '..---',
        '3': '...--',
        '4': '....-',
        '5': '.....',
        '6': '-....',
        '7': '--...',
        '8': '---..',
        '9': '----.',
        '0': '-----',
        ',': '--..--',
        '.': '.-.-.-',
        '?': '..--..',
        "'": '.----.',
        '!': '-.-.--',
        '/': '-..-.',
        '(': '-.--.',
        ')': '-.--.-',
        '&': '.-...',
        ':': '---...',
        ';': '-.-.-.',
        '=': '-...-',
        '+': '.-.-.',
        '-': '-....-',
        '_': '..--.-',
        '"': '.-..-.',
        '$': '...-..-',
        '@': '.--.-.',
        ' ': '/'
    }
    text = text.upper()
    morse_code = ' '.join(morse_code_dict[char] for char in text if char in morse_code_dict)
    return morse_code


def generate_sine_wave(frequency, duration, sample_rate=44100,amplitude=0.5):
    """
    Generate sine wave
    """
    time= np.linspace(0,duration,int(duration*sample_rate),endpoint=False)
    return np.sin(2 * np.pi * frequency * time)
def generate_silence(duration, sample_rate):
    """
    Generate silence for a given duration.
    """
    return np.zeros(int(sample_rate * duration))

sample_rate = 44100  
dot_duration = 0.1  
dash_duration = dot_duration * 3
space_duration = dot_duration  # 1 unit
frequency = 400  
amplitude = 0.5  

# I am adding a 1 unit (0.1 sec) silence after every dot and dash
# So whenever a character ends I am appending 2 unit and 6 units when word ends

unit_space=generate_silence(space_duration,sample_rate)
dot = np.concatenate([generate_sine_wave(frequency, dot_duration, sample_rate, amplitude),unit_space])
dash = np.concatenate([generate_sine_wave(frequency, dash_duration, sample_rate, amplitude),unit_space])
character_space=generate_silence(space_duration*2,sample_rate)
word_space=generate_silence(space_duration*6,sample_rate)

sound_wave_dictionaries={
    ".":dot,
    "-":dash,
    " ":character_space,
    "/":word_space
        }

def getMorseSound(text:str):
    """
    Converts text into morse code sound signal normalized to 16-bit PCM(pulse code modulation) range

    Returns: numpy array of concatenated sound signal with sample rate 44100
    """
    morse_code=text_to_morse(text)
    sound=np.concatenate([sound_wave_dictionaries[symbol] for symbol in morse_code])
    return np.int16(sound/np.max(np.abs(sound))*(2**15 -1))

