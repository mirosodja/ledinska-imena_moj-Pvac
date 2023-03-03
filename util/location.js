import { MAP_BOX_TOKEN } from '../mapbox/key.js';

export function getMapPreview(lat, lng) {
    const imagePreviewUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+ff0000(${lng},${lat})/${lng},${lat},14,0/400x200?access_token=${MAP_BOX_TOKEN}`;
    return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAP_BOX_TOKEN}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch address!');
    }
    const data = await response.json();

    // if (!data) {
    //     throw new Error('Something went wrong, no data!');
    // }
    // const address = data.features[0].place_name;
    const address = "F3XV+CC Feistritz im Rosental, Austrija";
    return address;
}
