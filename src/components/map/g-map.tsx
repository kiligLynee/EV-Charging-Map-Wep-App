// import { Loader } from "@googlemaps/js-api-loader";
// import { useState, useRef, memo, FC } from 'react';
import { memo, FC } from 'react';
import { getGMapLibrary, GMLibType } from "./helper";
// import mapStyles from './g-map-styles.json';
import Sidebar from './g-side-bar'; 
import './g-map.css'
// import { locations } from './locations';
import pilePng from '../../assets/position/yellow.png'
import bluePng from '../../assets/position/blue.png'
import greenPng from '../../assets/position/green.png'
import { Point } from '../../pages/search/helpers';
import { useSetRecoilState } from 'recoil';
import { activePoiState, isShowActivePoiState } from '../../store/atoms/poiAtom';
import { PoiType } from '../../pages/search/types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
let map: google.maps.Map;
const pngList = [pilePng, bluePng, greenPng];
export const GMap: FC<{ center: Point, pois: PoiType[] }> = memo(({ center, pois }) => {
	// const [sidebarVisible, setSidebarVisible] = useState(false);
	// const [sidebarVisible, setSidebarVisible] = useState(true);

	const setActivePoi = useSetRecoilState(activePoiState)
	const setIsShowActivePoi = useSetRecoilState(isShowActivePoiState)

	getGMapLibrary(["maps", "marker"]).then(
		async ([MapsLibrary, MarkerLibrary]) => {

			const { Map } = MapsLibrary as GMLibType<"maps">;
			const { AdvancedMarkerElement} =
				MarkerLibrary as GMLibType<"marker">;
			
			// const center = { lat: 37.4239163, lng: -122.0947209 };
			const mapProp3 ={
				center,
				zoom: 14,
				// styles: mapStyles,
				// mapId: "61d942ecaf9c7a6f",
				mapId: "4e7afe5b3b45290c",
				disableDefaultUI: true,
			} ;
			map = new Map(document.getElementById("map") as HTMLElement, mapProp3);
			// loop create tag
			// debugger
			pois.forEach((poi, index) => {
				const { AddressInfo } = poi
				const location = { lat: AddressInfo.Latitude, lng: AddressInfo.Longitude }
				// 创建一个自定义img图标元素
				const customIcon = document.createElement("img");
				customIcon.src = pngList[(index + 1) % 3];
				customIcon.className = 'marker-icon'
				const marker = new AdvancedMarkerElement({
					map,
					position: location,
					gmpClickable: true,
					gmpDraggable: false,
					content: customIcon,
					title: AddressInfo.Title,
				});
				marker.addListener('click', ({ domEvent, latLng }: any) => {
					// setSidebarVisible(true);
					console.log("--click: ", domEvent, latLng.lat(), latLng.lng());
					console.log('----poi: ', poi);
					setActivePoi(poi)
					setIsShowActivePoi(true)
				});
			});
		}
	);
	return (
		<div>
			<div
				id="map"
				className="w-full mainHeight"
			></div>
			{/* 添加侧边栏 */}
			<Sidebar />
		</div>
	);
});
