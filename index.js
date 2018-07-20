const express = require('express');
const auth = require('http-auth');
const rawBody = require('raw-body');
const fs = require('fs');

const app = express();
const basic = auth.basic({
    realm: "Credentials required for access to MavenServer",
    file: __dirname + "/.htpasswd"
});

const FILE_ROOT = "maven";

app.use(auth.connect(basic));
app.put('*', function(req,res,next) {
    rawBody(req, {}, function (err, data) {
        if (err) return next(err);
        console.log("We have it!");
        console.log(req.originalUrl);
        const components = req.originalUrl.split('/');
        if (components.length > 2) {
            let path = FILE_ROOT;
            for (let i = 1; i < components.length - 1; i++) {
                path += "/" + components[i];
                if (!fs.existsSync(path)) {
                    fs.mkdirSync(path);
                } else {
                    const stats = fs.statSync(path);
                    if (!stats.isDirectory()) {
                        res.status(400).send(path + " is not a directory");
                        return;
                    }
                }
            }
        }
        if (components[components.length - 1].length == 0) {
            res.status(400).send("Cannot upload to empty fileName");
            return;
        }
        fs.writeFileSync(FILE_ROOT + req.originalUrl, data);
        res.status(201).send('Nice!');
    });
});

app.use(express.static('maven'));

app.listen(3000, () => console.log("Maven server listening on port 3000!"));
