module.exports = class aRAID {
    static getInstance () {
        let self = this;
        if (undefined === self._instance) {
            self._instance = new self();
        }

        return self._instance;
    }

    init (name) {
        this.name = name;
    }

    start () {
        console.log('RAID ' + this.name + ' has started...');
    }

    stop () {
        console.log('RAID ' + this.name + ' has stopped...');
    }
    status () {}
}
