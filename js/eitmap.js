// TODO:
//// Institution layer: Omsorgskafeen, Sorgenfri
/*************************************/
/*		Styling for polygons		 */
/*************************************/

var fireStyle = {
	"color": "#ff7880",
	"weight": 1,
	"opacity": 0.65,
	"fillOpacity": 0.4
};

var quickClayStyle = {
	"color": "#804a2d",
	"weight": 1,
	"opacity": 0.65,
	"fillOpacity": 0.3
};

var floodStyle = {
	"color": "#0000ff",
	"weight": 1,
	"opacity": 1,
	"fillOpacity": 0.3
};

var dambreakStyle = {
	"color": "#38bcf1",
	"weight": 1,
	"opactiy": 1,
	"fillOpacity": 0.4
};

var levels = {
	quickClayLevels: [
		"#00FF66",
		"#FFFF66",
		"#FFCC00",
		"#FF9900",
		"#FF0000"
	]
};

var hoverStyle = {
	"opacity": 1,
	"fillOpacity": 0.8
};

var geoJson;
var fireType = "Fire";
var floodType = "FlomAreal";
var quickClayType = "KvikkleireFaresone";
var historicType = "Historic";
var markerType = "Marker";
var dambreakType = "Dambreak";

var FlameIcon = L.Icon.extend({
    options: {
        shadowUrl: "js/images/flame-shadow.png",
        iconSize:       [26,41],
        shadowSize:     [44,29],
        iconAnchor:     [13,41],
        shadowAnchor:   [13,29],
        popupAnchor:    [-3, -35]
    }
});

var HistoricIcon = L.Icon.extend({
    options: {
        shadowUrl:      "js/images/historic-shadow.png",
        iconsize:       [25,35],
        shadowSize:     [51,28],
        iconAnchor:     [12,35],
        shadowAnchor:   [12,30],
        popupAnchor:    [-3, -35]
    }
});

var whiteFlame = new FlameIcon({iconUrl: "js/images/flame-white.png"});
var greenFlame = new FlameIcon({iconUrl: "js/images/flame-green.png"});
var yellowFlame = new FlameIcon({iconUrl: "js/images/flame-yellow.png"});
var redFlame = new FlameIcon({iconUrl: "js/images/flame-red.png"});
var historicMarker = new HistoricIcon({iconUrl: "js/images/historic.png"});

/*************************************/
/**  Read GeoJSON and create layers **/
/*************************************/

var mapLink = "<a href='http://openstreetmap.org'>OpenStreetMap contributors</a>";
var mapquestLink = "<a href='http://www.mapquest.com/' target='_blank'>MapQuest</a>";
var mapquestPic = "<img src='http://developer.mapquest.com/content/osm/mq_logo.png'>";
var mapLayer = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png", {
		attribution: "&copy; " + mapLink + ". Tiles courtesy of "+mapquestLink + " - " + mapquestPic,
		subdomains: ["otile1", "otile2", "otile3", "otile4"]
});

