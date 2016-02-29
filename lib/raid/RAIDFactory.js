module.exports = class RAIDFactory {
    static getRAID(type) {
        try {
            let RAID = require(__base + '/lib/raid/RAID' + type);
            return RAID.getInstance();
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
};
