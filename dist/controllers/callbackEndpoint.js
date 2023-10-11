"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callbackEndpoint = void 0;
// import fs from 'fs'
const crypto_1 = __importDefault(require("crypto"));
const callbackEndpoint = (req, res) => {
    // const privateKeyPem = fs.readFileSync('private_key.pem');
    // const publicKeyPem = fs.readFileSync('public_key.pem');
    // Load the private key
    const privateKey = crypto_1.default.createPrivateKey({
        key: process.env.PEM_PRIVATE_KEY,
        format: 'pem',
    });
    const publicKey = crypto_1.default.createPublicKey({
        key: process.env.PEM_PUBLIC_KEY,
        format: 'pem',
    });
    console.log({
        'req.body': req.body,
        req: req
    });
    // Received encrypted data in base64 format (replace this with your received data)
    const receivedEncryptedDataBase64 = req.body['data']; // Your base64 data here
    const receivedSignatureBase64 = req.body['signature'];
    // Decode the base64 data
    const receivedEncryptedData = Buffer.from(receivedEncryptedDataBase64, 'base64');
    const receivedSignature = Buffer.from(receivedSignatureBase64, 'base64');
    // Check signature
    try {
        const decryptedData = crypto_1.default.privateDecrypt({
            key: privateKey,
            padding: crypto_1.default.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        }, receivedEncryptedData);
        const decryptDataStr = decryptedData.toString('utf-8');
        const receivedData = JSON.parse(decryptDataStr);
        const isSignatureValid = crypto_1.default.verify('sha256', 
        // @ts-ignore
        decryptDataStr, {
            key: publicKey,
            padding: crypto_1.default.constants.RSA_PKCS1_PADDING,
        }, receivedSignature);
        console.log('Received data:', receivedData);
        if (isSignatureValid) {
            console.log('Signature is valid');
            res.json({
                receivedData
            });
        }
        else {
            console.error('Digital signature is not valid!');
            res.json({
                msg: 'error'
            });
        }
    }
    catch (error) {
        // The signature isn't correct
        console.error('Digital signature is not valid!', error);
        res.json({
            error: error
        });
    }
};
exports.callbackEndpoint = callbackEndpoint;
//# sourceMappingURL=callbackEndpoint.js.map