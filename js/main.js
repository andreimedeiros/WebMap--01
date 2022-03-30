require([
    "esri/rest/locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/BasemapToggle",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search"], function (locator, Map, MapView, BasemapGallery, Expand, BasemapToggle, Graphic, GraphicsLayer, Locate, Search) {


        const locatorUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

        const map = new Map({
            basemap: "satellite"
        });

        const view = new MapView({
            container: "viewDiv",
            map: map,
            center: [-34.86, -7.12],
            zoom: 14.5
        });

        const basemapToggle = new BasemapToggle({
            view: view,
            nextBasemap: "osm"
        });

        const basemapGallery = new BasemapGallery({
            view: view,
            container: document.createElement("div")
        });


        const bgExpand = new Expand({
            view: view,
            content: basemapGallery
        });

        const graphicsLayer = new GraphicsLayer();
        map.add(graphicsLayer);


        /*************** SERVIÇO DE GEOLOCALIZAÇÃO - ENDEREÇO DAS RUAS **************/


        view.popup.autoOpenEnabled = false;
        view.on("click", (event) => {
            const varlatitude = Math.round(event.mapPoint.latitude * 1000) / 1000;
            const varlongitude = Math.round(event.mapPoint.longitude * 1000) / 1000;
            view.popup.open({
                title: "Coordenadas geográficas: [" + varlongitude + ", " + varlatitude + "]",
                location: event.mapPoint
            });

        // Localizar o endereço onde foi clicado.
        const params = {
            location: event.mapPoint
        };

        // Executar um geocódigo reverso usando a localização clicada.
        locator
            .locationToAddress(locatorUrl, params)
            .then((response) => {
                // Caso um endereço seja encontrado, ele será mostrado na mesangem do popup
                view.popup.content = response.address;
            })
            .catch(() => {
                // caso nenhum endereço for encontrado onde o usuário clicar.
                view.popup.content = "Nenhum endereço foi encontrado para esta localização"
            });

        });

        /*************** SERVIÇO DE GEOLOCALIZAÇÃO  **************/

        const local = new Locate({
            view: view,
            useHeadingEnabled: false,
            goToOverride: function (view, options) {
                options.target.scale = 1500;
                return view.goTo(options.target);
            }
        });
        view.ui.add(local, "top-left");


        /************  BUSCAR ENDEREÇO ***********/

        const buscarEndereco = new Search({  //Adicionar widget de buscar endereço
            view: view
        });



        /************  CRIAR UM PONTO NO MAPA ***********/

        const pontoTecgeo = {
            type: "point",
            longitude: -34.865700,
            latitude: -7.121404,
        };

        const pontoAparencia = {
            type: "simple-marker",
            color: [135, 206, 250],  // lightskyblue
            outline: {
                color: [255, 255, 255], // branco
                width: 2
            }
        };

      

        const graficoPonto = new Graphic({
            geometry: pontoTecgeo,
            symbol: pontoAparencia,
            // attributes: attributes,
            
        });


        /**********  CRIAR UMA LINHA NO MAPA ***************/

        const linhavetor = {
            type: "polyline",
            paths: [
                [-34.867564, -7.119963],
                [-34.866468, -7.120512],
                [-34.864734, -7.121342],
                [-34.862563, -7.122369],
                [-34.859390, -7.123908],
                [-34.858853, -7.124126],
                [-34.858456, -7.124365],
                [-34.857452, -7.125302],
                [-34.857066, -7.125888],
                [-34.856797, -7.126473],
                [-34.856620, -7.127123],
                [-34.856566, -7.127911],
                [-34.856587, -7.128177],
                [-34.856630, -7.128608],
                [-34.856678, -7.128959],
                [-34.856732, -7.129177],
                [-34.856866, -7.129465]
            ]
        };

        const linhaaparencia = {
            type: "simple-line",
            color: [220, 20, 60], // 	crimson red
            width: 6
        };


        const graficoLinha = new Graphic({
            geometry: linhavetor,
            symbol: linhaaparencia,
        });



        /********* CRIANDO UM POLÍGONO NO MAPA  *********/

        const polygon = {
            type: "polygon",
            rings: [
                [-34.865778, -7.120921],
                [-34.862627, -7.122428],
                [-34.864361, -7.125973],
                [-34.871669, -7.122490],
                [-34.870445, -7.120041],
                [-34.867740, -7.120041]
            ]
        };

        const simpleFillSymbol = {
            type: "simple-fill",
            color: [127, 255, 212, 0.6],  // Aquamarine, opacidade 60%
            outline: {
                color: [255, 255, 255],
                width: 1.5
            }
        };

        const polygonGraphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol,

        });

        /******** UI ********/

        graphicsLayer.add(polygonGraphic);
        graphicsLayer.add(graficoLinha);
        graphicsLayer.add(graficoPonto);
        view.ui.add(buscarEndereco, "top-right");
        view.ui.add(bgExpand, "top-right");
        view.ui.add(basemapToggle, {
            position: "bottom-right"
        });


    });