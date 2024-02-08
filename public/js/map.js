mapboxgl.accessToken = mapToken;
// TO MAKE THE MAP APPEAR YOU MUST
// ADD YOUR ACCESS TOKEN FROM
// https://account.mapbox.com
mapboxgl.accessToken = mapToken;
console.log(mapToken);
const map = new mapboxgl.Map({
  container: "map",
  // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
  style: "mapbox://styles/mapbox/streets-v12",
  center: coordinates,
  zoom: 8,
});


const marker = new mapboxgl.Marker({color: "red" })
  .setLngLat([coordinates])
  .addTo(map);
