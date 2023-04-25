import { MAP_BOX_TOKEN } from '../mapbox/key.js';

export function getMapPreview(lat, lng) {
    const imagePreviewUrl= `https://api.mapbox.com/styles/v1/miro-sodja/clfwhbge3009401mztl3f09x4/static/pin-s+000(${lng},${lat})/${lng},${lat},14,0/400x200?access_token=${MAP_BOX_TOKEN}`
    return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAP_BOX_TOKEN}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Napaka pri iskanju naslova!');
    }
    const data = await response.json();

    if (!data) {
        throw new Error('Nekaj je šlo narobe, ni podatkov!');
    }
    const address = data.features[0].place_name;
    return address;
}
