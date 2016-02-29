let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class AddDirectoryEvent extends aEvent {
    constructor (path) {
        super('AD', path);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();
        let secPath = path.replace(primary, secondary);

        if (!fs.existsSync(secPath)) {
           fs.mkdirSync(secPath);
        }
    }
};
