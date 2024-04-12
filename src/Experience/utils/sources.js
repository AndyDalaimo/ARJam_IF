export default 
[
	{
		name : "assets3D", // Unique Name for each Asset
		type : "gltfModel", // To know which loader to use
		path :
        [
        	// Create a URL which points to the asset we wish to load in the project file structure
        	new URL( "../../../assets/Models/UK_Map.glb", import.meta.url ).href
        ]
	},
	{
		name : "earthTest3D",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/Earth.glb", import.meta.url ).href
		]
	},
	{
		name : "hotspot01",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/Plant.glb", import.meta.url ).href
		]
	},
	{
		name : "hotspot02",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/Whale.glb", import.meta.url ).href
		]
	},
	{
		name : "hotspot03",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/Smog.glb", import.meta.url ).href
		]
	},
	{
		name : "forestText",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/ForestFactsglb.glb", import.meta.url ).href
		]
	},
	{
		name : "beachText",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/OceanText.glb", import.meta.url ).href
		]
	},
	{
		name : "airText",
		type : "gltfModel",
		path :
		[
			new URL( "../../../assets/Models/OzoneFactsglb.glb", import.meta.url ).href
		]
	},
	{
		name : "TapToPlace_sound",
		type : "audio",
		path :
        [
        	new URL( "../../../assets/Audio/TapToPlace_v2.mp3", import.meta.url ).href
        ]
	},
];