// Add console.log to check to see if our code is working.
console.log("working");
// Create the map object with a center and zoom level.
 // // We create the tile layer that will be the background of our map.
// let streets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/dark-v10/tiles/{z}/{x}/{y}?access_token={accessToken}'

let streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: API_KEY
});
// We create the dark view tile layer that will be an option for our map.
let satelliteStreets = L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/tiles/{z}/{x}/{y}?access_token={accessToken}', {
attribution: 'Map data © <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  accessToken: API_KEY
});

// Create the earthquake layer for our map.
let techplates = new L.layerGroup();

// Create the earthquake layer for our map.
let earthquakes = new L.layerGroup();

// We define an object that contains the overlays.
// This overlay will be visible all the time.
let overlays = {
  Earthquakes: earthquakes,
  TechtonicPlates: techplates
};

// Create a base layer that holds both maps.
let baseMaps = {
Street: streets,
Satellite: satelliteStreets
};






// Create the map object with a center and zoom level.
let map = L.map("mapid", {
center: [
  39.5, -98.5
],
zoom: 3,
layers: [streets]
});



// Retrieve the earthquake GeoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {

    // We turn each feature into a circleMarker on the map.
    
    pointToLayer: function(feature, latlng) {
                console.log(data);
                return L.circleMarker(latlng);
            },
            style: styleInfo,
            onEachFeature: function(feature, layer) {
              layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
            }
        }).addTo(earthquakes);
        

        earthquakes.addTo(map);

        let legend = L.control({position: 'bottomright'});
        legend.onAdd = () => {
          var div = L.DomUtil.create("div", "info legend"), colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
          ], 
          magnitudes = [0, 1, 2, 3, 4, 5];
          
          // Looping through our intervals to generate a label with a colored square for each interval.
          for (var i = 0; i < magnitudes.length; i++) {
            console.log(colors[i]);
            div.innerHTML +=
              '<i style="background:' + colors[i] + '"></i> ' +
              magnitudes[i] + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
          }
          return div;
        };
        legend.addTo(map);

function styleInfo (feature) {
  return {
    opacity: 1,
    fillOpacity: 1,
    fillColor: getColor(feature.properties.mag),
    color: "#000000",
    radius: getRadius(feature.properties.mag),
    stroke: true,
    weight: 0.5
  };
}
function getColor(magnitude) {
  if (magnitude > 5) {
    return "#ea2c2c";
  }
  if (magnitude > 4) {
    return "#ea822c";
  }
  if (magnitude > 3) {
    return "#ee9c00";
  }
  if (magnitude > 2) {
    return "#eecc00";
  }
  if (magnitude > 1) {
    return "#d4ee00";
  }
  return "#98ee00";
}
function getRadius(magnitude) {
  if (magnitude === 0) {
    return 1;
  }
  return magnitude * 4;
}

});


d3.json("https://github.com/fraxen/tectonicplates/blob/master/GeoJSON/PB2002_plates.json").then(function(data) {
  // Creating a GeoJSON layer with the retrieved data.
  L.geoJSON(data, {

    // We turn each feature into a circleMarker on the map.
    
    pointToLayer: function(feature, latlng) {
                console.log(data);
                return L.polygon(latlng);
            },
            style: styleInfo,
            onEachFeature: function(feature, layer) {
              layer.bindPopup("PlateName: " + feature.properties.PlateName );
            }
        }).addTo(techplates);
        

        techplates.addTo(map);
        function styleInfo (feature) {
          return {
            opacity: 1,
            fillOpacity: 1,
            color: 'red',
            weight: 0.5
          };}
      });
// Then we add our 'graymap' tile layer to the map.
// Pass our map layers into our layers control and add the layers control to the map.
L.control.layers(baseMaps, overlays).addTo(map);