import numpy as np
from scipy.io.wavfile import write

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

def text_to_morse(text):
    text = text.upper()
    morse_code = ' '.join(morse_code_dict[char] for char in text if char in morse_code_dict)
    return morse_code

def generate_sine_wave(frequency, duration, sample_rate=44100, amplitude=0.5):
    time = np.linspace(0, duration, int(duration * sample_rate), endpoint=False)
    return np.sin(2 * np.pi * frequency * time)

def generate_silence(duration, sample_rate):
    return np.zeros(int(sample_rate * duration))

sample_rate = 44100  
dot_duration = 0.1  
dash_duration = dot_duration * 3
space_duration = dot_duration
frequency = 400  
amplitude = 0.5  
# I am adding a 1 unit (0.1 sec) silence after every dot and dash
# So whenever a character ends I am appending 2 unit and 6 units when word ends
unit_space = generate_silence(space_duration, sample_rate)
dot = np.concatenate([generate_sine_wave(frequency, dot_duration, sample_rate, amplitude), unit_space])
dash = np.concatenate([generate_sine_wave(frequency, dash_duration, sample_rate, amplitude), unit_space])
character_space = generate_silence(space_duration * 2, sample_rate)
word_space = generate_silence(space_duration * 6, sample_rate)

sound_wave_dictionaries = {
    ".": dot,
    "-": dash,
    " ": character_space,
    "/": word_space
}

def getMorseSound(morse_code: str):
    sound = np.concatenate([sound_wave_dictionaries[symbol] for symbol in morse_code])
    return np.int16(sound / np.max(np.abs(sound)) * (2 ** 15 - 1))

def morse_to_text(morse_code):
    reverse_morse_code_dict = {v: k.lower() for k, v in morse_code_dict.items()}
    morse_code = morse_code.strip().split(' ')
    plain_text = ''.join(reverse_morse_code_dict.get(code, '') for code in morse_code)
    return plain_text
