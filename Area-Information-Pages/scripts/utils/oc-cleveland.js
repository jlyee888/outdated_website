//Section 1: Creating the Recommended Hikes Map and Table
import * as hike_util from "../utils/rec-hike-map-utils.js"

function rec_hike_main(){
  const map_settings = {
  accessToken : '4J8ApXJWJxduAEGWuzk3qeHhBhxd0XYV2atucG0GIhHvFtenQYpG7251lmXj870h',
  view : [33.69876827306971, -117.68526705605565],
  zoom : 10
  }
  let hike_csv = "./data/cleveland-oc-hikes.csv"
  let recommended_hikes_map;
  let root = document.querySelector("#hike_history_recommended")
  // hike_util.create_recommended_hikes_map(hikeMarkers, map_settings)
  // hike_util.hike_data_to_table(hike_csv, map_settings);
  // hike_util.setup_table_map_functions(hike_csv, map_settings)
  hike_util.rec_hikes_integrated_handler(hike_csv, map_settings)
}

rec_hike_main();

import * as quick_facts_util from "./quick-facts-utils.js"

function quick_facts_main(){
  let area_fire_level_csv = "./data/area_fire_information.csv"
  let region = "cleveland"
  quick_facts_util.quick_facts_integrated_handler(area_fire_level_csv, region);
}
quick_facts_main();

import * as nf_area_map from "./nf-area-map-utils.js"

function area_map_main(){
  let interest_points_csv = "./data/cleveland-map-nav.csv"
  nf_area_map.nf_area_map_handler(interest_points_csv)
}
area_map_main()