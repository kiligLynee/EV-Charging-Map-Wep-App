import logo from "../../assets/logo1.svg";

export const ModuleNavigetion = () => {
	return (
		<div>
			<div className="w-full h-[60px] bg-o-5">
				<div className="px-[20px] w-[400px] flex">
					<img
						src={logo}
						className="w-[60px] h-[40px] mt-[10px]"
					></img>
					<span className="font-bold color-white text-[26px] text-white">Charging Station Finder</span>
				</div>
			</div>
		</div>
	);
};
