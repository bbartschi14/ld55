import bpy
import json
import os

# Get references to the objects
bounds_bottom = bpy.data.objects.get("Bounds_Bottom")
bounds_top = bpy.data.objects.get("Bounds_Top")
player = bpy.data.objects.get("Player")
goals_collection = bpy.data.collections.get("Goals")
bats_collection = bpy.data.collections.get("Bats")

# Initialize dictionary
scene_data = {}

# Add bounds data
if bounds_bottom and bounds_top:
    scene_data["bounds"] = {
        "bottom": list(bounds_bottom.location),
        "top": list(bounds_top.location)
    }

# Add player data
if player:
    scene_data["player"] = list(player.location)

# Add goals data
if goals_collection:
    goals_data = []
    for obj in goals_collection.objects:
        goals_data.append({"position": list(obj.location)})
    scene_data["goals"] = goals_data
    
# Add bats data
if bats_collection:
    bats_data = []
    for obj in bats_collection.objects:
        bats_data.append({"position": list(obj.location), "flip": "flip" in obj.name})
    scene_data["bats"] = bats_data

# Convert dictionary to JSON
json_data = json.dumps(scene_data, indent=4)

# Print JSON data
print(json_data)

# set output path and file name (set your own)
save_path = '/Users/benbartschi/Documents/ld55/content/'
file_name = os.path.join(save_path, "export_data.json")

# write JSON file
with open(file_name, 'w') as outfile:
    outfile.write(json_data + '\n')