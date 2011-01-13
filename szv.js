/**
 * Drupal behaviour for swedish zip code fields
 */
Drupal.behaviors.szv = function(context) {

  var fieldsInfo = Drupal.szv.getFieldsInfo(),
      oldVal = '',
      helpText = Drupal.t('Inserted automatically'),
      cityNotFoundVal = Drupal.t('City not found'),
      cityVal,
      $throbber = $('<div class="szv-throbber"></div>');

  for(var i in fieldsInfo){

    var citySel = '#edit-'+fieldsInfo[i]['city'].replace('_','-')+'-0-value',
        $cityElem = $(citySel);

    if($cityElem.val().length == 0){
      $cityElem.val(helpText);
    }
    $cityElem.attr('disabled','disabled').addClass('szv-city');

    $('.'+fieldsInfo[i]['selector']).after('<div class="clear-block"></div>').each(function(i,e){

      var $form = $(e).parents('form');

      if($form.not('.szv-processed')){

        $form.bind('submit',function(e){

          $form.find('.szv-city').removeAttr('disabled');

        }).addClass('szv-processed');

      };

    }).keyup(function(e){

      var $this = $(e.target),
          val = $this.val();

          if(val.length > 4 && oldVal != val){

            $this.after($throbber);

            $.getJSON(Drupal.settings.basePath+'szv/'+val, function(response){

              if(response != null){
                cityVal = response[0];
              }else{
                cityVal = cityNotFoundVal;
              }

              $cityElem.val(cityVal);

              $throbber.remove();
            })
          }else if(val.length < 5){

            $cityElem.val(helpText);

          }

//          if(oldVal.match(/\d{5}/) && val.match(/\d{4}/) && oldVal != val){
//            $cityElem.val(helpText);
//          }

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

