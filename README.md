# Buto-Plugin-GoogleMaps
Use the include widget only one time with your Google API Key. Then use multiple map widgets. One can omit data/marker if no marker is needed. Go to https://code.google.com/apis/console for your key.

## Include Javascript
Include Google Map resorce js file with the api key and the plugin js file. Edit param google_api_key with your key.
```
type: widget
data:
  plugin: google/maps
  method: include
  data:
    google_api_key: _my_google_api_key_
```

### Callback
```
    callback: any_method_when_maps_library_is_loaded
```

## Map widget

Apply a Google map. Change style, class, position, zoom, scrollwheel, draggable, type. Set marker with position, title, icon and window. Or use without marker if needed.

<i>Param id has to be a unic element id. Changes style or add a css class. Search on Google for param data/mapTypeId.</i>

### Settings

#### Map center
Param data/center can have param geocode or lat/lng.

#### Map type
Param data/mapTypeId can have values ROADMAP, SATELLITE, HYBRID or TERRAIN.

#### Marker
Param data/marker/-/position  can have param geocode or lat/lng.

#### Marker icon
Set param data/marker/-/icon to url for use a custom icon.

#### Marker window
Set param data/marker/-/window/content to any html and the content will show upp when to click on marker. Set param show to true to show windows instantly.

#### GPX
Add multiple paths via gpx files by including param data/gpx.

#### LatLngBounds
Set to true to let map center on markers.

```
type: widget
data:
  plugin: google/maps
  method: map
  data:
    id: _my_id_
    style: 'height:300px;width:100%;'
    class: ''
    data:
      center:
        geocode: 'Pickesjövägen Borås'
      _center_or_by_lat_lng_:
        lat: '56.6777253'
        lng: '12.8145228'
      zoom: 18
      scrollwheel: true
      draggable: true
      mapTypeId: SATELLITE
      mapTypeId_example1: ROADMAP
      LatLngBounds: true
      marker:
        -
          position:
            geocode: 'Pickesjövägen 2 Borås'
          title: Borås
          window:
            content: '<span style="color:black">HTML</span>'
            show: true
```



