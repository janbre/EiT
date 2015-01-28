var enabled = false;
var enabledImg = "js/images/scrolling-icon-enabled.png";
var disabledImg = "js/images/scrolling-icon-disabled.png";
L.Control.EasyButtons = L.Control.extend({
    options: {
        position: 'topleft',
        title: '',
        intentedIcon: 'fa-circle-o'
    },

  
    onAdd: function () {
        var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        this._container = container;

        this.link = L.DomUtil.create('a', 'leaflet-bar-part-custom', container);

        var image = L.DomUtil.create('img', 'leaflet-buttons-control-img', this.link);
        image.setAttribute('src',disabledImg);
        this.link.href = '#';

        L.DomEvent.on(this.link, 'click', this._click, this);
        this.link.title = this.options.title;

        return container;
    },

    intendedFunction: function(){ alert('no function selected');},

    _click: function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        enabled = !enabled;
        var scrollingImg = document.getElementsByClassName("leaflet-buttons-control-img")[0];
        scrollingImg.src = (enabled ? enabledImg : disabledImg);
        
        this.intendedFunction();
    }
});

L.easyButton = function( btnIcon , btnFunction , btnTitle , btnMap ) {
  var newControl = new L.Control.EasyButtons;
  if (btnIcon) newControl.options.intentedIcon = btnIcon;

  if ( typeof btnFunction === 'function'){
    newControl.intendedFunction = btnFunction;
  }

  if (btnTitle) newControl.options.title = btnTitle;

  if ( btnMap == '' ){
    // skip auto addition
  } else if ( btnMap ) {
    btnMap.addControl(newControl);
  } else {
    map.addControl(newControl);
  }
  return newControl;
};
