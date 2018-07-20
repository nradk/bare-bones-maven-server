const express = require('express');
const auth = require('http-auth');

const app = express();
const basic = auth.basic({
    realm: "Credentials required for access to MavenServer",
    file: __dirname + "/.htpasswd"
});

app.use(auth.connect(basic));
app.use(express.static('maven'));

app.listen(3000, () => console.log("Maven server listening on port 3000!"));
