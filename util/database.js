import * as SQLite from 'expo-sqlite';

import { Place } from '../models/place';

const database = SQLite.openDatabase('places.db', version = '1.0');

export function init() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            title TEXT NOT NULL,
            imageUri TEXT NOT NULL,
            address TEXT NOT NULL,
            ledinskoIme TEXT NOT NULL,
            date TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            zoomLevel REAL NOT NULL
        )`,
                [],
                () => {
                    resolve();
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function insertPlace(place) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                `INSERT INTO places (title, imageUri, address, ledinskoIme, date, lat, lng, zoomLevel) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    place.title,
                    place.imageUri,
                    place.address,
                    place.ledinskoIme,
                    place.date,
                    place.location.lat,
                    place.location.lng,
                    place.location.zoomLevel
                ],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchPlaces() {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places ORDER BY id DESC',
                [],
                (_, result) => {
                    const places = [];

                    for (const dp of result.rows._array) {
                        places.push(
                            new Place(
                                dp.title,
                                dp.imageUri,
                                {
                                    address: dp.address,
                                    ledinskoIme: dp.ledinskoIme,
                                    date: dp.date,
                                    lat: dp.lat,
                                    lng: dp.lng,
                                    zoomLevel: dp.zoomLevel
                                },
                                dp.id
                            )
                        );
                    }
                    resolve(places);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function fetchPlaceDetails(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'SELECT * FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    const dbPlace = result.rows._array[0];
                    const place = new Place(
                        dbPlace.title,
                        dbPlace.imageUri,
                        { lat: dbPlace.lat, lng: dbPlace.lng, ledinskoIme: dbPlace.ledinskoIme, date: dbPlace.date, address: dbPlace.address, zoomLevel: dbPlace.zoomLevel },
                        dbPlace.id
                    );
                    resolve(place);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}

export function deletePlace(id) {
    const promise = new Promise((resolve, reject) => {
        database.transaction((tx) => {
            tx.executeSql(
                'DELETE FROM places WHERE id = ?',
                [id],
                (_, result) => {
                    resolve(result);
                },
                (_, error) => {
                    reject(error);
                }
            );
        });
    });

    return promise;
}