const QRCode = require('qrcode');

// Generate QR
const generateQr = (data) => {

    // Creating the data
    // let data = {
    //     type: "connection_request",
    //     metadata: "99375be8-2932-4597-881e-de8a5810e1b4"
    // }

    // Converting the data into String format
    let stringdata = JSON.stringify(data)

    // Print the QR code to terminal
    QRCode.toString(stringdata, { type: 'terminal', small: true },
        function (err, QRcode) {
            if (err) return console.log("error occurred")
            // Printing the generated code
            console.log(QRcode)
        })

}
// Generate QR

module.exports = {
    generateQr
};