/* =====================
Leaflet Configuration
===================== */

//golobel value
var dataset = "https://raw.githubusercontent.com/hzqianzhuang/MUSA_capstone/master/gz_2010_us_040_00_20m.json";
var featureGroup;

var dic_sentiment = 
{'California': 6.62739898989899,
 'Carolina': 98.62524651274649,
 'Colorado': 72.06548340548339,
 'Columbia': 74.20584920634923,
 'Connecticut': 0.8,
 'Dakota': 4.3125,
 'Delaware': 0.790873015873016,
 'Florida': 28.958814376760806,
 'Georgia': 38.067894119769115,
 'Hawaii': 47.00781355218859,
 'Indiana': 11.676896043771047,
 'Iowa': 1.890873015873016,
 'Jersey': 0.46666666666666673,
 'Kentucky': 1.537070707070707,
 'Louisiana': 1.340832130832131,
 'Maryland': 3.4752314814814813,
 'Massachusetts': 2.3916666666666666,
 'Mexico': 41.91092652717653,
 'Michigan': 0.2,
 'Minnesota': 4.089152236652237,
 'Missouri': 0.875,
 'Nevada': 0.5,
 'Ohio': 2.8303571428571432,
 'Oklahoma': 4.936706349206349,
 'Oregon': 0.37777777777777777,
 'Tennessee': 75.49594065656564,
 'Texas': 92.27022005771997,
 'Utah': 17.283982683982686,
 'Virginia': 23.338710317460315,
 'Washington': 1.1497065897065895,
 'York': 12.991314935064937};


var mapboxAccessToken = 'pk.eyJ1IjoiaHpxaWFuemh1YW5nIiwiYSI6ImNrOTNlNW10eTAxYmszcnFtNW81cmowMnMifQ.ifGeFS5cD7B5sz90hsWdQA';
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);


var getIndex = function(feature){
  for(var i = 0; i<Object.keys(dic_sentiment).length; i++){
    if(feature.properties.NAME.indexOf(Object.keys(dic_sentiment)[i]) != -1){
      console.log(i);
      return i;
    }
  }
  return -1;
}

// function getColor(d) {
//   return d > 1000 ? '#800026' :
//          d > 500  ? '#BD0026' :
//          d > 80  ? '#E31A1C' :
//          d > 50  ? '#FC4E2A' :
//          d > 30   ? '#FD8D3C' :
//          d > 10   ? '#FEB24C' :
//          d > 5   ? '#FED976' :
//                     '#FFEDA0';
// }

function getColor(d) {
  return d > 80  ? '#800026' :
         d > 50  ? '#BD0026' :
         d > 10   ? '#FC4E2A' :
         d > 5   ? '#FEB24C' :
                    '#FFEDA0';
}

var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    console.log(layer.feature.properties.NAME);
  });
};


var myStyle = function(feature) {
  // console.log(feature.properties.COLLDAY);
  if(Object.values(dic_sentiment)[getIndex(feature)]<=5){
    return {
      fillColor: '#FFEDA0',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }else if(Object.values(dic_sentiment)[getIndex(feature)]<=10){
    return {
      fillColor: '#FEB24C',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }else if(Object.values(dic_sentiment)[getIndex(feature)]<=50){
    return {
      fillColor: '#FC4E2A',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }else if(Object.values(dic_sentiment)[getIndex(feature)]<=80){
    return {
      fillColor: '#BD0026',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }else{
    return {
      fillColor: '#800026',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }
};

var myFilter = function(feature) {
  if(getIndex(feature) == -1){
    return false;
  }else{
    return true;
  }
};

function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }

  info.update(layer.feature);
}

function resetHighlight(e) {
  featureGroup.resetStyle(e.target);
  info.update();
}

function zoomToFeature(e) {
  map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}


// set legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 5, 10, 50, 80],
        labels = [];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);

// add information box
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (feature) {
    this._div.innerHTML = '<h4>Sentiment Index</h4>' +  (feature ?
        '<b>' + Object.values(dic_sentiment)[getIndex(feature)]+ '</b><br />' 
        : 'Hover over a state');
};

info.addTo(map);

// load when document ready
$(document).ready(function() {
  $.ajax(dataset).done(function(data) {
    var parsedData = JSON.parse(data);
    // console.log(parsedData);
    featureGroup = L.geoJson(parsedData, {
      style: myStyle,
      filter: myFilter,
      onEachFeature: onEachFeature
    }).addTo(map);

    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });
});



