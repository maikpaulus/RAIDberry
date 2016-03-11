let aEvent = require('./aEvent');
let fs = require('fs');
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
                fs.open(path, 'r', '0666', function (err, fd) {
                    if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) {
                        setTimeout(function () {
                            console.log('EMFILE oder ENFILE Fehler, versuche erneut...');
                            self.process(path);
                        }, 10000);
                        return;
                    }

                    fs.close(fd);

                    if (fs.existsSync(folder)) {
                        let readStream = fs.createReadStream(path);
                        let writeStream = fs.createWriteStream(secPath);

                        readStream.pipe(writeStream);
                    }
                });
            }
        }
        catch (e) {
            setTimeout(function () {
                console.log('Zugriffs-Fehler, versuche erneut...');
                self.process(path);
            }, 10000);
        }
    }
};
