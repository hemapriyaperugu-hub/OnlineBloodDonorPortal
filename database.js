const DB_NAME = "BloodConnectDatabase";
const DB_VERSION = 1;
const STORE_NAME = "donors";

let db = null;

/* DATABASE READY PROMISE */

let databaseReady = openDatabase();


/* OPEN DATABASE */

function openDatabase() {

    return new Promise((resolve, reject) => {

        const request =
            indexedDB.open(DB_NAME, DB_VERSION);


        request.onupgradeneeded = function (event) {

            db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAME)) {

                const store =
                    db.createObjectStore(STORE_NAME, {
                        keyPath: "id",
                        autoIncrement: true
                    });


                store.createIndex(
                    "bloodGroup",
                    "bloodGroup",
                    { unique: false }
                );


                store.createIndex(
                    "location",
                    "location",
                    { unique: false }
                );


                store.createIndex(
                    "availability",
                    "availability",
                    { unique: false }
                );

            }

        };


        request.onsuccess = function (event) {

            db = event.target.result;

            console.log(
                "BloodConnect database initialized."
            );

            resolve(db);

        };


        request.onerror = function (event) {

            console.error(
                "Database initialization failed:",
                event.target.error
            );

            reject(event.target.error);

        };

    });

}


/* ADD DONOR */

async function addDonor(donor) {

    await databaseReady;

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                [STORE_NAME],
                "readwrite"
            );


        const store =
            transaction.objectStore(STORE_NAME);


        const request =
            store.add(donor);


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function (event) {

            reject(event.target.error);

        };

    });

}


/* GET ALL DONORS */

async function getAllDonors() {

    await databaseReady;

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                [STORE_NAME],
                "readonly"
            );


        const store =
            transaction.objectStore(STORE_NAME);


        const request =
            store.getAll();


        request.onsuccess = function () {

            resolve(request.result);

        };


        request.onerror = function (event) {

            reject(event.target.error);

        };

    });

}


/* DELETE DONOR */

async function deleteDonor(id) {

    await databaseReady;

    return new Promise((resolve, reject) => {

        const transaction =
            db.transaction(
                [STORE_NAME],
                "readwrite"
            );


        const store =
            transaction.objectStore(STORE_NAME);


        const request =
            store.delete(id);


        request.onsuccess = function () {

            resolve();

        };


        request.onerror = function (event) {

            reject(event.target.error);

        };

    });

}