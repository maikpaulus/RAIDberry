let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class ChangeFileEvent extends aEvent {
    constructor (path) {
        super('CF', path);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();
        let secPath = path.replace(primary, secondary);

        if (fs.existsSync(secPath)) {
            fs.unlinkSync(secPath);
            fs.createReadStream(path).pipe(fs.createWriteStream(secPath));
        }
    }
};
