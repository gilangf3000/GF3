const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000; // Port yang digunakan oleh aplikasi



// Membaca data dari file JSON
const rawData = fs.readFileSync('model.json');
const data = JSON.parse(rawData);

function approximateSimilarity(str1, str2) {
    // Implementasikan logika perbandingan kesamaan di sini
    // Anda dapat menggunakan algoritma atau metode yang sesuai
    // dengan kebutuhan Anda.
    // Contoh sederhana:
    const max_length = Math.max(str1.length, str2.length);
    let matching_characters = 0;

    for (let i = 0; i < max_length; i++) {
        if (str1[i] === str2[i]) {
            matching_characters++;
        }
    }

    const similarity = (matching_characters / max_length) * 100;
    return similarity;
}

app.get('/', (req, res) => {
  // Kirimkan file HTML sebagai respons
  res.sendFile('index.html', { root: __dirname });
});

app.get('/chat', (req, res) => {
    const userInput = req.query.q;
    const inputText = userInput.toLowerCase();
    let exactMatch = null; // Jawaban yang tepat jika ditemukan
    let bestResponse = "Maaf, saya tidak mengerti pertanyaan Anda.";
    let bestSimilarity = 0;

    for (const item of data.data) {
        for (const question of item.question) {
            const similarity = approximateSimilarity(question.toLowerCase(), inputText);
            if (similarity > 15) {
                if (similarity > bestSimilarity) {
                    bestSimilarity = similarity;
                    bestResponse = item.answers[Math.floor(Math.random() * item.answers.length)];

                    // Cek apakah kata dalam pertanyaan ada di jawaban
                    const questionWords = inputText.split(' ');
                    const answerWords = bestResponse.toLowerCase().split(' ');
                    if (questionWords.some(word => answerWords.includes(word))) {
                        exactMatch = bestResponse;
                    }
                }
            }
        }
    }

    // Jika ada jawaban yang tepat, kirimkan itu, jika tidak, kirimkan yang mirip
    
        res.json({ response: bestResponse, accuracy: `${bestSimilarity.toFixed(7)}` });
   
});

app.listen(port, () => {
    console.log(`Aplikasi chatbot berjalan di http://localhost:${port}`);
});
