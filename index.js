window.register = function () {
    var fetch = require("fetch");
    postRequest('http://localhost:8080/register/' + $('#registerForm').attr('party'), { firstName: $('#registerForm').attr('firstname'), lastName: $('#registerForm').attr('lastname') })
        .then(function (data) { return console.log(data); }) // Result from the `response.json()` call
    ["catch"](function (error) { return console.error(error); });
    function postRequest(url, data) {
        return fetch(url, {
            //  credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) { alert(response.json()); });
    }
};
window.getParties = function () {
    var fetch = require("fetch");
    fetch('http://localhost:8080/party/' + $('#getPartyDetails').attr('#party'))
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            alert(JSON.stringify(myJson));
        });
};

window.getGuests = function () {
    var fetch = require("fetch");
    fetch('http://localhost:8080/guests/' + $('#getGuests').attr('party'))
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            alert(JSON.stringify(myJson));
        });
};

window.registerParty = function () {
    var fetch = require("node-fetch");
    postRequest('http://localhost:8080/registerParty', { firstName: $('#newpartyForm').attr('firstname'), lastName: $('#newpartyForm').attr('lastname'), partyName: $('#newpartyForm').attr('party'), location: $('#newpartyForm').attr('location'), date: $('#newpartyForm').attr('date') })
        .then(function (data) { return console.log(data); }) // Result from the `response.json()` call
    ["catch"](function (error) { return console.error(error); });
    function postRequest(url, data) {
        return fetch(url, {
            //   credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        }).then(function (response) { alert(response.json()); });
    }
};