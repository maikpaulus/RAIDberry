module.exports = class EventFactory {
    static getEvent(type, shortcut, path, file) {
        if (undefined === this.events) {
            this.events = {};
        }

        type = type[0].toUpperCase() + type.substr(1);

        try {
            if (!this.events.hasOwnProperty(shortcut)) {
                this.events[shortcut] = type;
            }

            let Event = require('./' + type + 'Event');
            return new Event(path, file);
        }
        catch (e) {
            console.log(e, 'event was not found');
            return null;
        }
    }

    static getEventByShortcut (shortcut) {
        if (this.events.hasOwnProperty(shortcut)) {
            let Event = require('./' + this.events[shortcut] + 'Event');
            return new Event();
        }

        return false;
    }
};
