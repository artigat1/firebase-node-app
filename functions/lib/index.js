"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express = require("express");
const server = express();
server.get('/timestamp', (request, response) => {
    response.send(`${Date.now()}`);
});
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.app = functions.https.onRequest(server);
//# sourceMappingURL=index.js.map