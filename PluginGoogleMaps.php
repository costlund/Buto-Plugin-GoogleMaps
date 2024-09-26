<?php
class PluginGoogleMaps{
  public function widget_include($data){
    /**
     * From theme settings plugin/google/maps.
     */
    $settings = wfPlugin::getPluginSettings('google/maps', true);
    $google_maps_api_key = wfSettings::getSettingsFromYmlString($settings->get('google_maps_api_key'));
    $google_maps_api_key = new PluginWfArray($google_maps_api_key);
    if(!$google_maps_api_key->get('key')){
      throw new Exception(__CLASS__.'::'.__FUNCTION__.' says: Param key does not exist in file google_maps_api_key.yml!');
    }
    /**
     * 
     */
    $language = wfI18n::getLanguage();
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data);
    if(!$data->get('data/callback')){
      $data->set('data/callback', 'plugin_google_maps_callback');
    }
    /**
     * urls
     */
    $data->set('data/url_google', 'https://maps.googleapis.com/maps/api/js?language='.$language.'&key='.$google_maps_api_key->get('key').'&callback='.$data->get('data/callback').'&libraries=places&loading=async');
    $data->set('data/url_plugin', '/plugin/google/maps/PluginGoogleMaps.js?t='.wfFilesystem::getFiletime( wfGlobals::getWebDir().'/plugin/google/maps/PluginGoogleMaps.js'));
    /**
     * element
     */
    $element = wfDocument::getElementFromFolder(__DIR__, __FUNCTION__);
    $element->setByTag($data->get('data'));
    wfDocument::renderElement($element);
  }
  public function widget_map($data){
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data['data']);
    $div_map = wfDocument::createHtmlElement('div', '<img src="/plugin/google/maps/loading.gif">', array('id' => $data->get('id'), 'class' => $data->get('class'), 'style' => $data->get('style')));
    if(wfRequest::get('_time')){
      $script_map = wfDocument::createHtmlElement('script', "PluginGoogleMaps.load(".json_encode($data->get()).");", array('type' => 'text/javascript'));
    }else{
      $script_map = wfDocument::createHtmlElement('script', "$( document ).ready(function() { setTimeout(function(){PluginGoogleMaps.load(".json_encode($data->get()).");}, 1000)  ;});", array('type' => 'text/javascript'));
    }
    wfDocument::renderElement(array($div_map, $script_map));
  }
}
