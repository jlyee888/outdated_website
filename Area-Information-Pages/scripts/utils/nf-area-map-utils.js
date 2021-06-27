
//Utility Functions to create topo map for national forest recreation areas

export {nf_area_map_handler}

async function nf_area_map_handler(interest_points_csv){
    const fetched_map_items = await fetch(interest_points_csv);
    let map_items = await fetched_map_items.text();
    map_items = String(map_items);
    map_items = Papa.parse(map_items);
    map_items = map_items.data.slice(1);
    //Write Links
    let coords = populate_nav_links(map_items);
    //Make Popups on Leaflet Map
    create_map(coords)
}

//1. Write the links and their functions onto html
function populate_nav_links(map_items){
    //console.log(map_items)
    let sorted_items = sort_by_class_helper(map_items);
    //console.log(sorted_items);
    let THs = sorted_items[0];
    let landmarks = sorted_items[1];
    let coords = write_THs_helper(THs, landmarks)
    // console.log(coords)
    return coords;
}
//Helper Functions
function sort_by_class_helper(map_items){
    let TH_parking = [];
    let Landmark = [];
    for(let i = 0; i <map_items.length; i++){
        if(map_items[i][2] === "Trailhead/Parking"){
        TH_parking.push(map_items[i]);
        }
        else if (map_items[i][2] === "Landmark"){
        Landmark.push(map_items[i]);
        }
        else{
        continue;
        }
    }
    //console.log(TH_parking, Landmark);
    return[TH_parking, Landmark]
}
function write_THs_helper(THs, landmarks){
    const map_nav_root = document.querySelector("#dynamic_map_nav");
    let coords = [];
    let textNode_th_parking = document.createTextNode("Trailheads and Parking: ");
    map_nav_root.appendChild(textNode_th_parking)
    for(let i = 0; i < THs.length; i++){
        let a = document.createElement('a');
        a.href = "#"
        a.dataset.zoom = "13"
        a.dataset.position = THs[i][1]
        a.innerHTML = THs[i][0]
        map_nav_root.appendChild(a)
        map_nav_root.appendChild(document.createTextNode(" | "))
        let strcoord = THs[i][1].split(",")
        let lat = parseFloat(strcoord[0])
        let long = parseFloat(strcoord[1])
        coords.push([lat,long])
    }
    let br = document.createElement("br");
    map_nav_root.appendChild(br)

    //populate landmarks second
    let textNode_landmarks = document.createTextNode("Natural Landmarks: ");
    map_nav_root.appendChild(textNode_landmarks)
    for(let i = 0; i < landmarks.length; i++){
        let a = document.createElement('a');
        a.href = "#"
        a.dataset.zoom = "13"
        a.dataset.position = landmarks[i][1]
        a.innerHTML = landmarks[i][0]
        map_nav_root.appendChild(a)
        map_nav_root.appendChild(document.createTextNode(" | "))
        
        let strcoord = landmarks[i][1].split(",")
        let lat = parseFloat(strcoord[0])
        let long = parseFloat(strcoord[1])
        coords.push([lat,long])
    }
    return coords;
}

//Create the Map with circles
function create_map(circle_coords){
  const nf_map = L.map('nf_area_map').setView([33.747601, -117.583927], 11);
  L.tileLayer(
    `https://tiles.wmflabs.org/hikebike/{z}/{x}/{y}.png`, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(nf_map);

  //Function that console logs the lat/long and zoom of location when clicked
  nf_map.on('click', function(e) {
    console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    console.log(nf_map.getZoom())
});
  //populate the map with circles
  for(let i = 0; i < circle_coords.length; i++){
    L.circleMarker([circle_coords[i][0], circle_coords[i][1]], {
      color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.3,
      radius: 5
    }).addTo(nf_map)
  }
  //function to move view of map
  document.getElementById('dynamic_map_nav').onclick = function(abc) {
        var pos = abc.target.getAttribute('data-position');
        var zoom = abc.target.getAttribute('data-zoom');
        if (pos && zoom) {
            var locat = pos.split(',');
            var zoo = parseInt(zoom);
            nf_map.setView(locat, zoo, {animation: true});
            return false;
        }
    }       
}



