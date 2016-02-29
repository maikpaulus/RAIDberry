let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class RemoveFileEvent extends aEvent {
    constructor (path, file) {
        super('RF', path, file);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();
        let secPath = path.replace(primary, secondary);

        if (fs.existsSync(secPath)) {
            fs.unlinkSync(secPath);
        }
    }
};
