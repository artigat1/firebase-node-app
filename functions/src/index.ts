import * as functions from 'firebase-functions';
import * as firebase from 'firebase-admin';
import * as express from 'express';
import * as engines from 'consolidate';

const firebaseApp = firebase.initializeApp(
    functions.config().firebase
);

// Initialize Cloud Firestore through Firebase
const db = firebaseApp.firestore();

// Disable deprecated features
db.settings({
    timestampsInSnapshots: true
});

async function setFacts() {
    await db.collection('facts').add({
        text: 'The sun is hot'
    });
    console.log('added fact 1');
    await db.collection('facts').add({
        text: 'Fish can swim'
    });
    console.log('added fact 2');
    await db.collection('facts').add({
        text: 'Birds can fly'
    });
    console.log('added fact 3');
    await db.collection('facts').add({
        text: 'Xmas is in December'
    });
    console.log('added fact 4');
}

function getFacts() {
    const ref = firebaseApp.database().ref('facts');
    return ref.once('value').then(snap => snap.val());
}

const server = express();
server.engine('hbs', engines.handlebars);
server.set('views', './views');
server.set('view engine', 'hbs');

server.get('/', async (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    const facts = await getFacts();
    response.render('index', { facts });
});

server.get('/facts.json', async (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    const facts = ['the sun is hot', 'fish can swim', 'birds can fly'];
    response.json(facts);
});

server.get('/init', async (request, response) => {
    await setFacts();
    return response.status(200).send({});
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const app = functions.https.onRequest(server);
