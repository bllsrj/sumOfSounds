//Manages the conversion of uploaded files to LaTeX
//PDF --> PNG --> LaTeX
const request = require('request');
const PDF2Pic = require("pdf2pic");
const base64image = require('base64-image-encoder');

// To convert PDF to PNG
// PDF file must be in initialDir directory
// Images of all pages written to ./png-outputs/ directory
async function convertPDF(initialDir, pageNo){

    try{
        const pdf2pic = await new PDF2Pic({
            density: 110,           // output pixels per inch
            savename: "output",   // output file name
            savedir: "./png-outputs/",    // output file location
            format: "png",          // output file format
            size: "900x1280"         // output size in pixels
        });

        await pdf2pic.convertBulk(initialDir, [pageNo]).then((resolve) => {
            console.log("image converted successfully!");
            return resolve;
        });
    } catch(error){
        return false;
    }
}

async function convertToBase64(initialDir) {
    return "data:image/jpeg;base64," + await base64image(initialDir);
}

//Do whatever with the MathPix output in the callbackUp function
async function convertImage(base64, callbackUp){

    const options = {
        url: 'https://api.mathpix.com/v3/text',
        json: true,
        headers: {
            "content-type": "application/json",
            "app_id": "appID",
            "app_key": "appKey"
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
