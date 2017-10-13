<?php
/**
<p>
Google map
</p>
<p>
Use the include widget only one time with your Google API Key. Then use multiple map widgets. One can omit data/marker if no marker is needed. Go to https://code.google.com/apis/console for your key.
</p>
 */
class PluginGoogleMaps{
  /**
  <p>
  Include Google Map resorce js file with the api key and the plugin js file. Edit param google_api_key with your key.
  </p>
 */
  public function widget_include($data){
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data['data']);
    $data->set('google_api_key', wfSettings::getSettingsFromYmlString($data->get('google_api_key')));
    $script_google = wfDocument::createHtmlElement('script', null, array('type' => 'text/javascript', 'src' => '//maps.googleapis.com/maps/api/js?key='.$data->get('google_api_key').'&libraries=places', 'async' => null, 'defer' => null));
    $script_plugin = wfDocument::createHtmlElement('script', null, array('type' => 'text/javascript', 'src' => '/plugin/google/maps/PluginGoogleMaps.js?t='.wfFilesystem::getFiletime(wfArray::get($GLOBALS, 'sys/app_dir').'/plugin/google/maps/public/PluginGoogleMaps.js')));
    wfDocument::renderElement(array($script_google, $script_plugin));
  }
  /**
  <h1>Google Maps</h1>
  <p>
  Apply a Google map. Change style, class, position, zoom, scrollwheel, draggable, type. Set marker with position, title, icon and window. Or use without marker if needed.
  </p>
  <p>
  <i>Param id has to be a unic element id. Changes style or add a css class. Search on Google for param data/mapTypeId.</i>
  </p>
  <p>Settins availible.</p>
  <h2>Map center</h2>
  <p>Param data/center can have param geocode or lat/lng.</p>
  <h2>Map type</h2>
  <p>Param data/mapTypeId can have values ROADMAP, SATELLITE, HYBRID or TERRAIN</p>
  <h2>Marker</h2>
  <p>Param data/marker/-/position  can have param geocode or lat/lng.</p>
  <h2>Marker icon</h2>
  <p>Set param data/marker/-/icon to url for use a custom icon.</p>
  <h2>Marker window</h2>
  <p>Set param data/marker/-/window/content to any html and the content will show upp when to click on marker. Set param show to true to show windows instantly.</p>
  <h2>GPX</h2>
  <p>Add multiple paths via gpx files by including param data/gpx.</p>
 */
  public function widget_map($data){
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data['data']);
    $div_map = wfDocument::createHtmlElement('div', '<img src="/plugin/google/maps/loading.gif">', array('id' => $data->get('id'), 'class' => $data->get('class'), 'style' => $data->get('style')));
    if(wfRequest::get('_time')){
      $script_map = wfDocument::createHtmlElement('script', "PluginGoogleMaps.load(".json_encode($data->get()).");", array('type' => 'text/javascript'));
    }else{
      $script_map = wfDocument::createHtmlElement('script', "$(function(){ $(window).load(function(){ PluginGoogleMaps.load(".json_encode($data->get())."); }); });", array('type' => 'text/javascript'));
    }
    wfDocument::renderElement(array($div_map, $script_map));
  }
}