const express = require('express');
const app = express();

app.use(express.static('maven'));

app.listen(3000, () => console.log("Maven server listening on port 3000!"));

