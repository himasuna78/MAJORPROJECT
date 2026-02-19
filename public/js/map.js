window.onload = async function () {
  const mapDiv = document.getElementById("map");

  if (!mapDiv) return;

  const location = mapDiv.dataset.location;

  if (!location) {
    alert("Location not found!");
    return;
  }

  console.log("Searching coordinates for:", location);

  // ✅ OpenStreetMap Free Geocoding API
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`,
  );

  const data = await response.json();

  if (data.length === 0) {
    alert("Coordinates not found for location!");
    return;
  }

  const lat = data[0].lat;
  const lng = data[0].lon;

  console.log("Coordinates:", lat, lng);

  // ✅ Create Map
  const map = L.map("map").setView([lat, lng], 10);

  // ✅ Add Tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors",
  }).addTo(map);

  // ✅ Red Marker Icon
  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  // ✅ Marker with popup on click
  L.marker([lat, lng], { icon: redIcon })
    .addTo(map)
    .bindPopup(`<b>${location}</b>`);
};
