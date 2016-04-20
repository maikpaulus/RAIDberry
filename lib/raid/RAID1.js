let aRAID = require('./aRAID');
let fs = require('fs');
let path = require('path');
let Watcher = require('../watcher/Watcher');
let EventParser = require('../watcher/events/EventParser');
let EventFactory = require('../watcher/events/EventFactory');

module.exports = class RAID1 extends aRAID {
    init(settings) {
        super.init(settings.name);

        if (settings.hasOwnProperty('disks')) {
            this.primary = settings.disks.primary.replace(/[\/]/g, path.sep) || '';
            this.secondary = settings.disks.secondary.replace(/[\/]/g, path.sep) || '';
            this.eventParser = EventParser.getInstance();
            return this.disksAreMounted;
        }

        return false;
    }

    setPrimary(primary) {
        this.primary = primary;
    }

    setSecondary(secondary) {
        this.secondary = secondary;
    }

    getPrimary() {
        return this.primary;
    }

    getSecondary() {
        return this.secondary;
    }

    swapDisks() {
        let temp = primary;
        this.primary = secondary;
        this.secondary = temp;
    }

    disksAreMounted() {
        let primaryExists = fs.existsSync(this.primary);
        let secondaryExists = fs.existsSync(this.secondary);

        if (!primaryExists || !secondaryExists) {
            return false;
        }

        return true;
    }

    registerEvents() {
        var self = this;

        this.watcher.on('add', (path, file) => {
            add(EventFactory.getEvent('addFile', 'AF', path, file))
        });

        this.watcher.on('change', (path, file) => {
            add(EventFactory.getEvent('changeFile', 'CF', path, file))
        });

        this.watcher.on('unlink', (path, file) => add(EventFactory.getEvent('removeFile', 'RF', path, file)));
        this.watcher.on('addDir', (path, file) => add(EventFactory.getEvent('addDirectory', 'AD', path, file)));
        this.watcher.on('unlinkDir', (path, file) => add(EventFactory.getEvent('removeDirectory', 'RD', path, file)));
        this.watcher.on('error', (error, file) => console.log);

        let add = (event)  => { self.eventParser.addEvent(event); }

        self.eventParser.addEvent('initial');
    }

    start() {
        this.watcher = require('chokidar').watch(this.primary, {
            usePolling: true,
            awaitWriteFinish: {
                stabilityThreshold: 2500,
                pollInterval: 100
            },
            ignoreInitial: true
        });
        this.registerEvents();
        super.start();
    }

    synchronize() {
        require('shelljs/global');
        cp('-R', this.primary + '/', this.secondary);
    }

    status(callback) {
        require('shelljs/global');
        exec('du -s ' + this.primary, function (code, stdout) {
            exec('du -s ' + this.secondary, function (cd, so) {
                callback(code, stdout + '<br>' + so);
            })
        });
    }
};
