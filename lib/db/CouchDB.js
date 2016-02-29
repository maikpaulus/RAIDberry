let http = require('http');
let RP = require('request-promise');
let events = require('events');
let EventParser = require(__base + '/lib/watcher/events/EventParser');

module.exports = class CouchDB {

    constructor() {
        this._init();
    }

    _init() {
        let self = this;

        self.config = require(__base + '/config/couchdb');
        self.auth = {
            user: self.config.user,
            pass: self.config.password
        };

        self.base = 'http://' + self.config.host + ':' + self.config.port + '/' + self.config.database;
    }

    putDocument(document) {
        let self = this;

        let options = {
            uri: self.base,
            auth: self.auth,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document)
        };

        RP(options)
            .then(data => console.log)
            .catch(error => console.log);
    }

    _deleteDocument (document) {
        let self = this;

        let options = {
            uri: self.base + '/' + document._id + '?rev=' + document._rev,
            auth: self.auth,
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        RP(options)
            .then(data => { self.eventEmitter.emit('deleted'); })
            .catch(error => console.log);
    }

    processNextEventGroup() {
        let self = this;

        let options = {
            uri: self.base + '/_all_docs',
            auth: self.auth
        };

        RP(options)
            .then( (response) => {
                return JSON.parse(response).rows[1].id;
            })
            .catch(function (error) {
                console.log('Es wurde kein weiterer Eintrag gefunden.');
                EventParser.getInstance().free(false);
            })
            .then(self._getEventById.bind(self), console.log)
    }

    _getEventById (id) {
        let self = this;

        if (undefined === id) {
            return;
        }

        let options = {
            uri: self.base + '/' + id,
            auth: self.auth
        };

        RP(options)
            .then(function (response) {
                return JSON.parse(response).createdAt;
            }, console.log)
            .then(self._getEventGroup.bind(self), console.log);
    }

    _getEventGroup (time) {
        let self = this;
        self.eventEmitter = new events.EventEmitter();
        self.eventGroups = [];

        let options = {
            auth: self.auth,
            uri: self.base + '/_design/view/_view/all?startkey=' + time + '&endkey=' + (time + 500)
        };

        RP(options)
        .then(function (response) {
            return response;
        }, console.log)

        .then(function (data) {
            self.eventGroups = JSON.parse(data).rows;
            self.eventEmitter.emit('eventgroup loaded');
        }, console.log);

        // process event data
        self.eventEmitter.on('eventgroup loaded', function () {
            let operations = '';
            self.eventGroups.forEach(function (event) {
                operations += event.value.type;
            });

            EventParser.getInstance().process(operations, self.eventGroups);

            self.eventGroups.forEach(function (event) {
               self._deleteDocument(event.value);
            });
        });

        self.eventEmitter.on('deleted', function () {
            self.eventGroups.pop();
            if (0 === self.eventGroups.length) {
                EventParser.getInstance().free(true);
            }
        });
    }
};