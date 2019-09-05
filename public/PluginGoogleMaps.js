function plugin_google_maps(){
  var self = this;
  var data = null;
  var map = 'ddd';
  this.bounds = null;
  this.getMap = function(){return map;}
  this.load = function(data){
    /**
     * If no center data.
     */
    if(!data.data.center.geocode && !data.data.center.lat){
      data.data.center.geocode = 'Sweden';
    }
    /**
     * 
     */
    if(data.data.center.geocode){
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': data.data.center.geocode}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          data.data.latlng = results[0].geometry.location;
          self.set(data);
          return 333;
        }else{
          //console.log(status)
        }
      });
      return 222;
    }else if(data.data.center.lat && data.data.center.lng){
      data.data.latlng = new google.maps.LatLng(data.data.center.lat, data.data.center.lng);
      return this.set(data);
    }
  }
  /**
   * Set map.
   * @param {type} data
   * @returns {undefined}
   */
  this.set = function(data){
    self.data = data;
    eval("var map_type = google.maps.MapTypeId."+data.data.mapTypeId.toUpperCase())+";";
    var mapProp = {
        center: data.data.latlng,
        zoom: parseInt(data.data.zoom),
        scrollwheel: data.data.scrollwheel,
        draggable: data.data.draggable,
        mapTypeId: map_type
      };
    map = new google.maps.Map(document.getElementById(data.id), mapProp);
    if(data.onchange){
      /**
       * https://developers.google.com/maps/documentation/javascript/events
       */
      map.addListener('center_changed',    function(){data.onchange('center_changed', map);});
      map.addListener('maptypeid_changed', function(){data.onchange('center_changed', map);});
      map.addListener('zoom_changed',      function(){data.onchange('center_changed', map);});
    }
    /**
     * Bounds start.
     */
    self.bounds = new google.maps.LatLngBounds();
    /**
     * Markers
     */
    this.setMarkers(data, map);
    /**
     * Bounds end.
     */
    if(data.data.marker.length && data.data.LatLngBounds){
      //map.fitBounds(self.bounds);       // auto-zoom
      map.zoom = parseInt(data.data.zoom);
      map.panToBounds(self.bounds);     // auto-center    
    }
    /**
     * 
     */
    this.setPath(data, map);
    self.map = map;
  }
  this.setMarkers = function(data, map){
    if(data && data.data && data.data.marker){
      for(var i=0; i < data.data.marker.length; i++){
        this.setMarker(data.data.marker[i], map);
      }
    }
  }
  this.loadMarker = function(){
  }
  this.setMarker = function(marker_data, map){
    if(marker_data.position.geocode){
      if(!marker_data.title){
        marker_data.title = marker_data.position.geocode;
      }
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode( { 'address': marker_data.position.geocode}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          marker_data.latlng = results[0].geometry.location;
          self.setMarkerAfterLatLng(marker_data, map);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
      });
    }else{
      marker_data.latlng = new google.maps.LatLng(marker_data.position.lat, marker_data.position.lng);
      this.setMarkerAfterLatLng(marker_data, map);
      self.bounds.extend(marker_data.latlng);
    }
  }
  this.setMarkerAfterLatLng = function(marker_data, map){
    var marker = new google.maps.Marker({
      position: marker_data.latlng,
      title: marker_data.title,
      draggable: marker_data.draggable,
      label: marker_data.label
    });
    if(marker_data.icon){
      /**
       * http://maps.google.com/mapfiles/ms/icons/green-dot.png
       */
      marker.setIcon(marker_data.icon);
    }
    marker.setMap(map);
    // Popup
    if(marker_data.window && marker_data.window.content){
      eval("var infowindow = new google.maps.InfoWindow({ content: marker_data.window.content });");
      eval("marker.addListener('click', function() { infowindow.open(map, this); });");
      if(marker_data.window.show){
        eval("infowindow.open(map, marker);");
      }
    }
  }
  this.setPath = function(data, map){
    if(data.data.gpx){
      for(var i=0; i<data.data.gpx.length; i++){
        this.setGpx(data.data.gpx[i].url, map);
      }
    }
  }
  this.setGpx = function(file, map){
    $.ajax({
           type: "GET",
           url: file,
           dataType: "xml",
           success: function (xml) {
                var points = [];
                var bounds = new google.maps.LatLngBounds();
                $(xml).find("trkpt").each(function () {
                     var lat = $(this).attr("lat");
                     var lon = $(this).attr("lon");
                     var p = new google.maps.LatLng(lat, lon);
                     points.push(p);
                     bounds.extend(p);
                });
                var poly = new google.maps.Polyline({
                     // use your own style here
                     path: points,
                     strokeColor: "#FF00AA",
                     strokeOpacity: .7,
                     strokeWeight: 2
                });
                poly.setMap(map);
                // fit bounds to track
                map.fitBounds(bounds);
           }
      });      
  }
}
var PluginGoogleMaps = new plugin_google_maps();
