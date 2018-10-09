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

function getFacts() {
    return db.collection('facts')
        .get()
        .then(snapshot => {
            const facts = [];
            snapshot.forEach(fact => {
                facts.push(fact.data());
            });
            return facts;
        });
}

const server = express();
server.engine('hbs', engines.handlebars);
server.set('views', './views');
server.set('view engine', 'hbs');

server.get('/', (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getFacts()
        .then(facts => {
            response.render('index', { facts });
        })
        .catch(reason => console.error(reason));
});

server.get('/facts.json', async (request, response) => {
    response.set('Cache-Control', 'public, max-age=300, s-maxage=600');
    getFacts()
        .then(facts => {
            response.json(facts);
        })
        .catch(reason => console.error(reason));
});

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

export const app = functions.https.onRequest(server);
