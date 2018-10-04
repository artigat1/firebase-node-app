import * as functions from 'firebase-functions';
import * as express from 'express';

const server = express();

server.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});

server.get('/timestamp-cached', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    response.send(`${Date.now()}`);
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const app = functions.https.onRequest(server);
