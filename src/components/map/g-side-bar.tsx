import { FC, memo, useMemo, useState } from "react"
import closePng from "../../assets/close.png"
import upPng from "../../assets/up.png"
import bluePng from "../../assets/position/blue.png"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil"
import {
  activePoiState,
  allPoiState,
  isShowActivePoiState,
} from "../../store/atoms/poiAtom"
import { PoiType } from "../../pages/search/types"
import { getNum } from "../../pages/search/helpers"

const ModuleDetail: FC<{ poi: PoiType }> = ({ poi }) => {
  const setActivePoi = useSetRecoilState(activePoiState)
  return (
    <div className="bg-o-2  rounded-[0.5em] mt-[10px] p-[6px] flex">
      <div className="w-[16%] flex items-center justify-center" onClick={() => setActivePoi(poi)}>
        <img
          src={bluePng}
          className="w-[18px] h-[27px]"
        ></img>
      </div>
      <div className="w-[84%]">
        <div className="flex justify-between">
          <div className="font-16 font-medium text-[red]">{poi.AddressInfo.Title}</div>
          <div className="font-12 text-opacity-90">{`${getNum(poi.AddressInfo.Distance)} ${poi.AddressInfo.DistanceUnit === 2 ? 'km' : 'miles'}`}</div>
        </div>
        <div className="font-16 mt-[8px]">
          {poi!.AddressInfo.AddressLine1} {poi!.AddressInfo.Town} {poi!.AddressInfo.StateOrProvince}
        </div>
      </div>
    </div>
  )
}
const Panel = ({ connection }: { connection: PoiType['Connections'][0] | undefined }) => {
  const [isOpen, setIsOpen] = useState(false)
  const togglePanel = () => {
    setIsOpen(!isOpen)
  }
  return (
    <div className="bg-[#fff] p-4 mt-[10px] rounded-[0.5em]">
      <div
        className="flex cursor-pointer text-[14px]"
        onClick={togglePanel}
      >
        <img
          className={`w-[20px] h-[20px] rotate-icon ${isOpen ? "rotate-180" : ""
            }`}
          src={upPng}
        ></img>
        <div className="ml-[6px] flex justify-between text-[12px]"><span className="mr-[20px] font-bold">{`${connection?.PowerKW}KW`}</span> <span>{connection?.ConnectionType.Title}</span><span className="pl-[6px]">{connection?.Quantity} / {connection?.Quantity}</span></div>
      </div>
      {isOpen && (
        <div className="bg-o-2  rounded-[0.5em] mt-[10px] p-[6px] flex" >
          <div>
            <div className="text-[14px] mt-[8px] flex">
              <span>
                {
                  connection?.Reference
                }
              </span>
            </div>
            <div className="text-[14px] mt-[8px]">
              {
                connection?.Level.Title
              }
            </div>
            <div className="text-[14px] mt-[8px]">
              {
                connection?.StatusType?.IsOperational ? 'Available' : 'Occupied'
              }
            </div>
            <div className="text-[14px] mt-[8px]">
              {
                connection?.ChargePrice ? `£${connection?.ChargePrice}/kwh` : null
              }
            </div>
          </div>
        </div>

      )}
    </div>
  )
}

const Sidebar = memo(() => {
  const pois =
    useRecoilValue(allPoiState)
  const [isShowActivePoi, setIsShowActivePoi] =
    useRecoilState(isShowActivePoiState)
  const [activePoi, setActivePoi] = useRecoilState(activePoiState)

  const nearByPOIs = useMemo(() => {
    return pois.slice(0, 3)
  }, [pois])


  const onClose = () => {
    setIsShowActivePoi(false)
    setActivePoi(null)
  }

  if (!isShowActivePoi) return null

  return (
    <div
      className={`fix-side-bar fixed top-[70px] left-[35px] bottom-[78px] w-[413px] rounded-[15px] overflow-y-auto  bg-[transparent] transition-all duration-300 ease-in-out ${isShowActivePoi ? "translate-x-0" : "-translate-x-full"
        } `}
    >
      {/* side bar content */}
      <div className=" bg-o-2 p-[15px]">
        {/* the first part: the name of charging station */}
        <div className="px-[16px] py-[35px] rounded-[0.5em] bg-[#fff] relative">
          <div className="font-bold text-[22px]">
            {activePoi!.AddressInfo.Title}
          </div>
          <div className="text-[18px]">
            {activePoi!.AddressInfo.AddressLine1} {activePoi!.AddressInfo.Town} {activePoi!.AddressInfo.StateOrProvince}
          </div>
          {activePoi!.AddressInfo.AddressLine2 ? (
            <div className="font-bold text-[22px]">
              {activePoi!.AddressInfo.AddressLine2 as unknown as string}  {activePoi!.AddressInfo.Town} {activePoi!.AddressInfo.StateOrProvince}
            </div>
          ) : null}
          <img
            onClick={onClose}
            src={closePng}
            className="w-[30px] h-[30px] absolute right-[10px] top-[10px] cursor-pointer rotate-btn"
          ></img>
        </div>
        {/* the second part: The fastest way to power up*/}
        <div className="px-[16px] py-[18px] my-[10px] rounded-[0.5em] bg-[#fff] relative">
          <div className="font-bold text-[22px]">
            Charging point
          </div>

          {
            activePoi?.Connections.map((c, idx) => (

              <Panel connection={c} key={idx} />
            ))
          }
        </div>
        {/* the four part: combination recommendation */}
        <div className="bg-[#fff] p-4 mt-[10px] rounded-[0.5em]">
          <div className="font-bold text-[22px]">
            Charging Stations Nearby
          </div>
          {nearByPOIs.map((poi) => (
            <ModuleDetail poi={poi} key={poi.UUID} />
          ))}
        </div>
      </div>
    </div>
  )
})

export default Sidebar
