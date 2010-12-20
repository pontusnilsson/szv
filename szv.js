/**
 * Drupal behaviour for swedish zip code fields
 */
Drupal.behaviors.szv = function(context) {

  var fieldsInfo = Drupal.szv.getFieldsInfo(),
      oldVal = '',
      helpText = Drupal.t('Inserted automatically'),
      cityVal = Drupal.t('City not found');

  for(var i in fieldsInfo){

    var citySel = '#edit-'+fieldsInfo[i]['city'].replace('_','-')+'-0-value',
        $cityElem = $(citySel);

    $cityElem.val(helpText).attr('disabled','disabled');

    $('.'+fieldsInfo[i]['selector']).keyup(function(e){

      var $this = $(e.target),
          val = $this.val();

          if(val.match(/\d{5}/) && oldVal != val){

            $.getJSON(Drupal.settings.basePath+'szv/'+val, function(response){

              if(response != null){
                cityVal = response[0];
              }
                $cityElem.val(cityVal);
            })
          }
          if(oldVal.match(/\d{5}/) && val.match(/\d{4}/)){
            $cityElem.val(helpText);
          }

          oldVal = val;          
    });
  }
};

/**
 * Utility functions for szv
 */
Drupal.szv = {
  getFieldsInfo: function(){

    var fieldsInfo = {};
    if(Drupal.settings.szv) {
      for(var i in Drupal.settings.szv){
        fieldsInfo[i] = Drupal.settings.szv[i];
      }
    }
    return fieldsInfo;
  }
}