var historicLayer = L.geoJson(historic, {
	filter: function (feature, layer) {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});


var fireLayer = L.geoJson(fireareas, {
	filter: function (feature, layer) {
		if (feature.properties) {
			// If the property "underConstruction" exists and is true, return false (don't render features under construction)
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});

var floodLayer = L.geoJson(floodareas, {
	style: floodStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});

var dambreakLayer = L.geoJson(dambreaks, {
    style: dambreakStyle,
    filter: function (feature, layer) {
        if (feature.properties) {
            return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
        }
        return false;
    },
    onEachFeature: onEachFeature
});

var quickClayLayer = L.geoJson(quickClayAreas, {
	style: quickClayStyle,
	filter: function (feature, layer) {
		if (feature.properties) {
			return feature.properties.underConstruction !== undefined ? !feature.properties.underConstruction : true;
		}
		return false;
	},
	onEachFeature: onEachFeature
});


var markerLayer = L.geoJson(markers, {
    onEachFeature: onEachFeature
});


/// Create the map, center it on Trondheim and set zoom to 15 before adding layers
var map = L.map("map", {
	center: [63.43387, 10.41384],
	zoom: 13,
	layers: [mapLayer, fireLayer, floodLayer, historicLayer, quickClayLayer, markerLayer, dambreakLayer]
});

map.scrollWheelZoom.disable();

// Can only have one basemap active at any time, but we only have one so let's comment it out
// to get a cleaner interface
var baseMaps = {
	 "Normal": mapLayer
};

// Can have multiple overlays and switch between them, let's add one for every category
var overlayMaps = {
    "Fire risk areas": fireLayer,
	"Historic events": historicLayer,
	"Quick clay risk areas": quickClayLayer,
	"500-year Flood": floodLayer,
    "Social institutions": markerLayer,
    "Dam break zone": dambreakLayer
};

// Add layer switching controls to the map
L.control.layers(baseMaps, overlayMaps).addTo(map);

// Check feature type and add colors, markers etc to layer
function onEachFeature(feature, layer) {
	var popUpContent = "";
	var img = "";
	switch (feature.properties.objType) {
		case quickClayType:
			var levelColor = getDangerLevel(feature);
			layer.setStyle({
				color: levelColor
			});
			break;
		case fireType:
			popupContent = getFirePopup(feature);
            layer.bindPopup(popupContent);
			layer.setIcon(getCustomFireIcon(feature, layer));
			break;
		case floodType:
			popupContent = getFloodPopup(feature);
			break;
		case historicType:
			popupContent = getHistoryPopup(feature);
			layer.bindPopup(popupContent);
			layer.setIcon(historicMarker);
			break;
		case dambreakType:
			popupContent = getDambreakPopup(feature);
			layer.bindPopup(popupContent);
			break;
		case markerType:
			popupContent = getMarkerPopup(feature);
			layer.bindPopup(popupContent);
			layer
		default:
			popupContent = "Unknown feature type";
	}
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight
	});
}

function getCustomFireIcon(feature, layer) {
    switch (feature.properties.risikoKl) {
        case 0:
            return whiteFlame;
        case 1:
            return greenFlame;
        case 2:
            return yellowFlame;
        case 3:
            return redFlame;
        default:
            return whiteFlame;
    }
}

function getDambreakPopup(feature) {
	var popupContent = "";
	popupContent = "<h3>" + feature.properties.title + "</h3>";
	popupContent += "<p>" + feature.properties.popupContent + "</p>";
	return popupContent;
}

function getFirePopup(feature) {
	var popupContent = "";
	var riskLevel = "";
	switch (feature.properties.risikoKl) {
		case 0:
			riskLevel = "Unknown";
			break;
		case 1:
			riskLevel = "Low";
			break;
		case 2:
			riskLevel = "Medium";
			break;
		case 3:
			riskLevel = "High";
			break;
		default:
			riskLevel = "Unknown";
    }
    popupContent = "<h3>" + feature.properties.title + "</h3>";
    popupContent += "<p>" + feature.properties.popupContent + "</p>";
    popupContent += "<p><i>Risk level: " + riskLevel + "</i></p>";
	return popupContent;
}

function getHistoryPopup(feature) {
	var popupContent = "";
	popupContent = "<h3>" + feature.properties.title + "</h3>";
	popupContent += "<p>" + feature.properties.popupContent  + "</p>";
	if (feature.properties.img) {
		var fileType = ".jpg";
		var fullImage = feature.properties.img + fileType;
		var smallImage = feature.properties.img + "_small" + fileType;
		popupContent += "<br><a href='img/" + fullImage + "' target='_blank'><img src='img/" + smallImage + "'/></a>";
	}
	if (feature.properties.source) {
		popupContent += "<a href='" + feature.properties.source + "' target='_blank'>Source</a>";
	}
	return popupContent;
}

function getMarkerPopup(feature) {
	var popupContent = "";
	popupContent = "<h3>" + feature.properties.title + "</h3>";
	popupContent += "<p>" + feature.properties.popupContent + "</p>";
	return popupContent;
}

function getQuickClayPopup(feature) {
	var popupContent = "";
	popupContent = "<a href='http://gis3.nve.no/nvedatanedlast/Default.aspx'>Source</a>";
	return popupContent;
}


function getFloodPopup(feature) {
	var popupContent = "";
	return "FLOOD!";
}




//////////////////////////////////////////////
//		Helper functions for coloring		//
//		layers and highlighting features   	//
//////////////////////////////////////////////

// Used to highlight features. Style defines is highlight style
function highlightFeature(e) {
	var layer = e.target;
	var featureType = layer.feature.properties.objType;
	if (featureType !== markerType && featureType !== historicType && featureType !== fireType) {
		layer.setStyle({
			opacity: 1,
			fillOpacity: 0.6
		});
		if (!L.Browser.ie && !L.Browser.opera) {
			layer.bringToFront();
		}
	}
	info.update(e.target.feature.properties);
}

// Need to reset layer style when done highlighting (when mouse moves away)
function resetHighlight(e) {
	geoJson = getStyle(e);
	if (geoJson === null) {
		info.update();
	} else {
		geoJson.resetStyle(e.target);
		info.update();
	}
	resetLevels(e);
}

// For layers with more than one color, reset to correct colors
function resetLevels(e) {
	if (e.target.feature.properties.objType === quickClayType) {
		var levelColor = getDangerLevel(e.target.feature);
		e.target.setStyle({
			color: levelColor
		});
	}
}

function getDangerLevel(feature) {
	var level = feature.properties.risikoKl;
	var type = feature.properties.objType;
	if (type === quickClayType) {
		return levels.quickClayLevels[level - 1];
	}
}

function getStyle(e) {
	switch (e.target.feature.properties.objType) {
		case quickClayType:
			geoJson = L.geoJson(quickClayAreas, {
				style: quickClayStyle,
				onEachFeature: onEachFeature
			});
			break;
		case dambreakType:
			geoJson = L.geoJson(dambreaks, {
				style: dambreakStyle,
				onEachFeature: onEachFeature
			});
			break;
		case floodType:
			geoJson = L.geoJson(floodareas, {
				style: floodStyle,
				onEachFeature: onEachFeature
			});
			break;
		default:
			onEachFeature: onEachFeature;
			geoJson = null;
	}
	return geoJson;
}


//////////////////////////////////////////
//		Info box and scroll button		//
//////////////////////////////////////////

var info = L.control({position: "bottomright"});

info.onAdd = function (map) {
	this._div = L.DomUtil.create("div", "info"); // create a div with class info
	this.update();
	return this._div;
};

info.update = function (properties) {
	var p = (properties ? properties.objType : "");
	if (p === markerType || p === historicType) {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.title : "");
	}else if (p === quickClayType) {
		info.updateQuickClay(properties);
	} else if (p === floodType) {
		this._div.innerHTML = "<h4>Information</h4>";
	} else {
		this._div.innerHTML = "<h4>Information</h4>" + (properties ? properties.objType  + " risk area" : "");
	}
};

info.updateQuickClay = function (properties) {
	this._div.innerHTML = "<h4>Quick clay area</h4><h4>" + (properties ? properties.skrdOmrNvn : "") + "</h4>";
	this._div.innerHTML += "<p>Risk rating: " + (properties ? properties.risikoKl : "") + "</p>";
	this._div.innerHTML += "<p><i>Risk = (probability + consequence)</i></p>";
};

info.addTo(map);

L.easyButton('fa-comment',
		function () {
			var mapDiv = L.DomUtil.get("map");
			if (map.scrollWheelZoom.enabled()) {
				map.scrollWheelZoom.disable();
			} else {
				map.scrollWheelZoom.enable();
			}
		},
		'Enable/disable scroll zoom'
);
