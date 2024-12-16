from functions import text_to_morse, getMorseSound, morse_to_text
from flask import Flask, request, jsonify, send_from_directory
from scipy.io.wavfile import write
from flask_cors import CORS
import os

app = Flask(__name__, static_folder=os.path.abspath("../static"))
CORS(app)

@app.route("/get_morse_data", methods=["GET"])
def getMorseData():
    text = request.args.get('text', '')
    morse_code = text_to_morse(text)
    audio = getMorseSound(morse_code)
    audio_path = os.path.join(app.static_folder, "morse_audio.wav")
    write(audio_path, 44100, audio)
    return jsonify({'morse_code': morse_code})

@app.route("/get_plain_text_from_morse", methods=["GET"])
def getPlainTextFromMorse():
    morse_code = request.args.get('morse_code', '')
    plain_text = morse_to_text(morse_code)
    audio = getMorseSound(morse_code)  
    audio_path = os.path.join(app.static_folder, "morse_audio.wav")
    write(audio_path, 44100, audio)
    return jsonify({'plain_text': plain_text})

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    app.run()
