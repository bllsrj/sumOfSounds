//Manages the conversion of uploaded files to LaTeX
//PDF --> PNG --> LaTeX
const request = require('request');
const PDF2Pic = require("pdf2pic");
const base64image = require('base64-image-encoder');

// To convert PDF to PNG
// PDF file must be in initialDir directory
// Images of all pages written to ./png-outputs/ directory
function convertPDF(initialDir, pageNo){
    const pdf2pic = new PDF2Pic({
        density: 100,           // output pixels per inch
        savename: "output.png",   // output file name
        savedir: "./png-outputs/",    // output file location
        format: "png",          // output file format
        size: "600x600"         // output size in pixels
    });

    try{
        pdf2pic.convertBulk(initialDir, [pageNo]).then((resolve) => {
            console.log("image converter successfully!");
            return resolve;
        });
    } catch(error){
        console.log("failed");
    }
}

async function convertToBase64(initialDir) {
    return "data:image/jpeg;base64," + await base64image(initialDir);
}
//Do whatever with the MathPix output in the callbackUp function
function convertImage(base64, callbackUp){

    const options = {
        url: 'https://api.mathpix.com/v3/text',
        json: true,
        headers: {
            "content-type": "application/json",
            "app_id": "apiID",
            "app_key": "appKey
        },
        body: {
            "src": base64,
            "formats": ["text"],
            "data_options": {
                "include_latex": true
            }
        }
    };

    request.post(options, function callback(error, response, body) {
        if(error){
            console.log("MathPix failed");
        }
        callbackUp(body);
    });
}

module.exports.convertPDF = convertPDF;
module.exports.convertImage = convertImage;
module.exports.convertToBase64 = convertToBase64;
