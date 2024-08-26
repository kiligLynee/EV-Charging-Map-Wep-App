import { useNavigate } from 'react-router-dom';
import logo from "../../assets/logo2.svg";
import { getUserToken } from '../../utils/user-token';
import { useState } from 'react';
const InitComponent = () => {
	const navigate = useNavigate();

	const [token] = useState(() => getUserToken())

	// const token = getUserToken()

	const handleLoginClick = () => {
		navigate('/login');
	};

	const handleRegisterClick = () => {
		navigate('/register');
	};

	const handleFindClick = () => {
		navigate('/search')
		// if (token) {
		// 	navigate('/search')
		// }
	}
	return (
		<div className="flex items-center justify-center init-container mainHeight">
			<div>
				<div className="text-[#fff]">
					<img
						src={logo}
						className="w-[140px] h-[114px] mx-auto mb-[20px]"
					></img>
					{/* <div className={`px-[130px] py-[12px] bg-o-5 rounded-[22px] gradient-button-radial ${token ? ' opacity-100' : 'cursor-not-allowed opacity-50'} `} onClick={handleFindClick}> */}
					<div className={`px-[130px] py-[12px] bg-o-5 rounded-[22px] gradient-button-radial opacity-100`} onClick={handleFindClick}>
						Find Charging Station
					</div>
					<div className="flex mt-[20px] justify-between">
						<div
							className="py-[8px] rounded-[8px] flex-1 text-center cursor-pointer gradient-button-r"
							onClick={handleLoginClick}
						>
							login in
						</div>
						<div
							className="py-[8px] rounded-[8px] flex-1 ml-[8px] text-center cursor-pointer gradient-button-l"
							onClick={handleRegisterClick}
						>
							register
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
export default InitComponent