<?php
class PluginGoogleMaps{
  public function widget_include($data){
    $language = wfI18n::getLanguage();
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data['data']);
    $data->set('google_api_key', wfSettings::getSettingsFromYmlString($data->get('google_api_key')));
    if(!$data->get('callback')){
      $data->set('callback', 'plugin_google_maps_callback');
    }
    /**
     * urls
     */
    $data->set('url_google', 'https://maps.googleapis.com/maps/api/js?language='.$language.'&key='.$data->get('google_api_key').'&callback='.$data->get('callback').'&libraries=places');
    $data->set('url_plugin', '/plugin/google/maps/PluginGoogleMaps.js?t='.wfFilesystem::getFiletime(wfArray::get($GLOBALS, 'sys/app_dir').'/plugin/google/maps/public/PluginGoogleMaps.js'));
    /**
     * element
     */
    $element = wfDocument::getElementFromFolder(__DIR__, __FUNCTION__);
    $element->setByTag($data->get());
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
