let config = require(__base + '/config/config');
let RAIDFactory = require(__base + '/lib/raid/RAIDFactory');

module.exports = class aEvent {
    constructor(type, path, file) {
        this.type = type || undefined;
        this.path = path || undefined;
        this.file = file || undefined;

        if (this.type && this.path) {
            this.createdAt = new Date();
        }

        this.raid = RAIDFactory.getRAID(config.type);
    }

    process (path) {
        console.log(path);
    };

    message () {
        if (this.file !== undefined) {
            console.log(this.file);
        }
    }

    getData () {
        return {
            type: this.type,
            path: this.path,
            createdAt: this.createdAt.getTime()
        };
    }
};
