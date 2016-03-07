let aEvent = require('./aEvent');
let fs = require('fs');
let npath = require('path');

module.exports = class AddDirectoryEvent extends aEvent {
    constructor (path) {
        super('AD', path);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();

        let secPath = path.replace(primary, secondary);
        let folder = secPath.substr(0, secPath.lastIndexOf(npath.sep));

        if (!fs.existsSync(secPath) && fs.existsSync(folder)) {
           fs.mkdirSync(secPath);
        }
    }
};
