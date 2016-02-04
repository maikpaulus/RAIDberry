module.exports = class RAIDFactory {
    static getRAID(type) {
        try {
            let RAID = require('./RAID' + type);
            return new RAID();
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
};
