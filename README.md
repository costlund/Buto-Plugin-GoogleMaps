# Buto-Plugin-GoogleMaps

<p>Use the include widget only one time with your Google API Key. 
Then use multiple map widgets. 
One can omit data/marker if no marker is needed. 
Go to <a href="https://code.google.com/apis/console">https://code.google.com/apis/console</a> for your key.
Support pic position via a form.</p>

<a name="key_0"></a>

## Usage



<a name="key_0_0"></a>

### Form

<p>Only add this js to transfer an input to a position picker.</p>
<pre><code>PluginGoogleMaps.doInputToMapLink('id of input element')</code></pre>
<p>Json data will be set as input value. </p>
<pre><code>{"lat": "40.69785166022129", "lng": "-73.97968099999999", "map_type_id": "hybrid", "zoom": "9"}</code></pre>

<a name="key_1"></a>

## Widgets



<a name="key_1_0"></a>

### widget_include

<p>Include Google Map resorce js file with the api key and the plugin js file. Edit param google_api_key with your key.</p>
<pre><code>type: widget
data:
  plugin: google/maps
  method: include
  data:
    google_api_key: _my_google_api_key_</code></pre>
<p>Callback.</p>
<pre><code>    callback: any_method_when_maps_library_is_loaded</code></pre>

<a name="key_1_1"></a>

### widget_map

<p>Apply a Google map. 
Change style, class, position, zoom, scrollwheel, draggable, type. Set marker with position, title, icon and window. 
Or use without marker if needed.
Param id has to be a unic element id. 
Changes style or add a css class. 
Search on Google for param data/mapTypeId.</p>
<pre><code>type: widget
data:
  plugin: google/maps
  method: map
  data:
    id: _my_id_
    style: 'height:300px;width:100%;'
    class: ''
    data:
      center:
        geocode: 'New York'
      _center_or_by_lat_lng_:
        lat: '56.6777253'
        lng: '12.8145228'
      zoom: 18
      scrollwheel: true
      draggable: true
      mapTypeId: ROADMAP
      _mapTypeId: SATELLITE, HYBRID or TERRAIN
      LatLngBounds: true
      marker:
        -
          position:
            geocode: 'Pickesjövägen 2 Borås'
          _position:
            lat: '56.6777253'
            lng: '12.8145228'
          title: Borås
          window:
            content: '&lt;span style="color:black"&gt;HTML&lt;/span&gt;'
            show: true
          _icon: any_url
      _gpx:
        -
          url: /1.gpx.txt
        -
          url: /2.gpx.txt</code></pre>

<a name="key_1_1_0"></a>

#### GPX

<p>One could download gpx files from Runkeeper homepage.</p>

