const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const textManager = require('./TextManager');
const converter = require('./Converter');
const soundManager = require('./SoundManager');

const app = express();
const port = process.env.PORT || 5000;

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, "auth", "annular-fold-278320-e281b445a905.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

if (process.env.NODE_ENV === 'production') {
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));
    // Handle React routing, return all requests to React app
    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}

app.listen(port, () => console.log(`listening on port ${port}`));

const directory = 'files';

if (!fs.existsSync(path.join(__dirname, directory,) )){
    fs.mkdirSync(path.join(__dirname, directory,));
}

fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
        });
    }
});

app.post('/output', function(req, res) {
    console.log(req.body.file);
    res.sendFile( path.join(__dirname, 'mp3-outputs', 'output.mp3'));
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directory)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname )
    }
});

const upload = multer({ storage: storage }).single('file');

app.post('/upload', async function(req, res) {

    await upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        return res.status(200).send(req.file)
    })

});

app.post('/api/generate', async function(req, res) {

    try {
        const inputType = req.body.inputType;
        let inputString = req.body.inputString;
        const pageNo = req.body.pageNo;
        const fileName = req.body.fileName;
        const audioSpeed = req.body.audioSpeed;
        const speaker = req.body.speaker;
        const gender = req.body.gender;
        let base64;

        if(inputType === "application/pdf") {
            const results = await converter.convertPDF(path.join(__dirname, directory, fileName), pageNo);
            console.log(results);

            if(results === false) {
                await res.json({
                    msg: "Error", text: null, msgText: "The application could not convert pdf. Try it again."
                });
                return;
            }

            const img_path = path.join(__dirname, "png-outputs/output_" + pageNo + ".png");
            console.log(img_path);

            do {

                if (fs.existsSync(img_path)) {
                    base64 = await converter.convertToBase64(img_path);
                }
            } while (base64 === undefined || base64.length < 100);


        } else if(inputType === "tex") {
            await fs.readFile(path.join(directory, fileName), 'utf8', async function (err,data) {
                if (err) {
                    return console.log(err);
                }
                inputString = data;

                await generate(inputString, speaker, gender, audioSpeed, res);
            });

        } else if(inputType === "image/jpg" || inputType === "image/png" || inputType === "image/jpeg") {
            base64 = await converter.convertToBase64( "./../../" + directory + "/" + fileName);
        }
        
        if(inputType !== "text" && inputType !== "tex") {

            await converter.convertImage(base64, function (body) {
                console.log(body);

                if(body.error !== undefined && body.error !== null) {
                    return res.json({
                        msg: "Error",
                        msgText: "Image: " + body.error
                    })
                }

                inputString = body.text;

                generate(inputString, speaker, gender, audioSpeed, res);
            });
        }

        if(inputType === "text") {
            await generate(inputString, speaker, gender, audioSpeed, res)
        }

    } catch (error) {
        return res.json({
            msg: "Error",
            msgText: "Unexpected error while generating!"
        })
    }
});

async function generate(inputString, speaker, gender, audioSpeed, res) {
    await res.set('Content-Type', 'application/json');

    if(inputString === undefined || inputString === null) {
        await res.json({
            msg: "Error", text: null, msgText: "The application could not read the file. Try it again."
        });
        return;
    }

    let statusText = "The audio file is successfully generated.";
    let plainText = await textManager.txtConvert(inputString);
    console.log(inputString);
    console.log(plainText);

    if(plainText.length > 4999) {
        plainText = plainText.substring(0, 4999);
        statusText = "The audio file is successfully generated. \nThe input document was large, so only first 5000 characters were voiced";
    }

    const audioInput = {
        "plainText": plainText,
        "languageCode": speaker.substring(0,5),
        "name": speaker,
        "ssmlGender" : gender,
        "speakingRate" : audioSpeed
    };

    console.log(audioInput);

    await soundManager.generateMP3(audioInput);

    await res.json({
        msg: "Good",
        text: plainText,
        msgText: statusText
    })
}