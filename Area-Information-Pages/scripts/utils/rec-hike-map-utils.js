
//Utility Functions to create the recommended hike maps and table
export{rec_hikes_integrated_handler}

//1. Table-making Helper Functions
function setHeader(root, headerColumns) {
  let thead = root.createTHead();
  let row = thead.insertRow();
  let id = ""
  for(let i = 0; i < headerColumns.length; i++){
    switch(i){
      case 0:
        id = "hike_name"
        break;
      case 1:
        id = "miles"
        break;
      case 2:
        id = "difficulty"
        break;
      case 3:
        id = "location"
        break;
      default:
        id = ""
        break;
  }
    let th = document.createElement("th");
    let text = document.createTextNode(headerColumns[i]);
    th.appendChild(text);
    row.appendChild(th);
    th.id = id;
  }
}
function setBody(root, data) {
  // console.log("in setBody");
  // console.log(data)
  let table = root;
  //element is one hike_data object
  //Location is a link, Class is set as Y/N, data-attribute is the latitude and longitude
  let table_row_class = "completed" //else tobehiked
  for (let element of data){
    let trow = table.insertRow();
    // console.log(element)
    let keys = Object.keys(element)
    // console.log(keys)
    for (let i = 0; i < keys.length-3; i++){
      // console.log(keys[i]);
      let tdata = trow.insertCell();
      let text = document.createTextNode(element[keys[i]]);
      if(keys[i] === "Location"){
        let a = document.createElement('a');
        a.appendChild(text);
        a.href = element[keys[i+1]];
        a.target = "_blank";
        tdata.appendChild(a);
        i++;
        continue;
      }
      tdata.appendChild(text);
    }
    if(element["Completion_Status"] == "Y"){
      trow.className = "completed"
    }
    else{
      trow.className = "incompleted";
    }
    trow.dataset.zoom = "13";
    trow.dataset.position = `${element["Latitude"]},${element["Longitude"]}`
    trow.dataset.difficulty=`${element["Difficulty"]}`
  }
}

//2. Map Creation
function create_recommended_hikes_map(hikeMarkers, map_settings){
  const accessToken = map_settings.accessToken;
  recommended_hikes_map = L.map('irvochikes').setView(map_settings.view, map_settings.zoom);
  L.tileLayer(
    `https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=${accessToken}`, {
      attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank" class="jawg-attrib">&copy; <b>Jawg</b>Maps</a> | <a href="https://www.openstreetmap.org/copyright" title="OpenStreetMap is open data licensed under ODbL" target="_blank" class="osm-attrib">&copy; OSM contributors</a>',
    }
  ).addTo(recommended_hikes_map);

    recommended_hikes_map.on('click', function(e) {
    console.log("Lat, Lon : " + e.latlng.lat + ", " + e.latlng.lng)
    console.log(recommended_hikes_map.getZoom())
});
  //Add Markers to map
  add_difficulty_th_markers(hikeMarkers)
}
//2a. Map Creation helper - add markers
function add_difficulty_th_markers(hikeMarkers){
  // Icons for the Map
  // Icon class:
  var hikerIcon = L.Icon.extend({
    options: {
      iconSize: [50, 50],
    },
  });
  var greenEasyHiker = new hikerIcon({
    iconUrl: "./images/shared/Green Hiking Guy Symbol.png",
  });
  var blueModerateHiker = new hikerIcon({
    iconUrl: "./images/shared/Lightblue Hiking Guy Symbol.png",
  });
  var orangeHardHiker = new hikerIcon({
    iconUrl: "./images/shared/Orange Hiking Guy Symbol.png",
  });
  var redStrenuousHiker = new hikerIcon({
    iconUrl: "./images/shared/Red Hiking Guy Symbol.png",
  });
  // Adding Markers (JS objects) to map
  for (let i = 0; i < hikeMarkers.length; i++) {
    if(hikeMarkers[i]["Hike Name"] == ""){
      continue;
    }
    let marker;
    switch (String(hikeMarkers[i].Difficulty)) {
      case "Easy":
        // console.log(hikeMarkers);
        marker = L.marker([hikeMarkers[i].Latitude, hikeMarkers[i].Longitude], { icon: greenEasyHiker })
          .bindPopup(hikeMarkers[i]["Hike Name"])
          .addTo(recommended_hikes_map);
        break;
      case "Moderate":
        // console.log(hikeMarkers[i][0]);
        marker = L.marker([hikeMarkers[i].Latitude, hikeMarkers[i].Longitude], {
          icon: blueModerateHiker,
        })
          .bindPopup(hikeMarkers[i]["Hike Name"])
          .addTo(recommended_hikes_map);
        break;
      case "Hard":
        // console.log(hikeMarkers[i][0]);
        marker = L.marker([hikeMarkers[i].Latitude, hikeMarkers[i].Longitude], {
          icon: orangeHardHiker,
        })
          .bindPopup(hikeMarkers[i]["Hike Name"])
          .addTo(recommended_hikes_map);
        break;
      case "Strenuous":
        // console.log(hikeMarkers[i][0]);
        marker = L.marker([hikeMarkers[i].Latitude, hikeMarkers[i].Longitude], {
          icon: redStrenuousHiker,
        })
          .bindPopup(hikeMarkers[i]["Hike Name"])
          .addTo(recommended_hikes_map);
        break;
      default:
        console.log(hikeMarkers[i], hikeMarkers[i-1])
        console.error("Default");
        break;
    }
    // console.log(marker)
    marker._icon.classList.add("marker_" + CSS.escape(String(hikeMarkers[i].Difficulty)))
    // console.log(hikeMarkers[i].Completion_Status)
    if(hikeMarkers[i].Completion_Status == "Y"){
      marker._icon.classList.add("marker_completed")
    }
    else{
      marker._icon.classList.add("marker_incompleted")
    }
  }
}

