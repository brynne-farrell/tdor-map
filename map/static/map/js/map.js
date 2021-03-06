document.addEventListener("DOMContentLoaded", function() {
    function fixContentHeight(map){
        var navbar = document.querySelector('nav');
        var footer = document.querySelector('footer');
        var header = document.getElementById('playbackControls');
        var subtractHeight = navbar.offsetHeight + footer.offsetHeight + header.offsetHeight;
        subtractHeight = subtractHeight * 1.1; // Add an extra 10%< just for breathing room
        var mapHeight = document.body.offsetHeight - subtractHeight;
        var mapWidth = 1.64 * mapHeight;
        
        var mapDiv = document.getElementById("map");
        if (mapDiv.offsetWidth < mapWidth) {2
            mapWidth = mapDiv.offsetWidth;
            mapHeight = mapWidth / 1.64;
        }
        mapDiv.style = "height: "+mapHeight+"px; " + "width: "+mapWidth+"px; ";
        map.updateSize();
    }
    
    function days(numDays) {
        return 1000 * 60 * 60 * 24 * numDays;
    }
    
    var styles = {
        '0day': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: [255, 0, 0, 1]
                }),
                stroke: new ol.style.Stroke({
                    color: [255, 0, 0, 1],
                    width: 1
                })
            })
        }),
        '7day': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: [255, 0, 0, 0.75]
                }),
                stroke: new ol.style.Stroke({
                    color: [255, 0, 0, 0.75],
                    width: 1
                })
            })
        }),
        '14day': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: [255, 0, 0, 0.50]
                }),
                stroke: new ol.style.Stroke({
                    color: [255, 0, 0, 0.50],
                    width: 1
                })
            })
        }),
        '21day': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: [255, 0, 0, 0.25]
                }),
                stroke: new ol.style.Stroke({
                    color: [255, 0, 0, 0.25],
                    width: 1
                })
            })
        }),
        'hidden': new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: null,
                stroke: null
            })
        }),
    };
    
    var startDate = new Date('November 19, 2017 05:00:00');
    var styleFunction = function(feature) {
        var splitDate = feature.getProperties().date.split("-");
        
        var monthLookup = {
            'Jan': 0,
            'Feb': 1,
            'Mar': 2,
            'Apr': 3,
            'May': 4,
            'Jun': 5,
            'Jul': 6,
            'Aug': 7,
            'Sep': 8,
            'Oct': 9,
            'Nov': 10,
            'Dec': 11,
        };
        
        var day = splitDate[0];
        var month = monthLookup[splitDate[1]];
        var year = "20" + splitDate[2];
        
        var featureDate = new Date(year, month, day);
        featureDate.setHours(5, 0, 0, 0);
        
        if (featureDate.getTime() == startDate.getTime()) {
            var addNameEvent = new CustomEvent('addName', {
                detail: feature.getProperties()
            });
            document.dispatchEvent(addNameEvent);
        }

        if (featureDate.getTime() <= startDate.getTime() && featureDate.getTime() > startDate.getTime() - days(7)) {
            return styles['0day'];
        } else if (featureDate.getTime() <= startDate.getTime() - days(7) && featureDate.getTime() > startDate.getTime() - days(14)) {
            return styles['7day'];
        } else if (featureDate.getTime() <= startDate.getTime() - days(14) && featureDate.getTime() > startDate.getTime() - days(21)) {
            return styles['14day'];
        } else if (featureDate.getTime() <= startDate.getTime() - days(21) && featureDate.getTime() > startDate.getTime() - days(28)) {
            return styles['21day'];
        } else {
            return styles.hidden;
        }
    };
    
    fetch('static/map/data/2018.json').then(function(data) {
        return data.json();
    }).then(function(data){
        var vectorSource = new ol.source.Vector({
            features: (new ol.format.GeoJSON()).readFeatures(data),
            attributions: 'Date and location of deaths sourced from Abernathey, M. <i>Memorializing 2018</i>. Retrieved Dec 4, 2018 from <a href="https://tdor.info/" target="_blank">https://tdor.info/<a>.'
        });

        vectorSource.addFeature(new ol.Feature(new ol.geom.Circle([5e6, 7e6], 1e6)));

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: styleFunction,
        });

        var attribution = new ol.control.Attribution({
            collapsible: true
        });

        var map = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                }),
                vectorLayer
            ],
            view: new ol.View({
                projection: 'EPSG:4326',
                center: ol.proj.fromLonLat([0, 0]),
                zoom: 3
            }),
            controls: ol.control.defaults({
                attribution: false
            }).extend([attribution]),
        });
        fixContentHeight(map);
        
        map.getView().fit([-180, -90, 180, 90], {nearest: true}); // Not exactly the projection's dimensions to make sure the map doesn't zoom out too much

        var frameRate = 7; // frames per second
        var maxDate = new Date('November 19, 2018 05:00:00');
        var animationId = window.setInterval(setTime, 1000 / frameRate);
        var isPlaying = false;

        function setTime() {
            if (startDate.getTime() >= maxDate.getTime()) {
                window.clearInterval(animationId);
                return;
            }
            if (isPlaying) {
                startDate.setTime(startDate.getTime() + days(1));
                startDate.setHours(5, 0, 0, 0);
                vectorLayer.changed();
                document.getElementById("currentDate").innerHTML = startDate.toLocaleDateString();
            }
        }
        
        var playbackStart = document.getElementById("playbackStart");
        var playbackStop = document.getElementById("playbackStop");
        var playbackReset = document.getElementById("playbackReset");
        
        playbackStart.addEventListener("click", function(){
            isPlaying = true;
        });
        playbackStop.addEventListener("click", function(){
            isPlaying = false;
        });
        playbackReset.addEventListener("click", function(){
            startDate.setTime(new Date('November 19, 2017 05:00:00'));
            startDate.setHours(5, 0, 0, 0);
            document.getElementById("currentDate").innerHTML = startDate.toLocaleDateString();
            vectorLayer.changed();
            
            var resetCounterEvent = new CustomEvent('resetCounter');
            document.dispatchEvent(resetCounterEvent);
        });
    });
});