const express = require("express");
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const textManager = require('./TextManager');
const converter = require('./Converter');
const soundManager = require('./SoundManager');

const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

const directory = 'files';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, directory)
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname )
    }
});

const upload = multer({ storage: storage }).single('file');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('./mp3-outputs'));

app.listen(port, () => console.log(`Listening on port ${port}`));

fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
        fs.unlink(path.join(directory, file), err => {
            if (err) throw err;
        });
    }
});

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

app.get('/download', (req, res) => {
    const file = "./mp3-outputs/output.mp3";
    res.download(file);
});

app.post('/api/generate', async function(req, res) {

    const inputType = req.body.inputType;
    let inputString = req.body.inputString;
    const pageNo = req.body.pageNo;
    const fileName = req.body.fileName;
    const audioSpeed = req.body.audioSpeed;
    const speaker = req.body.speaker;
    const gender = req.body.gender;
    let base64;

    console.log(req);
    
    if(inputType === "application/pdf") {
        await converter.convertPDF(path.join(directory, fileName), pageNo);

        while (base64 === undefined || base64.length < 100) {
            base64 = await converter.convertToBase64( "./../../png-outputs/output_" + pageNo + ".png");
        }

    } else if(inputType === "tex") {
        await fs.readFile(path.join(directory, fileName), 'utf8', async function (err,data) {
            if (err) {
                return console.log(err);
            }
            inputString = data;

            await generate(inputString, speaker, gender, audioSpeed, res);
        });

    } else if(inputType === "image/jpg" || inputType === "image/png") {
        console.log("image");
        base64 = await converter.convertToBase64( "./../../" + directory + "/" + fileName);
    }

    console.log("base64", base64);

    if(inputType !== "text" && inputType !== "tex") {

        await converter.convertImage(base64, function (body) {
            console.log(body);
            inputString = body.text;

            generate(inputString, speaker, gender, audioSpeed, res)

        });

    }

    if(inputType === "text") {
        await generate(inputString, speaker, gender, audioSpeed, res)
    }
});


async function generate(inputString, speaker, gender, audioSpeed, res) {
    await res.set('Content-Type', 'application/json');

    if(inputString === undefined || inputString === null) {
        res.json({
            status: "Error", text: null
        });
        return;
    }

    const plainText = await textManager.txtConvert(inputString);
    console.log(inputString);
    console.log(plainText);

    const audioInput = {
        "plainText": plainText,
        "languageCode": 'en-US',
        "name": speaker,
        "ssmlGender" : gender,
        "speakingRate" : audioSpeed
    };

    await soundManager.generateMP3(audioInput);

    console.log("here");

    await res.json({
        status: "Good",
        text: plainText
    })

}