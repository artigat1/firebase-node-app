"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const express = require("express");
const engines = require("consolidate");
const firebaseApp = firebase.initializeApp(functions.config().firebase);
// Initialize Cloud Firestore through Firebase
const db = firebaseApp.firestore();
// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});
function setFacts() {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.collection('facts').add({
            text: 'The sun is hot'
        });
        console.log('added fact 1');
        yield db.collection('facts').add({
            text: 'Fish can swim'
        });
        console.log('added fact 2');
        yield db.collection('facts').add({
            text: 'Birds can fly'
        });
        console.log('added fact 3');
        yield db.collection('facts').add({
            text: 'Xmas is in December'
        });
        console.log('added fact 4');
    });
}
function getFacts() {
    const ref = firebaseApp.database().ref('facts');
    return ref.once('value').then(snap => snap.val());
}
const server = express();
server.engine('hbs', engines.handlebars);
server.set('views', './views');
server.set('view engine', 'hbs');
server.get('/', (request, response) => __awaiter(this, void 0, void 0, function* () {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    const facts = yield getFacts();
    response.render('index', { facts });
}));
server.get('/facts.json', (request, response) => __awaiter(this, void 0, void 0, function* () {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    const facts = ['the sun is hot', 'fish can swim', 'birds can fly'];
    response.json(facts);
}));
server.get('/init', (request, response) => __awaiter(this, void 0, void 0, function* () {
    yield setFacts();
    return response.status(200).send({});
}));
// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript
exports.app = functions.https.onRequest(server);
//# sourceMappingURL=index.js.map