class Place {
    constructor(title, imageUri, address, location) {
        this.title = title;
        this.imageUri = imageUri;
        this.address = address;
        this.location = location; // {46.2928918,13.9258419}
        this.id=new Date().toString()+Math.random().toString();
    }
}