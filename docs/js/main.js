/* =====================
Leaflet Configuration
===================== */

//golobel value
var dataset = "https://raw.githubusercontent.com/hzqianzhuang/MUSA_capstone/master/data/gz_2010_us_040_00_20m.json";
var groupByData = "https://raw.githubusercontent.com/hzqianzhuang/MUSA_capstone/master/data/df_total.json";
var pAndN = "https://raw.githubusercontent.com/hzqianzhuang/MUSA_capstone/master/data/pAndN.json";
var monthData = "https://raw.githubusercontent.com/hzqianzhuang/MUSA_capstone/master/data/month.json";
var featureGroup;
var testData = [25.8,25.7,18.4,30.1];
var testData_1 = [50,50];

var pAndN_State =  ['California', 'Carolina', 'Colorado', 'Columbia', 'Connecticut',
'Dakota', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Indiana',
'Iowa', 'Jersey', 'Kentucky', 'Louisiana', 'Maryland',
'Massachusetts', 'Mexico', 'Michigan', 'Minnesota', 'Missouri',
'Nevada', 'Ohio', 'Oklahoma', 'Oregon', 'Tennessee', 'Texas',
'Utah', 'Virginia', 'Washington', 'York'];
var name;

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
         d > 10  ? '#E31A1C' :
         d > 5   ? '#FD8D3C' :
         d >= 0  ? '#FED976' :
                   '#FFEDA0'
}

var eachFeatureFunction = function(layer) {
  layer.on('click', function (event) {
    /* =====================
    The following code will run every time a layer on the map is clicked.
    Check out layer.feature to see some useful data about the layer that
    you can use in your application.
    ===================== */
    var stateName = layer.feature.properties.NAME;
    for(var i = 0; i<pAndN_State.length; i++){
      if(pAndN_State[i].indexOf(stateName) != -1){
        name = pAndN_State[i];
      }
    }
    
    $.ajax(pAndN).done(function(data){
      var parsedData = JSON.parse(data);
      var pos = parsedData.positive[name];
      var neg = parsedData.negative[name];
      pos = Math.round(pos);
      neg = Math.round(neg);
      testData_1 = [pos,neg];
      console.log(stateName,name,pos,neg);

      Chart.defaults.global.legend.labels.usePointStyle = true;
      var ctx = $("#traffic-chart").get(0).getContext("2d");
  
      if ($("#traffic-chart_1").length) {
        var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 181);
  
        gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
        gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');
        var gradientLegendBlue = 'linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))';
  
        var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 50);
        gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
        gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');
        var gradientLegendRed = 'linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))';
  
        var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 300);
        gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
        gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');
        var gradientLegendGreen = 'linear-gradient(to right, rgba(6, 185, 157, 1), rgba(132, 217, 210, 1))';
        
        var gradientStrokeBlack = ctx.createLinearGradient(0, 0, 0, 300);
        gradientStrokeBlack.addColorStop(0, 'rgba(255, 255, 157, 1)');
        gradientStrokeBlack.addColorStop(1, 'rgba(255, 255, 210, 1)');
        var gradientLegendBlack = 'linear-gradient(to right, rgba(255, 255, 157, 1), rgba(255, 255, 210, 1))';
  
  
        var trafficChartData = {
          datasets: [{
            data: testData_1,
            backgroundColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed
            ],
            hoverBackgroundColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed
            ],
            borderColor: [
              gradientStrokeBlue,
              gradientStrokeGreen,
              gradientStrokeRed
            ],
            legendColor: [
              gradientLegendBlue,
              gradientLegendGreen,
              gradientLegendRed
            ]
          }],
  
          // These labels appear in the legend and in the tooltips when hovering different arcs
          labels: [
            'Positive',
            'Negative'
          ]
        };
        var trafficChartOptions = {
          responsive: true,
          animation: {
            animateScale: true,
            animateRotate: true
          },
          legend: false,
          legendCallback: function(chart) {
            var text = [];
            text.push('<ul>');
            for (var i = 0; i < trafficChartData.datasets[0].data.length; i++) {
                text.push('<li><span class="legend-dots" style="background:' +
                trafficChartData.datasets[0].legendColor[i] +
                            '"></span>');
                if (trafficChartData.labels[i]) {
                    text.push(trafficChartData.labels[i]);
                }
                text.push('<span class="float-right">'+trafficChartData.datasets[0].data[i]+"%"+'</span>')
                text.push('</li>');
            }
            text.push('</ul>');
            return text.join('');
          }
        };
        var trafficChartCanvas = $("#traffic-chart_1").get(0).getContext("2d");
        var trafficChart = new Chart(trafficChartCanvas, {
          type: 'doughnut',
          data: trafficChartData,
          options: trafficChartOptions
        });
        $("#traffic-chart-legend_1").html(trafficChart.generateLegend());
      }

      $.ajax(groupByData).done(function(data){
        var parsedData = JSON.parse(data);
        var architecure = parsedData.architecure[name];
        var food = parsedData.food[name];
        var travel = parsedData.travel[name];
        var art = parsedData.art[name];

        var sum = art+architecure+food+travel;

        architecure = Math.round(architecure/sum*100);
        art = Math.round(art/sum*100);
        food = Math.round(food/sum*100);
        travel = Math.round(travel/sum*100);

        testData = [architecure,art,food,travel];
        Chart.defaults.global.legend.labels.usePointStyle = true;
    var ctx = $("#traffic-chart").get(0).getContext("2d");

    if ($("#traffic-chart").length) {
      var gradientStrokeBlue = ctx.createLinearGradient(0, 0, 0, 181);
      gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
      gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');
      var gradientLegendBlue = 'linear-gradient(to right, rgba(54, 215, 232, 1), rgba(177, 148, 250, 1))';

      var gradientStrokeRed = ctx.createLinearGradient(0, 0, 0, 50);
      gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
      gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');
      var gradientLegendRed = 'linear-gradient(to right, rgba(255, 191, 150, 1), rgba(254, 112, 150, 1))';

      var gradientStrokeGreen = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
      gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');
      var gradientLegendGreen = 'linear-gradient(to right, rgba(6, 185, 157, 1), rgba(132, 217, 210, 1))';
      
      var gradientStrokeBlack = ctx.createLinearGradient(0, 0, 0, 300);
      gradientStrokeBlack.addColorStop(0, 'rgba(255, 255, 157, 1)');
      gradientStrokeBlack.addColorStop(1, 'rgba(255, 255, 210, 1)');
      var gradientLegendBlack = 'linear-gradient(to right, rgba(255, 255, 157, 1), rgba(255, 255, 210, 1))';

      var trafficChartData = {
        datasets: [{
          data: testData,
          backgroundColor: [
            gradientStrokeBlue,
            gradientStrokeGreen,
            gradientStrokeRed,
            gradientStrokeBlack
          ],
          hoverBackgroundColor: [
            gradientStrokeBlue,
            gradientStrokeGreen,
            gradientStrokeRed,
            gradientStrokeBlack
          ],
          borderColor: [
            gradientStrokeBlue,
            gradientStrokeGreen,
            gradientStrokeRed,
            gradientStrokeBlack
          ],
          legendColor: [
            gradientLegendBlue,
            gradientLegendGreen,
            gradientLegendRed,
            gradientLegendBlack
          ]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
          'Architecure',
          'Art&Culture',
          'Food&Drinks',
          'Travel'
        ]
      };
      var trafficChartOptions = {
        responsive: true,
        animation: {
          animateScale: true,
          animateRotate: true
        },
        legend: false,
        legendCallback: function(chart) {
          var text = [];
          text.push('<ul>');
          for (var i = 0; i < trafficChartData.datasets[0].data.length; i++) {
              text.push('<li><span class="legend-dots" style="background:' +
              trafficChartData.datasets[0].legendColor[i] +
                          '"></span>');
              if (trafficChartData.labels[i]) {
                  text.push(trafficChartData.labels[i]);
              }
              text.push('<span class="float-right">'+trafficChartData.datasets[0].data[i]+"%"+'</span>')
              text.push('</li>');
          }
          text.push('</ul>');
          return text.join('');
        }
      };
      var trafficChartCanvas = $("#traffic-chart").get(0).getContext("2d");
      var trafficChart = new Chart(trafficChartCanvas, {
        type: 'doughnut',
        data: trafficChartData,
        options: trafficChartOptions
      });
      $("#traffic-chart-legend").html(trafficChart.generateLegend());
    }
      });
    });
    $("#myModal").appendTo("body").modal('show');

    console.log(stateName);
  });
};


