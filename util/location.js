//TODO: move mapbox token to .env file
import { MAP_BOX_TOKEN } from '../mapbox/key.js';

export function getMapPreview(lat, lng, zoomLevel = 14) {

    const imagePreviewUrl = `https://api.mapbox.com/styles/v1/miro-sodja/clfwhbge3009401mztl3f09x4/static/pin-s+000(${lng},${lat})/${lng},${lat},${zoomLevel},0/400x200?access_token=${MAP_BOX_TOKEN}`;

    return imagePreviewUrl;
}

export async function getAddress(lat, lng) {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAP_BOX_TOKEN}`;
    // send http request and wait for response. If success return address, otherwise return error
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

export async function getLedinskoIme(lat, lng) {
    const featureTypes = ['point', 'line'];
    let minDistance = Infinity;
    let nearestFeature = null;

    for (let featureType of featureTypes) {
        const url = `https://api.mapbox.com/v4/miro-sodja.ledinska-imena-${featureType}-tiles/tilequery/${lng},${lat}.json?radius=300&limit=1&dedupe&access_token=${MAP_BOX_TOKEN}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Napaka pri iskanju naslova!');
        }
        const data = await response.json();

        if (data.features.length > 0) {
            const feature = data.features[0];
            const distance = feature.properties.tilequery.distance;

            if (distance < minDistance) {
                minDistance = distance;
                nearestFeature = feature;
            }
        }
    }

    if (nearestFeature) {
        return nearestFeature.properties.name_dialect;
    } else {
        return 'Pvác nima ledinskega imena';
    }
}
