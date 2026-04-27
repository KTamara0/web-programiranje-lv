const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;
 
// Posluživanje statičkih datoteka iz mape 'public'
app.use(express.static('public'));
 
app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
 