module.exports = class aRAID {
    init (name) {
        this.name = name;
    }

    start () {
        return (typeof this) + " was started."
    }
    stop () {}
    status () {}
}