//3. Make the Table from the CSV (returns hike data objects from CSV)
async function hike_data_to_table(hike_csv, map_settings) {
  let root = document.querySelector("#hike_history_recommended")
  const response = await fetch(hike_csv);
  let data = await response.text();
  // console.log(data);
  data = String(data);
  var hike_data = Papa.parse(data, {header: true}).data;
  // console.log(hike_data)
  let alltableHeadings = Object.keys(hike_data[0]);
  // console.log(alltableHeadings)
  let tableHeadings = [];
  for(let i = 0; i < alltableHeadings.length-2; i++){
    if(i == 4 || i == 6){
      continue;
    }
    tableHeadings.push(alltableHeadings[i]);
  }

  // Populate the table
  setBody(root, hike_data);
  setHeader(root, tableHeadings);
  
  // Populate the map
  // create_recommended_hikes_map(hike_data, map_settings);
  return hike_data;
}

//Section: Table Functions (Click-sorting headers, click-zoom to TH, checkbox filtering)
function setup_table_map_functions() {
  //Set up the Click-nav Function
  click_table_map_nav();
}
//4. Set up the Sort Function (add correct event listeners)
function setup_sort_function(){
    let thead = document.querySelector("table#hike_history_recommended").children[0];
  // console.log(thead)
  let thead_row = Array.from(thead.children[0].children)
  for(let i = 0; i < thead_row.length-2; i++){
    let id = thead_row[i].id;
    let col = -1;
    let sortType = ""
    switch(id){
      case "hike_name":
        col = 0;
        sortType = 'alphabetical'
        break;
      case "miles":
        col = 1;
        sortType = "numerical";
        break;
      case "difficulty":
        col = 2;
        sortType = "difficulty"
        break;
      default:
        break;
    }
    //Add Event Listeners to Operate Sort
    let sort_hike_table = document.getElementById(id);
    let root = document.querySelector("#hike_history_recommended")
    if(sort_hike_table){
      sort_hike_table.addEventListener("click", function(){sortTable(root, col, sortType);});
    }
  }
}
//4a. Sort Function Helpers (how to sort)
function sortTable(root, colNum, sortType) {
  // console.log("starting function!");
  var table, rows, switching, i, x, y, shouldSwitch, dir;
  var switchcount = 0;
  // table = document.getElementById("hike_history_recommended");
  table = root;
  // console.log(table);

  switching = true;
  //Set the sorting direction to ascending:
  dir = "asc";
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < rows.length - 1; i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[colNum];
      y = rows[i + 1].getElementsByTagName("TD")[colNum];
      // console.log(x, y);
      /*check if the two rows should switch place,
      based on the direction, asc or desc:*/
      if (dir == "asc") {
        if (sortTypeHelper(dir, sortType, x, y)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      } else if (dir == "desc") {
        if (sortTypeHelper(dir, sortType, x, y)) {
          //if so, mark as a switch and break the loop:
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      //Each time a switch is done, increase this count by 1:
      switchcount++;
    } else {
      /*If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again.*/
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
}
function enumerateDifficulty(difficulty) {
  if (difficulty == "Easy") {
    return 1;
  } else if (difficulty == "Moderate") {
    return 2;
  } else if (difficulty == "Hard") {
    return 3;
  } else if (difficulty == "Strenuous") {
    return 4;
  } else {
    return -1;
  }
}
function sortTypeHelper(dir, sortType, x, y) {
  if (sortType == "alphabetical") {
      // console.log(x.innerHTML, y.innerHTML);
    if (dir == "asc" && x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
      return true;
    }
    if (
      dir == "desc" &&
      x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()
    ) {
      return true;
    }
  } else if (sortType == "numerical") {
    if (dir == "asc" && Number(x.innerHTML) > Number(y.innerHTML)) {
      return true;
    }
    if (dir == "desc" && Number(x.innerHTML) < Number(y.innerHTML)) {
      return true;
    }
  } else if (sortType == "difficulty") {
    // Get values and turn them into #'s to compare
    // console.log("in difficulty");
    let xdiff = enumerateDifficulty(x.innerHTML);
    let ydiff = enumerateDifficulty(y.innerHTML);
    if (xdiff == -1 || ydiff == -1) {
      console.error("Passed in wrong value in Difficulty!");
    }
    let difference = Number(xdiff) - Number(ydiff);
    // console.log(difference);
    // The actual comparison for sorting
    if (dir == "asc" && difference > 0) {
      return true;
    }
    if (dir == "desc" && difference < 0) {
      return true;
    }
  } else {
    return false;
  }
}

//5. Filter Functions
function setup_filter_function(){
  let specific_filters = Array.from(document.querySelector(".hike_rec_filters").querySelectorAll("input")).slice(1);

  setup_all_filter(specific_filters);
  
  //Add Event Listeners to each Specific Filter
  specific_filters.forEach(function(checkbox){
    let select_checkbox = document.querySelector("input[name=" + CSS.escape(checkbox.name) + "]")
    select_checkbox.addEventListener('change', function(){
      setup_specific_filters(checkbox.name);
    })
  })
}
function setup_all_filter(specific_filters){
  let all = document.querySelector("input[name=all]");
  all.addEventListener('change', function() {
    if(this.checked){
      //uncheck other checkboxes
      specific_filters.forEach(function(checkbox){
        if(checkbox.checked){
          checkbox.checked = false;
        }
      })
      //display the table elements
      let table_rows = Array.from(document.querySelector("#hike_history_recommended").querySelector("tbody").children)
      table_rows.forEach(function(tr){
        tr.style.display = "";
      })
      //reset map view and display all map markers
      // console.log(map_settings)
      recommended_hikes_map.setView(map_settings.view, map_settings.zoom);
      let markers_completed = Array.from(document.getElementsByClassName("marker_completed"))
      let markers_incompleted = Array.from(document.getElementsByClassName("marker_incompleted"))
      let markers = markers_completed.concat(markers_incompleted);
      // console.log(markers)
      markers.forEach(function(marker){
          marker.style.display = ""
        })
    }
  })
}
function setup_specific_filters(filter){
  //helps setup table/map filter. 
  //Given a filter name, checks if all is filtered or not and then filters the table and map accordingly
  let selected_elements;
  let selected_markers = Array.from(document.getElementsByClassName("marker_"+CSS.escape(filter)));
  if(filter == "completed" || filter == "incompleted"){
    selected_elements = document.querySelectorAll("." + CSS.escape(filter));
  }
  else{
    // console.log("else")
    selected_elements = document.querySelectorAll("[data-difficulty=" + CSS.escape(filter) + "]")
  }
  let checkbox = document.querySelector("input[name=" + CSS.escape(filter) +"]");
  // console.log(filter, selected_elements, checkbox)
  let all = document.querySelector("input[name=all]")
  if(all.checked){
    let table_rows = Array.from(document.querySelector("#hike_history_recommended").querySelector("tbody").children)
    //don't display unwanted elements and markers
    table_rows.forEach(function(tr){
      tr.style.display = "none"
    })
    let markers_completed = Array.from(document.getElementsByClassName("marker_completed"))
    let markers_incompleted = Array.from(document.getElementsByClassName("marker_incompleted"))
    let markers = markers_completed.concat(markers_incompleted);
    // console.log(markers)
    markers.forEach(function(marker){
        marker.style.display = "none"
      })
    all.checked = false;
  }
  if(checkbox.checked){
    //display the checked table rows
    selected_elements.forEach(function(element){
      element.style.display = "" 
    })
    //display the corresponding markers
    selected_markers.forEach(function(marker){
      marker.style.display = ""
    })
  }
  else{
    //don't display the checked table rows
    selected_elements.forEach(function(element){
      element.style.display = "none";
    })
    //don't display the corresponding markers
    selected_markers.forEach(function(marker){
      marker.style.display = "none";
    })
  }
}

//6. Move Map View when Table Elements Clicked
function setup_click_table_map_nav(){
    document.getElementById('hike_history_recommended').onclick = function(abc) {
    // console.log(abc.target.parentNode)
    let pos = abc.target.parentNode.getAttribute('data-position');
    let zoom = abc.target.parentNode.getAttribute('data-zoom');
    // console.log(pos, zoom)
    if (pos && zoom) {
        var locat = pos.split(',');
        var zoo = parseInt(zoom);
        recommended_hikes_map.setView(locat, zoo, {animation: true});
        return false;
    }
  }  
}

//main function
let recommended_hikes_map;
let map_settings;
async function rec_hikes_integrated_handler(hike_csv, given_map_settings){
  let hike_markers = await hike_data_to_table(hike_csv)
  map_settings = given_map_settings;
  create_recommended_hikes_map(hike_markers, map_settings)
  setup_sort_function();
  setup_filter_function();
  setup_click_table_map_nav();
}