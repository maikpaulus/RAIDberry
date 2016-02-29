let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class RemoveDirectoryEvent extends aEvent {
    constructor (path) {
        super('RD', path);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();
        let secPath = path.replace(primary, secondary);

        if (fs.existsSync(secPath)) {
            fs.rmdirSync(secPath);
        }
    }
};
