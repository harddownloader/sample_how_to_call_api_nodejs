// import fs from 'fs'
import crypto from 'crypto';
import { Request, Response } from "express";


export const callbackEndpoint = (req: Request, res: Response) => {
    // const privateKeyPem = fs.readFileSync('private_key.pem');
    // const publicKeyPem = fs.readFileSync('public_key.pem');

    // Load the private key
    const privateKey = crypto.createPrivateKey({
        key: process.env.PEM_PRIVATE_KEY, // or privateKeyPem
        format: 'pem',
    });

    const publicKey = crypto.createPublicKey({
        key: process.env.PEM_PUBLIC_KEY, // or publicKeyPem
        format: 'pem',
    });

    // Received encrypted data in base64 format (replace this with your received data)
    const receivedEncryptedDataBase64 = req.body['data']; // Your base64 data here
    const receivedSignatureBase64 = req.body['signature'];

    // Decode the base64 data
    const receivedEncryptedData = Buffer.from(receivedEncryptedDataBase64, 'base64');
    const receivedSignature = Buffer.from(receivedSignatureBase64, 'base64');

    // Check signature
    try {
        const decryptedData = crypto.privateDecrypt(
            {
                key: privateKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            receivedEncryptedData
        );

        const decryptDataStr = decryptedData.toString('utf-8')
        const receivedData = JSON.parse(decryptDataStr);
        


        const isSignatureValid = crypto.verify(
            'sha256',
            // @ts-ignore
            decryptDataStr,
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PADDING,
            },
            receivedSignature
        );

        console.log('Received data:', receivedData);

        if (isSignatureValid) {
            console.log('Signature is valid');
            res.json({
                receivedData
            });
        } else {
            console.error('Digital signature is not valid!');
            res.json({
                msg: 'error'
            });
        }
    } catch (error) {
        // The signature isn't correct
        console.error('Digital signature is not valid!', error);
        res.json({
            error: error
        })
    }
}
