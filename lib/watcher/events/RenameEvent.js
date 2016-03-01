let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class RenameEvent extends aEvent {
    constructor (path, file) {
        super('RNF', path, file);
    }

    process (oldPath, newPath) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();

        oldPath = oldPath.replace(primary, secondary);
        newPath = newPath.replace(primary, secondary);

        if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
            fs.renameSync(oldPath, newPath);
        }
    }
};