var myStyle = function(feature) {
  // console.log(feature.properties.COLLDAY);
  if(getIndex(feature)==-1){
    return {
      fillColor: 'gray',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }else {
    return {
      fillColor: getColor(Object.values(dic_sentiment)[getIndex(feature)]),
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
    div.innerHTML += '<i style="background:' + 'gray' + '"></i> need data '+'<br>';

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
      //filter: myFilter,
      onEachFeature: onEachFeature
    }).addTo(map);

    // quite similar to _.each
    featureGroup.eachLayer(eachFeatureFunction);
  });

  $.ajax(monthData).done(function(data){
    var parsedData = JSON.parse(data);
    var testDataMonth = [
      parsedData.Sentiment_value.Jan,
      parsedData.Sentiment_value.Feb,
      parsedData.Sentiment_value.Mar,
      parsedData.Sentiment_value.Apr,
      parsedData.Sentiment_value.May,
      parsedData.Sentiment_value.Jun,
      parsedData.Sentiment_value.Jul,
      parsedData.Sentiment_value.Aug,
      parsedData.Sentiment_value.Sep,
      parsedData.Sentiment_value.Oct,
      parsedData.Sentiment_value.Nov,
      parsedData.Sentiment_value.Dec];

      new Chart(document.getElementById("line_chart"),{
        type:"line",
        data:{labels:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
        datasets:[{label:"Sentiment Value",data:testDataMonth,fill:false,"borderColor":"rgb(75, 192, 192)","lineTension":0.1}]},
        options:{}});

  });


});


