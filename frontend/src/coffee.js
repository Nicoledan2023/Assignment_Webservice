import mapboxgl from "mapbox-gl";
import axios from "axios";

async function searchPlaces(longitude, latitude) {
  const accessToken = process.env.REACT_APP_MAPBOX;

  const radius = 50000;

  //const coffeePlacesUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/coffee.json?proximity=-75.6972,45.4215&access_token=${accessToken}&limit=600`;
  const coffeePlacesUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/coffee.json?proximity=${longitude},${latitude}&radius=${radius}&access_token=${accessToken}&limit=30`;

  const coffeePlacesResponse = await axios.get(coffeePlacesUrl);

  const coffeePlaces = coffeePlacesResponse.data.features;

  const result = coffeePlaces.map((place) => ({
    id: place.id,
    longitude: place.center[0],
    latitude: place.center[1],
    text: place.text,
    place_name: place.place_name,
  }));

  return result;
}

export default searchPlaces;
