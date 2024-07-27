import geopandas as gpd
from shapely.geometry import Point
import time
import json

start_time = time.time()

def find_region(file_name, latitude, longitude):
    # Create a point from the given latitude and longitude
    geojson_gdf = gpd.read_file(file_name)
    point = Point(longitude, latitude)
    
    # Perform the point-in-polygon test
    for _, row in geojson_gdf.iterrows():
        if row['geometry'].contains(point):
            return row['name']  # Assuming the state name is stored in the 'name' column
    
    return "State not found"



def revGeoCoding(lat,lng):
# Find the state for the given coordinates
    country = find_region('countries.geojson', lat, lng)
    state =   find_region('India.geojson', lat, lng)

    result = {"state": state , "country": country}
    print(result)
    print( time.time() - start_time)
    return result

# Coordinates to be checked
# latitude = 12.5
# longitude = 75.5

# revGeoCoding(latitude,longitude)

def flatten_coords(nested_coords):
    flattened = []
    
    def flatten(current):
        if isinstance(current[0], list):
            for item in current:
                flatten(item)
        else:
            flattened.append(current[1])
    
    flatten(nested_coords)
    return flattened

def find_extremes():

    with open('India.geojson', 'r') as file:
        data = json.load(file)

        for row in data['features']:
            complex_polygon_coords = row['geometry']['coordinates']
            name = row['properties']['name']

            # Flatten the list of lists into a single list of tuples
            # flattened_coords = [coord for sublist in complex_polygon_coords for coord in sublist]
            latitudes = flatten_coords(complex_polygon_coords)

            # print(len(flattened_coords))
            # # Extract latitudes
            # latitudes = [coord[0] for coord in flattened_coords]

            # # Find the top-most (maximum latitude) and bottom-most (minimum latitude)
            top_most_lat = max(latitudes)
            bottom_most_lat = min(latitudes)
            # print(name)
            print(top_most_lat, bottom_most_lat)


# find_extremes()
