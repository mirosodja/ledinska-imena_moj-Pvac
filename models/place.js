export class Place {
    constructor(title, imageUri, location, id) {
        this.title = title;
        this.imageUri = imageUri;
        this.address = location.address;
        this.location = {
            lat: location.lat,
            lng: location.lng
        }; // {46.2928918,13.9258419}
        this.id = id;
    }
}