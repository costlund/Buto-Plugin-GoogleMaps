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
  /**
   * Show modal map for a hidden input.
   * @type plugin_wf_form_v2
   */
  this.showMap = function(id){
    /**
     * Default data.
     */
    var map_data = {lat: '61.9', lng: '18.6', map_type_id: 'hybrid', zoom: '4'};
    /**
     * Replace default data with input data.
     */
    if(document.getElementById(id).value.length > 0){
      var input_data = JSON.parse(document.getElementById(id).value);
      for (var key in input_data) {
        map_data[key] = input_data[key];
      }
    }
    /**
     * Create modal.
     */
    PluginWfBootstrapjs.modal({id: 'modal_map', url: null, lable: 'Map', size: 'lg', fade: false});
    document.getElementById('modal_map_footer').style.display = '';
    document.getElementById('modal_map_body').style.height = '400px';
    /**
     * Create map.
     */
    var map = PluginGoogleMaps.load({
      'onchange': function(type, map){
        var c = map.getCenter();
        document.getElementById('cords').innerHTML = c.lat()+' '+c.lng()+' '+map.getMapTypeId()+' '+map.getZoom();
        marker.setPosition(PluginGoogleMaps.getMap().getCenter());
      }, 
      'id':'modal_map_body',
      'style':'height:300px;width:100%;',
      'class':'',
      'data':{
        'center':{'geocodezzz':'Halmstad', 'lat': map_data.lat, 'lng': map_data.lng}, 
        'zoom': map_data.zoom, 
        'scrollwheel':true,
        'draggable':true, 
        'mapTypeId': map_data.map_type_id, 
        'marker':[{'position':{'geocode':'', 'lat': '20', 'lng': '20'},'draggable':true}]
      }
    });
    /**
     * Search box.
     * https://developers.google.com/maps/documentation/javascript/examples/places-searchbox
     */
    var input = document.createElement('input');
    input.id = 'pac-input';
    input.className = 'controls';
    input.type = 'text';
    input.placeholder = 'Search';
    input.style.margin = '8px';
    input.style.padding = '4px';
    //input.style.display = 'none';
    document.getElementById('modal_map_footer').appendChild(input);
    var searchBox = new google.maps.places.SearchBox(input);
    PluginGoogleMaps.getMap().controls[google.maps.ControlPosition.TOP_RIGHT].push(input);
    var markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();
      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }
        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };
        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      PluginGoogleMaps.getMap().fitBounds(bounds);
    });    
    
    /**
     * Create span.
     */
    var span = document.createElement('span');
    span.id = 'cords';
    span.style.float = 'left';
    span.style.fontSize = 'smaller';
    span.style.display='none';
    document.getElementById('modal_map_footer').appendChild(span);
    /**
     * BUTTON current position button.
     */
    var btn = document.createElement('a');
    btn.innerHTML = 'Set my location';
    btn.href = '#!';
    btn.className = 'btn';
    btn.onclick = function(){
      navigator.geolocation.getCurrentPosition(function(location){
        PluginGoogleMaps.getMap().setCenter(new google.maps.LatLng(location.coords.latitude, location.coords.longitude));
        PluginGoogleMaps.getMap().setZoom(15);
      }, function(){alert('Could not get current position!');});
    }
    document.getElementById('modal_map_footer').appendChild(btn);
    /**
     * Create clear button.
     */
    var btn = document.createElement('button');
    btn.innerHTML = 'Clear';
    btn.className = 'btn btn-secondary';
    btn.onclick = function(){
      var c = PluginGoogleMaps.getMap().getCenter();
      document.getElementById(id).value = '';
      $('#modal_map').modal('hide');
      document.getElementById('span_map_icon_'+id).innerHTML = '(no position)';
    }
    document.getElementById('modal_map_footer').appendChild(btn);
    /**
     * Create OK button.
     */
    var btn = document.createElement('button');
    btn.innerHTML = 'Ok';
    btn.className = 'btn btn-primary';
    btn.onclick = function(){
      var c = PluginGoogleMaps.getMap().getCenter();
      document.getElementById(id).value = '{"lat": "'+c.lat()+'", "lng": "'+c.lng()+'", "map_type_id": "'+PluginGoogleMaps.getMap().getMapTypeId()+'", "zoom": "'+PluginGoogleMaps.getMap().getZoom()+'"}';
      $('#modal_map').modal('hide');
      document.getElementById('span_map_icon_'+id).innerHTML = '(has position)';
    }
    document.getElementById('modal_map_footer').appendChild(btn);
    /**
     * Set marker.
     */
    var marker = new google.maps.Marker({
          position: PluginGoogleMaps.getMap().getCenter(),
          map: PluginGoogleMaps.getMap(),
          title: 'Hello World!'
        });
  }
  this.doInputToMapLink = function(id){
    /**
     * form-control
     */
    var div = document.createElement('div');
    div.className = 'form-control';
    document.getElementById(id).parentNode.appendChild(div);
    /**
     * btn
     */
    var btn = document.createElement('button');
    btn.innerHTML = 'Show map';
    btn.className = 'btn btn-primaryzzz btn-sm';
    btn.style.float = 'right';
    btn.onclick = function(){
      PluginGoogleMaps.showMap(id);
    }
    div.appendChild(btn);
    /**
     * span
     */
    var span = document.createElement('span');
    span.className = 'text-secondary';
    if(document.getElementById(id).value){
      span.innerHTML = '(has position)';
    }else{
      span.innerHTML = '(no position)';
    }
    span.id = 'span_map_icon_'+id;
    div.appendChild(span);
    /**
     * Hide element
     */
    document.getElementById(id).style.display='none';
  }
}
var PluginGoogleMaps = new plugin_google_maps();
