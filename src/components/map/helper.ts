import { Loader } from "@googlemaps/js-api-loader";
import { message } from "antd"

// https://developers.google.cn/maps/documentation/javascript/advanced-markers/migration?hl=zh-cn

const loader = new Loader({
	// apiKey: "AIzaSyAp97SlBUIj_PAMD08WJraRmror2mhkEYg",
	apiKey: "AIzaSyAPr0FawTyUzXs48iZYHji37mqGHJycOyY",
	version: "weekly",
	// id: "graceful-cider-430606-b8",
	// ...additionalOptions,
})

type GMapObj = {
	core: google.maps.CoreLibrary
	maps: google.maps.MapsLibrary
	places: google.maps.PlacesLibrary
	geocoding: google.maps.GeocodingLibrary
	routes: google.maps.RoutesLibrary
	marker: google.maps.MarkerLibrary
	geometry: google.maps.GeometryLibrary
	elevation: google.maps.ElevationLibrary
	streetView: google.maps.StreetViewLibrary
	journeySharing: google.maps.JourneySharingLibrary
	drawing: google.maps.DrawingLibrary
	visualization: google.maps.VisualizationLibrary
}

export type GMLibNameType = keyof GMapObj

export type GMLibType<key extends GMLibNameType> = GMapObj[key]

// type T = GMLibType<'core'>

export const getGMapLibrary = async (keyArr: GMLibNameType[]) => {
	const arr = []
	const len = keyArr.length
	for (let i = 0; i < len; i++) {
		arr.push(loader.importLibrary(keyArr[i]))
	}
	return await Promise.all(arr)
}

export const getLatLngFromBrowser = () => {
	return new Promise((resolve, reject) => {
		if (navigator.geolocation) {
			//
			navigator.geolocation.getCurrentPosition(
				(position: GeolocationPosition) => {
					console.log("-----position: ", position)

					const center = {
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					}

					resolve(center)
				},
				() => {
					console.log("----getLatLngFromBrowser failed")
					message.error(
						"Please refresh your browser to get your current location again !"
					)

					reject("----getLatLngFromBrowser failed")
				}
			)
		}
	})
}

