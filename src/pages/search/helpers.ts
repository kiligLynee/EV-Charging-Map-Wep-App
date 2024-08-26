import axios from 'axios'
import { PoiType } from './types'

// export const API_URL = 'https://api.openchargemap.io/v3/poi?output=json&maxresults=200&key=f2d7fb97-c081-4ad6-9ee7-8790b462aa9e&compact=false&verbose=true&latitude=38.606404971723414&longitude=-121.53161944335412'
// export const API_URL = 'https://api.openchargemap.io/v3/poi?output=json&maxresults=200&key=f2d7fb97-c081-4ad6-9ee7-8790b462aa9e&compact=false&verbose=true&distanceunit=miles'
export const API_URL = 'https://api.openchargemap.io/v3/poi?output=json&maxresults=200&key=f2d7fb97-c081-4ad6-9ee7-8790b462aa9e&compact=false&verbose=true'

export const getNearByPOI = async (center: Point, distance = 100) => {
    //university of london(Default coordinate)
    // 51.524759429107476, -0.13430832327758296
    // 51.52458590102291, -0.13416884602822285
    let latAndLngStr = 'latitude=51.524759429107476&&longitude=-0.13430832327758296'

    if (Object.keys(center).length === 2) {
        latAndLngStr = `latitude=${center.lat}&longitude=${center.lng}`
    }
    const url = `${API_URL}&${latAndLngStr}&distance=${distance}`
    return await axios.get(url)
    // return await axios.get(API_URL)
}

export type Point = { lat: number, lng: number }

// https://mapsplatform.google.com/resources/blog/how-calculate-distances-map-maps-javascript-api/
export const haversine_distance = (p1: Point, p2: Point) => {
    // debugger
    const R = 3958.8; // Radius of the Earth in miles
    const rlat1 = p1.lat * (Math.PI / 180); // Convert degrees to radians
    const rlat2 = p2.lat * (Math.PI / 180); // Convert degrees to radians
    const difflat = rlat2 - rlat1; // Radian difference (latitudes)
    const difflon = (p2.lng - p1.lng) * (Math.PI / 180); // Radian difference (longitudes)

    const d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)));
    return Math.abs(d);
}

export const getNum = (n: number) => {
    return Math.round(n * 100) / 100
}

export const findPoiByUUID = (pois: Array<PoiType>, id: string) => {
    return pois.find(poi => poi.UUID === id)
}

export const generateChargingPrice = () => {
    // Define the base tariff (in GBP/KWH)
    const basePrice = 0.15; //Assume a base price of £0.15 / KWH, which can be adjusted by region

    // 定义波动范围（基础电价的±20%）
    const fluctuationRange = 0.2;

    // 获取当前时间
    const currentTime = new Date();

    // 根据时间段调整电价（假设晚上10点到早上6点为低价时段）
    let timeFactor;
    const hour = currentTime.getHours();
    if (hour >= 22 || hour < 6) {
        timeFactor = 0.9; // 低价时段，价格降低10%
    } else {
        timeFactor = 1.1; // 高峰时段，价格增加10%
    }

    // 生成一个随机的波动因子
    const fluctuation = Math.random() * (2 * fluctuationRange) - fluctuationRange;

    // 最终的电价计算
    let finalPrice = basePrice * (1 + fluctuation) * timeFactor;

    // 保留两位小数
    finalPrice = Number(finalPrice.toFixed(4));

    return finalPrice;
}

export const genChargePrice = (base: number = -1) => {
    let price = 0
    do {
        price = generateChargingPrice()
    } while (price < base);
    return price
}

export const generateRandomDivisibleBy5 = () => {
    let randomNumber;
    do {
        randomNumber = Math.floor(Math.random() * (120 - 45 + 1) + 45);
    } while (randomNumber % 5 !== 0);
    return randomNumber;
}

// km to miles     1km = 0.62137119 miles

export const km2miles = (km: number) => km * 0.62137119

// calculate total cost
export const calculateActualNeededEnergy = (capacity: number, currentLevel: number, desiredLevel: number) => {
    const RATE = 0.95
    const neededEnergy = capacity * (desiredLevel - currentLevel) / 100

    return neededEnergy / RATE
}

export const calculateTotalcost = (capacity: number, currentLevel: number, desiredLevel: number, price: number) => {
    const actualNeededEnergy = calculateActualNeededEnergy(capacity, currentLevel, desiredLevel)

    return Math.round(actualNeededEnergy * price * 100) / 100
}


export const calculateTotalTime = (capacity: number, currentLevel: number, desiredLevel: number, power: number) => {
    const actualNeededEnergy = calculateActualNeededEnergy(capacity, currentLevel, desiredLevel)

    return Math.round(actualNeededEnergy / power * 100) / 100
}