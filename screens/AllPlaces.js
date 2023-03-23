// This code imports the necessary React hooks, and the PlacesList component from the components folder
import { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import PlacesList from "../components/Places/PlacesList";
import { fetchPlaces } from "../util/database";

// This function is a functional React component that renders the PlacesList component with the loadedPlaces array
function AllPlaces({ route }) {
    const [loadedPlaces, setLoadedPlaces] = useState([]);
    const isFocused = useIsFocused();

    // This useEffect hook is used to check if the screen is focused and if the route has a params property with a place
    useEffect(() => {
        // This async function fetches the places from the database
        async function loadPlaces() {
            const places = await fetchPlaces();
            setLoadedPlaces(places);
        }

        if (isFocused ) {
            loadPlaces();
            // setLoadedPlaces((curPlaces) => [...curPlaces, route.params.place]);
        }

    }, [isFocused]);

    // This returns the PlacesList component with the loadedPlaces array as the places property
    return (<PlacesList places={loadedPlaces} />);
}

export default AllPlaces;
