//Gets speech audio of plain text from Google Text-to-Speech API
// Imports the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
// Import other required libraries
const fs = require('fs');
const util = require('util');

/*
input is JSON, must contain the following:
    "plainText": *String to be read goes here*,
    "languageCode": *,
    "name": *name of voice*, 
    "ssmlGender" : *gender of voice*,
    "speakingRate" : *speed of reading between 0.25 and 4*

output.mp3 is written to ./mp3-outputs directory
*/
async function generateMP3(input){
    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
      input: {text: input.plainText},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: input.languageCode, name: input.name, ssmlGender: input.ssmlGender},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3', speakingRate: input.speakingRate}
    };

    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
    // Write the binary audio content to a local file
    const writeFile = util.promisify(fs.writeFile);
    await writeFile('./mp3-outputs/output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: output.mp3');
    // return response.audioContent;
}

module.exports.generateMP3 = generateMP3;