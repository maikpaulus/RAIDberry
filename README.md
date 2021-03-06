# RAIDberry
a Node.js RAID project (build on a Raspberry Pi)

### Why doing this?
If you want to buy a NAS system, you have to pay at least € 400 for a good and comfortable system. But if you don't want to spend so much money
you must be creative and combine an existing Raspberry Pi with two new cheap HDD's. Ok, it is not that fast and comfortable than an all-in-one system, 
but it will fit for my purposes and it was a lot of fun developing it.

I searched for a cheap system which is not focussed on performance (if you do you're wrong here!). After finishing the project I got exactly what I pursued. I spent half the money compared to a professional all-in-one system. It is not really fast working with it the whole day but to access once a day some files it is sufficient.

### Why Node.js?
Maybe a few of you would ask this question. Of course you can install a RAID system on a Raspberry Pi without Node.js, but I love Node.js and it was a pleasure for me doing this.

### How it works
Beside Node.js you will need a CouchDB database to store drive changes. The script will recognize every change on the primary drive and write it to the database.
After a short interval these entries will be read out of the database and executed on the secondary drive. These operations can be:
- file or directory creation 
- file or directory deletion
- file or directory modification

The CouchDB database will clean itself after the operations finish. Next thing you need are two drives which are mounted on the operating system. That's all you need.

### Dependencies
- Node.js (and several npm modules)
- CouchDB (relaxing mode ;-) )

**Notice**
There will be a short documentation soon so you can easily install this project on your Pi.

