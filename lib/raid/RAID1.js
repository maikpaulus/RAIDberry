let aRAID = require('./aRAID');
let fs = require('fs');

module.exports = class RAID1 extends aRAID {
    init (settings) {
        super.init(settings.name);

        if (settings.hasOwnProperty('disks')) {
            this.primary = settings.disks.primary || '';
            this.secondary = settings.disks.secondary || '';

            if (this.disksAreMounted()) {

            }
        }

        return false;
    }

    setPrimary (primary) {
        this.primary = primary;
    }

    setSecondary (secondary) {
        this.secondary = secondary;
    }

    swapDisks() {
        let temp = primary;
        this.primary = secondary;
        this.secondary = temp;
    }

    disksAreMounted () {
        console.log(this.primary);
        console.log(fs.existsSync(this.primary));
        console.log(fs.existsSync(this.secondary));
    }
};
