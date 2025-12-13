const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

console.log('Starting application...');

// Serve static files
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/kiyo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'kiyo.html'));
});

app.get('/womy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'womy.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```__
