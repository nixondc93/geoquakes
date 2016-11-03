// define globals

$(document).on("ready", function() {

 var weekly_quakes_endpoint = "http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
 var map;
 var quakeArr = [];
  function getQuakes(){
    $.ajax({
      method: 'GET',
      url: weekly_quakes_endpoint,
      dataType: 'JSON',
      success: onSuccess
    });
  }

  function time(milisecs){
    var currentdate = Date.now();
    if((currentdate - milisecs)/(60 * 60 * 1000) <= 1.5){
      return Math.round((currentdate - milisecs)/(60 * 60 * 1000)) +' minutes ago.'
    }else if ((currentdate - milisecs)/(60 * 60 * 1000) <= 72) {
      return Math.round((currentdate - milisecs)/(60 * 60 * 1000)) + ' hours ago'
    }else {
      return Math.round((currentdate - milisecs)/(60 * 60 * 1000 * 24)) + ' days ago'
    }
  }


  function getPlaceTimeMag(features) {
    for(var i = 0; i < features.length; i++){
      quakeArr.push({locationTime: 'Location: ' + features[i].properties.title.replace(/.*- /,'').replace(/.*of /,'') + '.  Time: ' + time(features[i].properties.time), mag: 'mag-' + Math.round(features[i].properties.mag)});
      // console.log(quakeArr[0]);
    }

    return quakeArr;
  }

  function onSuccess(json){
    var features = json.features;
    var source = $('#quake-li-template').html();
    var template = Handlebars.compile(source);
    getPlaceTimeMag(features);
    var quakesHtml = template({quakes: quakeArr})
    $('#quake-list').append(quakesHtml);
    initMap();
    dropPins(features);
  }

  function dropPins(features){
    for (var i = 0; i < features.length; i++) {
          var coords = features[i].geometry.coordinates;
          var latLng = new google.maps.LatLng(coords[1], coords[0]);
          var marker = new google.maps.Marker({
            position: latLng,
            map: map
          });
    }
  }



  function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 37.78, lng: -122.44},
      zoom: 2
    });
  }

  getQuakes();

});
