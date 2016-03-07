let EventFactory = require(__base + '/lib/watcher/events/EventFactory');
let RAIDFactory = require(__base + '/lib/raid/RAIDFactory');
let config = require(__base + '/config/config');
let fs = require('fs');
let npath = require('path');

module.exports = class EventParser {
    static getInstance() {
        let self = this;
        if (undefined === self._instance) {
            self._instance = new self();
            self.locked = false;
        }

        return self._instance;
    }

    addEvent(event) {
        let self = this;

        if (null !== event) {
            if (undefined === self.db) {
                let CouchDB = require(__base + '/lib/db/CouchDB');
                self.db = new CouchDB();
            }
            else {
                let document = event.getData();
                self.db.putDocument(document);
            }
        }

        setTimeout(function () {
            if (self.locked) {
                return;
            }

            self.locked = true;

            console.log('get next process...');
            if (undefined !== self.db) {
                self.db.processNextEventGroup();
            }
        }, 1000);
    }

    process (operations, events) {
        let self = this;
        let rename = null;

        if (operations.match(/^(RD){1,}(RF){1,}$/)) {
            events = events.reverse();
        }

        switch (operations) {
            // just rename files
            case 'AFRF':
                rename = EventFactory.getEvent('rename');
                if (rename) {
                    rename.process(events[1].value.path, events[0].value.path)
                }
                break;

            // just rename folders
            case 'RDAD':
                rename = EventFactory.getEvent('rename');
                if (rename) {
                    rename.process(events[0].value.path, events[1].value.path)
                }
                break;

            default:
                events.forEach(function (event) {
                    let e = EventFactory.getEventByShortcut(event.value.type);
                    if (e) {
                        e.process(event.value.path);
                    }
                });
                break;
        }
    }

    free(restart) {
        this.locked = false;
        if (restart) {
            this.addEvent(null);
        }
    }
};