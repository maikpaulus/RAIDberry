let RAIDFactory = require('./raid/RAIDFactory');

module.exports = class RAIDController {
    constructor(config) {
        if (config.hasOwnProperty('type')) {
            let raid = RAIDFactory.getRAID(config.type);
            if (raid !== false) {
                if (config.hasOwnProperty('settings')) {
                    let initialized = raid.init(config.settings);
                    if (initialized === true) {
                        // start point
                        raid.start();
                        this.raid = raid;
                    }

                    // konnte nicht initialisiert werden
                }
                else {
                    // fehler settings nicht gefunden
                }
            }
        }
        else {
            // error no raid config found
        }

        return false;
    }

    getRAID() {
        return this.raid;
    }
};