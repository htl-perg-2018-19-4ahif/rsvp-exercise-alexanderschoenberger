import * as express from 'express';
import * as basicAuth from 'express-basic-auth';
import * as cors from 'cors';
import * as loki from 'lokijs';

const db = new loki(__dirname + '/db.dat', { autosave: true, autoload: true });

let parties = db.getCollection('parties');
if (parties === null) {
    parties = db.addCollection('parties');
}
const MAX_NUMBER = 10;
const auth = basicAuth({ users: { admin: 'P@ssw0rd!' } });
let server = express();
server.use(express.json());
server.use(cors());
server.options('*', cors());

server.post('/registerParty', (request, response) => {
    let firstname: string = request.body.firstName;
    let lastname: string = request.body.lastName;
    let date: string = request.body.date;
    let location: string = request.body.location;
    let partyname: string = request.body.partyName;
    if (firstname == null || lastname == null || date == null || location == null || partyname == null) {
        response.status(400);
        response.send('{Bad Request}');
    } else {
        let party: Party = new Party(new Person(firstname, lastname), partyname, date, location);
        parties.insert(party);
        response.send(`{Thank you ${firstname} ${lastname} for registering a new party}`);
    }
});


server.post('/register/:word', (request, response) => {
    let firstname: string = request.body.firstName;
    let lastname: string = request.body.lastName;
    let partyname: string = request.params.word;
    if (firstname == null || lastname == null || partyname == null) {
        response.status(400);
        response.send('{Bad Request}');
    } else {
        let p: Person = new Person(firstname, lastname);
        let party: Party = parties.data.find((element) => {
            return element.partyname === partyname;
        });
        if (party.guests.length < MAX_NUMBER) {
            party.guests.push(p);
            response.send(`{Thank you ${firstname} ${lastname} for registering at ${partyname}s party}`);
        } else {
            response.status(400);
            response.send('{Unauthorized error}');
        }
    }
});
server.get('/party/:word', (request, response) => {
    let partyname: string = request.params.word;
    let party: Party = parties.data.find((element) => {
        return element.partyname === partyname;
    });
    if (party === undefined) {
        response.status(400);
        response.send('{Bad Request}');
    } else {
        response.send(`{partyname: ${party.partyname},\n date: ${party.date},\n location:${party.location},\n organisator:\n{firstname: ${party.organisator.firstName},lastname: ${party.organisator.lastName}}}`);
    }
});
server.get('/guests/:word', auth, (request, response) => {
    let partyname: string = request.params.word;
    let party: Party = parties.data.find((element) => {
        return element.partyname === partyname;
    });
    if (party === undefined) {
        response.status(400);
        response.send('{Bad Request}');
    } else {
        response.send(party.guests);
    }
});

const port = 8080;
server.listen(port, function () {
    console.log(`API is listening on port ${port}`);
});

class Person {
    firstName: string;
    lastName: string;
    constructor(_firstName: string, _lastName: string) {
        this.firstName = _firstName;
        this.lastName = _lastName;
    }
}

class Party {
    partyname: string;
    date: string;
    location: string;
    organisator: Person;
    guests: Person[];
    constructor(_organisator: Person, _partyname: string, _date: string, _location) {
        this.organisator = _organisator;
        this.partyname = _partyname;
        this.date = _date;
        this.location = _location;
        this.guests = [];
    }
}