require([
    "esri/layers/SubtypeGroupLayer",
    "esri/rest/locator",
    "esri/Map",
    "esri/views/MapView",
    "esri/widgets/BasemapGallery",
    "esri/widgets/Expand",
    "esri/widgets/BasemapToggle",
    "esri/Graphic",
    "esri/layers/GraphicsLayer",
    "esri/widgets/Locate",
    "esri/widgets/Search",
    "esri/layers/FeatureLayer",
    "esri/geometry/geometryEngine",
    "esri/widgets/ScaleBar",
    "esri/widgets/Sketch",
    "esri/widgets/LayerList",
    "esri/layers/MapImageLayer",
    "esri/layers/GroupLayer"], function (SubtypeGroupLayer, locator, Map, MapView, BasemapGallery, Expand, BasemapToggle, Graphic, GraphicsLayer, Locate, Search, FeatureLayer, geometryEngine, ScaleBar, Sketch, LayerList, MapImageLayer, GroupLayer) {



    /* Referências para a property 'basemap: https://developers.arcgis.com/javascript/latest/api-reference/esri-Map.html#basemap */

    const locatorUrl = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer";

    const map = new Map({
        basemap: "satellite",
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

    const graphicsLayer = new GraphicsLayer({
        title: "Elementos Gráficos"
    });

    map.add(graphicsLayer);


    const layerList = new LayerList({
        view: view
    });

    const llExpand = new Expand({
        view: view,
        content: layerList
    })

    // view.ui.add(layerList, "top-right");




    /*************** SERVIÇO DE GEOLOCALIZAÇÃO - ENDEREÇO DAS RUAS **************/


    /* view.popup.autoOpenEnabled = false;
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

    }); */

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

    const buscarenderecoExpand = new Expand({
        view: view,
        content: buscarEndereco
    })



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

    const popupTemplatePONTO = {
        title: "TecGeo | Tecnologia em Geoprocessamento",
        content: "Há mais de 15 anos no mercado, a Tecgeo é uma empresa que oferece serviços de geoprocessamento e tecnologia da informação para todo o Brasil. Somos especialistas no desenvolvimento de diversas soluções que utilizam tecnologia e informação geoespacial para a Gestão da Informação Inteligente em empresas públicas e privadas.",

    };

    const graficoPonto = new Graphic({
        geometry: pontoTecgeo,
        symbol: pontoAparencia,
        // attributes: attributes,
        popupTemplate: popupTemplatePONTO
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

    /*  const medirDistSymbol = {
         title: "Medir Distância",
         id: "medirdist",
         image:
             "https://developers.arcgis.com/javascript/latest/sample-code/popup-actions/live/Measure_Distance16.png"
     };
 
     const measureThisAction = {
         title: "Measure Length",
         id: "measure-this",
         image:
           "https://developers.arcgis.com/javascript/latest/sample-code/popup-actions/live/Measure_Distance16.png"
       };
 
       const template = {
         // autocasts as new PopupTemplate()
         title: "Trail run",
         content: "{name}",
         actions: [measureThisAction]
       };
 
       const featureLayer = new FeatureLayer({
         url: "https://services.arcgis.com/V6ZHFr6zdgNZuVG0/arcgis/rest/services/TrailRuns/FeatureServer/0",
         popupTemplate: template
       });
 
       map.add(featureLayer);
 
       // Execute each time the "Measure Length" is clicked
       function measureThis() {
         const geom = view.popup.selectedFeature.geometry;
         const initDistance = geometryEngine.geodesicLength(geom, "miles");
         const distance = parseFloat(
           Math.round(initDistance * 100) / 100
         ).toFixed(2);
         view.popup.content =
           view.popup.selectedFeature.attributes.name +
           "<div style='background-color:DarkGray;color:white'>" +
           distance +
           " miles.</div>";
       }
 
       // Event handler that fires each time an action is clicked.
       view.popup.on("trigger-action", (event) => {
         // Execute the measureThis() function if the measure-this action is clicked
         if (event.action.id === "measure-this") {
           measureThis();
         }
       }); */


    const linhaPopup = {
        title: "Avenida Juarez Távora",
        content: "Avenida onde o Empresarial Maximum está localizado.",
        // actions: [medirDistSymbol]
    };

    const graficoLinha = new Graphic({
        geometry: linhavetor,
        symbol: linhaaparencia,
        popupTemplate: linhaPopup
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
            [-34.867740, -7.120041],
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


    /* WIDGET DE ESCALA */

    const barradeEscala = new ScaleBar({
        view: view,
        unit: "metric"
    });


    /* WIDGET DE SKETC */


    const sketch = new Sketch({
        layer: graphicsLayer,
        view: view,
        availableCreateTools: ["polyline", "polygon", "rectangle"],
        creationMode: "update",
        updateOnGraphicClick: true,
        visibleElements: {
            createTools: {
                point: false,
                circle: false
            },
            selectionTools: {
                "lasso-selection": false,
                "rectangle-selection": false,
            },
            settingsMenu: false,
            undoRedoMenu: false
        }
    });

    const sketchExpand = new Expand({
        view: view,
        content: sketch
    })



    // // // const measurements = document.getElementById("measurements");
    // // // view.ui.add(measurements, "manual");





    /**************** LAYER *******************/

    



    const casosLayer0 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/0"
    });

    const casosLayer1 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/1"
    });

    const casosLayer2 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/2"
    });

    const casosLayer3 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/3"
    });

    const casosLayer4 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/4"
    });

    const casosLayer5 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/5"
    });

    const casosLayer6 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/6"
    });

    const casosLayer7 = new FeatureLayer({
        url:"https://services6.arcgis.com/todjZmTeDSWA1qQw/arcgis/rest/services/Casos_JP_WFL1/FeatureServer/7"
    });

    const layersGroup = new GroupLayer({
        title: "Casos Doenças - João Pessoa",
        layers: [
            casosLayer0, 
            casosLayer1,
            casosLayer2,
            casosLayer3,
            casosLayer4,
            casosLayer5,
            casosLayer6,
            casosLayer7,
        ],
    //    orderBy: 0

    })

    const mapServico = new MapImageLayer({
        url: "https://arcgis.tecgeobr.com.br/server/rest/services/CARTOGRAFIA_TESTE/MapServer",
        // orderBy: 1
        
    });

    






    /******** UI ********/

    graphicsLayer.add(polygonGraphic);
    graphicsLayer.add(graficoLinha);
    graphicsLayer.add(graficoPonto);
    // view.ui.add(buscarEndereco, "top-right");
    view.ui.add(bgExpand, "top-right");  // Adiciona o menu de BasemapGallery expandível
    view.ui.add(llExpand, "top-right");  // Adiciona a lista de Camadas expandível
    view.ui.add(buscarenderecoExpand, "top-right"); // Adiciona o menu de buscar endereço expandível
    view.ui.add(basemapToggle, {
        position: "bottom-right"
    });  // Adiciona a opção de troca de mapas
    view.ui.add(barradeEscala, "bottom-right"); // Adiciona a barra de escalas

    view.ui.add(sketchExpand, "top-right") // Adiciona o menu de Sketch expandível
    map.add(layersGroup);
    map.add(mapServico)
    // view.ui.add(sketch, "top-right");



});