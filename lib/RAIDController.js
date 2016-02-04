let RAIDFactory = require('./raid/RAIDFactory');

module.exports = class RAIDController {
    constructor(config) {
        if (config.hasOwnProperty('type')) {
            let raid = RAIDFactory.getRAID(config.type);
            if (raid !== false) {
                if (config.hasOwnProperty('settings')) {
                    console.log(raid);
                    let initialized = raid.init(config.settings);
                    if (initialized === true) {
                        console.log('saasdas');
                        // start point
                        raid.start();
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
};