<?php
class PluginGoogleMaps{
  public function widget_include($data){
    $language = wfI18n::getLanguage();
    wfPlugin::includeonce('wf/array');
    $data = new PluginWfArray($data['data']);
    $data->set('google_api_key', wfSettings::getSettingsFromYmlString($data->get('google_api_key')));
    $script_google = wfDocument::createHtmlElement('script', null, array('type' => 'text/javascript', 'src' => 'https://maps.googleapis.com/maps/api/js?language='.$language.'&key='.$data->get('google_api_key').'&libraries=places', 'async' => null, 'defer' => null));
    $script_plugin = wfDocument::createHtmlElement('script', null, array('type' => 'text/javascript', 'src' => '/plugin/google/maps/PluginGoogleMaps.js?t='.wfFilesystem::getFiletime(wfArray::get($GLOBALS, 'sys/app_dir').'/plugin/google/maps/public/PluginGoogleMaps.js')));
    wfDocument::renderElement(array($script_google, $script_plugin));
  }
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
