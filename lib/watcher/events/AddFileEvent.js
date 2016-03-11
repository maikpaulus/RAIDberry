let aEvent = require('./aEvent');
let fs = require('fs-extra');
let npath = require('path');

module.exports = class AddFile extends aEvent {
    constructor(path, file) {
        super('AF', path, file);
    }

    process(path) {
        let self = this;
        let secondary = this.raid.getSecondary();
        let primary = this.raid.getPrimary();

        let secPath = path.replace(primary, secondary);
        let folder = secPath.substr(0, secPath.lastIndexOf(npath.sep));

        try {
            if (fs.existsSync(path) && !fs.existsSync(secPath)) {
                let src = fs.openSync(path, 'r');

                if (fs.existsSync(folder)) {
                    try {
                        fs.copySync(path, secPath);
                    } catch (err) {
                        setTimeout(function () {
                            console.log('Zugriffs-Fehler, versuche erneut...', err.message);
                            self.process(path);
                        }, 10000);
                    }

                    fs.closeSync(src);
                }
            }
        }
        catch (e) {
            setTimeout(function () {
                console.log('Zugriffs-Fehler, versuche erneut...' + err.message);
                self.process(path);
            }, 10000);
        }
    }
};
