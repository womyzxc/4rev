const express = require('express');
const path = require('path');
const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/kiyo.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'kiyo.html'));
});
app.get('/womy.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'womy.html'));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```__
