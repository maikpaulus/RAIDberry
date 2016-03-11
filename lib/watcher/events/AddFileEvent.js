let aEvent = require('./aEvent');
let fs = require('graceful-fs');
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
                let src = fs.readFileSync(path, 'r');

                if (fs.existsSync(folder)) {
                    let readStream = fs.createReadStream(path);
                    let writeStream = fs.createWriteStream(secPath);

                    readStream.pipe(writeStream);

                    readStream.on('end', function () {
                        fs.closeSync(src);
                    })
                }
            }
        }
        catch (e) {
            setTimeout(function () {
                self.process(path);
            }, 10000);
        }
    }
};
