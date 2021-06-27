
//Utility Functions to create elements in the quick-facts table

export{quick_facts_integrated_handler}

//Reads the CSV and selects which elements to display
async function quick_facts_integrated_handler(area_fire_level_csv, region){
  const response1 = await fetch(area_fire_level_csv);
  let forest_level = await response1.text();
  // console.log(data);
  forest_level = String(forest_level);
  let papa_forest_level = Papa.parse(forest_level);
  const response2 = await fetch("./data/fire_information_key.csv")
  let forest_level_key = await response2.text();
  forest_level_key = String(forest_level_key);
  let papa_forest_level_key = Papa.parse(forest_level_key);
//   console.log(papa_forest_level.data, papa_forest_level_key.data)
  
  let fire_level;
  switch(region){
    case "cleveland":
        fire_level = papa_forest_level.data[1][1];
        break;
    case "angeles":
        fire_level = papa_forest_level.data[2][1]
        break;
    case "san_bernardino":
        fire_level = papa_forest_level.data[3][1]
        break;
    default:
        console.error("Invalid region")
        break;
  }
  //console.log(cleveland_fire_level)
  let fire_info = fire_level_to_img(fire_level, papa_forest_level_key.data)
  //console.log(fire_info)
  
  add_fire_danger_info_image(fire_info)
}

//Helper Functions
//Given a fire level, returns corresponding image
function fire_level_to_img(fire_level, keys){
  if(fire_level == "LOW"){
    return [fire_level, keys[1][1], "./images/shared/fire_danger/Low.gif"]
  }
  if(fire_level == "MODERATE"){
    return [fire_level, keys[2][1], "./images/shared/fire_danger/Moderate.gif"]
  }
  if(fire_level == "HIGH"){
    return [fire_level, keys[3][1], "./images/shared/fire_danger/High.gif"]
  }
  if(fire_level == "VERY HIGH"){
    return [fire_level, keys[4][1], "./images/shared/fire_danger/Very High.gif"]
  }
  if(fire_level == "EXTREME"){
    return [fire_level, keys[5][1], "./images/shared/fire_danger/Extreme.gif"]
  }
}
//Adds the Image to Table
function add_fire_danger_info_image(fire_info){
    //console.log(fire_info)
    const quickFacts_table_root = document.querySelector("#fire");
    quickFacts_table_root.insertAdjacentHTML("afterbegin", ` <img src="${fire_info[2]}" alt="fire_level"/>`)
}
