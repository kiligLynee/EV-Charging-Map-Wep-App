import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { GMap } from "../../components/map/g-map";
import { userInfoState, userVehicleBatteryCapacityState, userVehicleChargingPortTypeState } from "../../store";
import { Button, Form, Input, message, Modal, Select } from "antd";
import { useMemo, useState } from "react";
import { calculateTotalcost, calculateTotalTime, findPoiByUUID, genChargePrice, generateChargingPrice, generateRandomDivisibleBy5, getNearByPOI, getNum, haversine_distance, km2miles, Point } from "./helpers";
import { getLatLngFromBrowser } from "../../components/map/helper";
import { PoiType } from "./types";
import { activePoiState, allPoiState, isShowActivePoiState } from "../../store/atoms/poiAtom";
import { currentLevelState, desiredLevelState } from "../../store/atoms/batteryLevel";
import { maxBy, minBy } from "es-toolkit";
const SearchPage = () => {
	const { Option } = Select;

	const [userInfo] = useRecoilState(userInfoState);
	const [pois, setPois] = useRecoilState(allPoiState);
	const [currentLevel, setCurrentLevel] = useRecoilState(currentLevelState);
	const [desiredLevel, setDesiredLevel] = useRecoilState(desiredLevelState);
	const userVehicleChargingPorttype = useRecoilValue(userVehicleChargingPortTypeState)
	const userVehicleBatteryCapacity = useRecoilValue(userVehicleBatteryCapacityState)
	const setActivePoi = useSetRecoilState(activePoiState);
	const setIsShowActivePoi = useSetRecoilState(isShowActivePoiState);
	const [isAuthorizedGeo, setIsAuthorizedGeo] = useState(false)
	// const [isAuthorizedGeo, setIsAuthorizedGeo] = useState(true)
	const [center, setCenter] = useState<Point>()

	const [isModalOpen1, setIsModalOpen1] = useState(true)
	// const [isModalOpen1, setIsModalOpen1] = useState(false)
	const [isModalOpen2, setIsModalOpen2] = useState(false)
	const [isModalOpen3, setIsModalOpen3] = useState(false)
	console.log("---userInfo: ", userInfo);


	const onModal1Cancel = () => {
		// setActivePoi(null)
		// setIsShowActivePoi(false)
		setIsModalOpen1(false)
	}

	const onModal2Cancel = () => {
		setIsModalOpen2(false)
	}

	const handleEstimateClick = () => {
		if (!currentLevel || !desiredLevel) {
			message.warning('Please enter the percentage value of the current power and target power !')
			return
		}
		if (currentLevel > desiredLevel) {
			message.warning('currentLevel can not greater than desiredLevel, Please check and correct the number')
			return
		}
		onModal2Cancel()
		setIsModalOpen3(true)
	}

	const onCurrentLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('-------onCurrentLevelChange: ', e.target.value);
		setCurrentLevel(Number(e.target.value))

	}
	const onDesiredLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log('-------onDesiredLevelChange: ', e.target.value);
		setDesiredLevel(Number(e.target.value))
	}


	const onModal3Cancel = () => {
		setIsModalOpen3(false)
	}


	const onChange = (value: string) => {
		console.log('------value:', value);
		// debugger
		const poi = findPoiByUUID(pois, value)
		if (poi) {
			setActivePoi(poi)
			setIsShowActivePoi(true)
			onModal3Cancel()
			onModal2Cancel()
			onModal1Cancel()
		}
	}


	const getCenter = async () => {
		try {
			const c = await getLatLngFromBrowser() as Point
			console.log('-----getCenter------c: ', c);

			setCenter(c)

			getAllPOIs(c)
		} catch (error) {
			console.log('---------getCenter error: ', error);

		}
	}

	const getAllPOIs = async (center: Point) => {
		try {
			const res = await getNearByPOI(center)
			// console.log('---getAllPOIs--search res: ', res);
			if (res.status === 200) {
				const data = res.data as Array<PoiType>
				const len = data.length || 0
				for (let i = 0; i < len; i++) {
					const poi = data[i]
					// calculate distance
					if (poi.AddressInfo.DistanceUnit === 0) {
						poi.AddressInfo.Distance = haversine_distance({ lat: center.lat, lng: center.lng }, { lat: poi.AddressInfo.Latitude, lng: poi.AddressInfo.Longitude })
						poi.AddressInfo.DistanceUnit = 1 // miles
					}

					// 统一单位为 miles
					if (poi.AddressInfo.DistanceUnit === 2) {
						poi.AddressInfo.Distance = km2miles(poi.AddressInfo.Distance)
						poi.AddressInfo.DistanceUnit = 1
					}

					// Mock conection power rate if not exists
					const Connections = poi.Connections
					for (let i = 0; i < Connections.length; i++) {
						const conection = Connections[i]
						if (conection.PowerKW === null) {
							conection.PowerKW = generateRandomDivisibleBy5()
						}
					}

					// generate charge price
					poi.Connections = poi.Connections.sort((a, b) => a.PowerKW! - b.PowerKW!)

					for (let i = 0; i < Connections.length; i++) {
						const conection = Connections[i]
						if (i === 0) {
							conection.ChargePrice = generateChargingPrice()
						} else {
							conection.ChargePrice = genChargePrice(Connections[i - 1].ChargePrice)
						}
					}

					poi.LowestChargePrice = minBy(poi.Connections, (connection) => connection.ChargePrice!).ChargePrice

					poi.HightChargePrice = maxBy(poi.Connections, (connection) => connection.ChargePrice!).ChargePrice

					poi.LowestPowerKW = minBy(poi.Connections, (connection) => connection.PowerKW!).PowerKW!

					poi.HightPowerKW = maxBy(poi.Connections, (connection) => connection.PowerKW!).PowerKW!

					poi.FastedChargeTime = 0
					poi.CheapestChargeCost = 0
					poi.BestChargeCost = 0
					poi.BestChargeTime = 0
				}
				// debugger
				setPois(data)
				setIsAuthorizedGeo(true)
			}

		} catch (error) {
			console.log('-----getAllPOIs----error: ', error);
		}
	}

	const nearestPois = useMemo(() => {
		// return pois.map((poi) => { poi.AddressInfo.Distance = poi.AddressInfo.Distance * kmMilsRate; return poi}).filter((poi) => {poi.AddressInfo.Distance <= 3}).reduce((ret, poi) => {
		// return pois.reduce((ret, poi) => {
		// 	// console.log('----poi: ', poi);

		// 	if (ret.length === 0) {
		// 		ret = [poi]
		// 	} else if (ret[0].AddressInfo.Distance > poi.AddressInfo.Distance) {
		// 		ret[0] = poi
		// 	}

		// }, [] as Array<PoiType>)
		return [minBy(pois, (poi) => poi.AddressInfo.Distance)]
		// return pois.fi
	}, [pois])

	const nearby3MilesCheapestPois = useMemo(() => {
		// 过滤并选择 附近 3 miles 内的充点电
		const poisInNearest3miles = pois.filter(poi => poi.AddressInfo.Distance <= 3)
		// debugger
		return poisInNearest3miles.length ? [minBy(poisInNearest3miles, (poi) => poi.LowestChargePrice!)] : []

	}, [pois])

	const poisOfInterfaceCompatible = useMemo(() => {
		if (!userVehicleChargingPorttype) {
			return pois
		} else {
			return pois.filter((poi) => poi.Connections.some((connection) => connection.ConnectionType.Title === 'CHAdeMO' || connection.ConnectionType.Title.includes(userVehicleChargingPorttype)))
		}
	}, [pois, userVehicleChargingPorttype])

	// 这里假设功率最高即为充电最快
	const fastestPois = useMemo(() => {
		// return pois.reduce((ret, poi) => {
		// 	if (ret.length === 0) {
		// 		ret = [poi]
		// 	} else if (ret[0].AddressInfo.Distance > poi.AddressInfo.Distance) {
		// 		ret[0] = poi
		// 	}

		// 	return ret
		// }, [] as Array<PoiType>)
		// https://es-toolkit.slash.page/zh_hans/reference/array/maxBy.html

		if (poisOfInterfaceCompatible.length) {
			const maxPowerPoi = maxBy(poisOfInterfaceCompatible, (poi) => poi.HightPowerKW!)
			// maxPowerPoi.FastedChargeTime = calculateTotalTime(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, maxPowerPoi.HightPowerKW!)
			const FastedChargeTime = calculateTotalTime(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, maxPowerPoi.HightPowerKW!)
			return [{ ...maxPowerPoi, FastedChargeTime }]
		} else {
			return []
		}
	}, [poisOfInterfaceCompatible, currentLevel, desiredLevel, userVehicleBatteryCapacity])


	// 单价最便宜即为最便宜
	const cheapestPois = useMemo(() => {
		// return pois.reduce((ret, poi) => {
		// 	if (ret.length === 0) {
		// 		ret = [poi]
		// 	} else if (ret[0].ChargePrice! > poi.ChargePrice!) {
		// 		ret[0] = poi
		// 	}

		// 	return ret
		// }, [] as Array<PoiType>)
		if (poisOfInterfaceCompatible.length) {
			const cheapestPoi = minBy(poisOfInterfaceCompatible, (poi) => poi.LowestChargePrice!)
			// cheapestPoi.CheapestChargeCost = calculateTotalcost(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, cheapestPoi.LowestChargePrice!)
			const CheapestChargeCost = calculateTotalcost(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, cheapestPoi.LowestChargePrice!)
			return [{ ...cheapestPoi, CheapestChargeCost }]
		}

	}, [poisOfInterfaceCompatible, currentLevel, desiredLevel, userVehicleBatteryCapacity])

	// 这里其实会用到 车型 电池容量 直线距离 计算排序权值 
	const bestPois = useMemo(() => {
		// return pois.reduce((ret, poi) => {
		// 	if (ret.length === 0) {
		// 		ret = [poi]
		// 	} else if (ret[0].AddressInfo.Distance > poi.AddressInfo.Distance) {
		// 		ret[0] = poi
		// 	}

		// 	return ret
		// }, [] as Array<PoiType>)
		// 过滤并选择 附近 3 miles 内的充点电
		// const poisInNearest3miles = poisOfInterfaceCompatible.filter(poi => poi.AddressInfo.Distance <= 3)
		const clonedPoisOfInterfaceCompatible: PoiType[] = JSON.parse(JSON.stringify(poisOfInterfaceCompatible))
		const sortedPois = clonedPoisOfInterfaceCompatible.sort((a, b) => a.HightPowerKW! * 0.5 + calculateTotalcost(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, a.LowestChargePrice!) * 0.5 - (b.HightPowerKW! * 0.5 + calculateTotalcost(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, b.LowestChargePrice!) * 0.5))

		const len = sortedPois.length
		const pois = len <= 3 ? sortedPois : sortedPois.slice(0, 2)

		const caledPois: PoiType[] = []

		for (let i = 0; i < pois.length; i++) {
			const poi = pois[i];
			const BestChargeCost = calculateTotalcost(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, poi.HightChargePrice!)
			const BestChargeTime = calculateTotalTime(userVehicleBatteryCapacity, currentLevel!, desiredLevel!, poi.HightPowerKW!)
			caledPois.push({
				...poi,
				BestChargeCost,
				BestChargeTime
			})
		}

		return caledPois
	}, [poisOfInterfaceCompatible, currentLevel, desiredLevel, userVehicleBatteryCapacity])

	// useEffect(() => {

	// 	// getAllPOIs()
	// }, [])


	return (
		<div className="relative w-full overflow-hidden mainHeight">
			{
				!isAuthorizedGeo ? (
					<div className="w-[400px] mx-auto leading-[2em] mt-[50px]">
						<div className="mb-[20px]">
							We need your authorization in order to get your current geographical location. If you want to continue, please click the OK button to get the position. If the browser has a prompt authorization, please click to run.
						</div>

						<div>

							<Button onClick={getCenter}>ok</Button>
						</div>
					</div>
				) : (

					<>
							<GMap center={center!} pois={pois} />

						{/* modal 1 */}

							{
								isModalOpen1 && (
									<Modal
										title={
											<div className="h-[44px] bg-[#ff764c]"></div>
										}
										open={isModalOpen1}
										onCancel={onModal1Cancel}
										centered
										className='modal-set-styl'
										footer={null}
										maskClosable={false}

									>
										<div className="h-[60px]" />
										<Form
											name="charge_estimate1"
											layout="vertical"
											size="large"
										>
											<Form.Item
											>
												{/* {
													JSON.stringify(nearestPois)
												} */}
												<Select
													placeholder="Shortest Distance"
													onChange={onChange}
													allowClear
												>
													{
														nearestPois.map((poi) => (
															<Option value={poi.UUID} key={poi.UUID}>
																<div>
																	<span>{poi.AddressInfo.Title}</span>
																	<span className="ml-[50px]">{`${getNum(poi.AddressInfo.Distance)} miles`}</span>
																	<span className="ml-[50px]">{poi.Connections.map(c => c.ConnectionType.Title).join('、')}</span>
																</div>
															</Option>
														))
													}
												</Select>
											</Form.Item>
											<Form.Item
											>
												<Select
													placeholder="Lowest Price"
													onChange={onChange}
													allowClear
												>
													{
														nearby3MilesCheapestPois.map((poi) => (
															<Option value={poi.UUID} key={poi.UUID}>
																<div>
																	<span>{poi.AddressInfo.Title}</span>
																	<span className="ml-[50px]">{`${getNum(poi.AddressInfo.Distance)} miles`}</span>
																	<span className="ml-[50px]">{poi.Connections.map(c => c.ConnectionType.Title).join('、')}</span>
																</div>
															</Option>
														))
													}
												</Select>
											</Form.Item>
											<Form.Item
											>
												<Button onClick={() => setIsModalOpen2(true)}>Recommended</Button>
											</Form.Item>
										</Form>
									</Modal>
								)
							}

						{/* modal 2 */}
							<Modal
								title={
									<div className="h-[44px] leading-[44px] pl-[2em] text-white bg-[#ff764c]">
										Please enter the battery level
									</div>
								}
								open={isModalOpen2}
								onCancel={onModal2Cancel}
								centered
								className='modal-set-styl'
								footer={
									<div className="h-[64px] mr-[30px] mb-[30px]">
										<Button size="large" onClick={handleEstimateClick}>Estimate</Button>
									</div>
								}
								maskClosable={false}

							>
								<div className="h-[60px]" />
								<Form
									name="charge_estimate2"
									layout="vertical"
									size="large"
								>
									<Form.Item
										name="currentLevel"
									>
										<Input value={currentLevel}
											onChange={onCurrentLevelChange} placeholder="Enter your current battery level(%)" />
									</Form.Item>
									<Form.Item
										name="desiredLevel"
									>
										<Input value={desiredLevel}
											onChange={onDesiredLevelChange} placeholder="Enter your desired battery level(%)" />
									</Form.Item>
								</Form>
							</Modal>

						{/* modal 3 */}
							<Modal
								title={
									<div className="h-[44px] bg-[#ff764c]"></div>
								}
								onCancel={onModal3Cancel}
								open={isModalOpen3}
								centered
								className='modal-set-styl'
								footer={null}
								maskClosable={false}
								width={860}

							>
								<Form
									name="charge_estimate3"
									layout="vertical"
									size="large"
									labelCol={{ span: 24 }}
								>
									<Form.Item
										label="Fastest Charging"
									>
										<Select
											onChange={onChange}
											allowClear
										>
											{
												fastestPois.map((poi) => (
													<Option value={poi.UUID} key={poi.UUID}>
														<div>
															<span>{poi.AddressInfo.Title}</span>
															<span className="ml-[50px]">{`${getNum(poi.AddressInfo.Distance)} miles`}</span>
															<span className="ml-[50px]">{poi.Connections.map(c => c.ConnectionType.Title).join('、')}</span>
															<span className="ml-[50px]">{`${poi.FastedChargeTime} h`}</span>
														</div>
													</Option>
												))
											}
										</Select>
									</Form.Item>
									<Form.Item
										label="Cheapest Charging"
									>
										<Select
											onChange={onChange}
											allowClear
										>
											{
												Array.isArray(cheapestPois) && cheapestPois.map((poi) => (
													<Option value={poi.UUID} key={poi.UUID}>
														<div>
															<span>{poi.AddressInfo.Title}</span>
															<span className="ml-[50px]">{`${getNum(poi.AddressInfo.Distance)} miles`}</span>
															<span className="ml-[50px]">{poi.Connections.map(c => c.ConnectionType.Title).join('、')}</span>
															<span className="ml-[50px]">{`£${poi.CheapestChargeCost}`}</span>
														</div>
													</Option>
												))
											}
										</Select>
									</Form.Item>
									<Form.Item
										label="Best Option"
									>
										<Select
											onChange={onChange}
											allowClear
										>
											{
												bestPois.map((poi) => (
													<Option value={poi.UUID} key={poi.UUID}>
														<div>
															<span>{poi.AddressInfo.Title}</span>
															<span className="ml-[25px]">{`${getNum(poi.AddressInfo.Distance)} miles`}</span>
															<span className="ml-[25px]">{poi.Connections.map(c => c.ConnectionType.Title).join('、')}</span>
															<span className="ml-[25px]">{`${poi.BestChargeTime} h`}</span>
															<span className="ml-[25px]">{`£${poi.BestChargeCost}`}</span>
														</div>
													</Option>
												))
											}
										</Select>
									</Form.Item>
								</Form>
							</Modal>
					</>
				)
			}
		</div >
	);
};
export default SearchPage;
