let chokidar = require('chokidar');

module.exports = class Watcher {
    constructor (directory) {
        this.watcher = chokidar(directory);
    }
}