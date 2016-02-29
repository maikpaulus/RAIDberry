let aEvent = require('./aEvent');
let fs = require('fs');

module.exports = class AddFile extends aEvent {
    constructor (path, file) {
        super('AF', path, file);
    }

    process (path) {
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();
        let secPath = path.replace(primary, secondary);

        if (!fs.existsSync(secPath) && fs.existsSync(path)) {
            fs.createReadStream(path).pipe(fs.createWriteStream(secPath));
        }
    }
};
