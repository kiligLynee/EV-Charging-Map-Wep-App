import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import { ModuleNavigetion } from "../components/top-bar/module-navigation";
import { usePermission } from "../router/usePermission";
// import Logo from "../../components/logo/Logo"
// import UserInfo from "../../components/user-info/UserInfo"
// import useLoadUserInfo from '../../hooks/useLoadUserInfo';
// import useNavPage from '../../hooks/useNavPage';

const { Header, Footer, Content } = Layout;

export const MainLayout = () => {
	// debugger;
	// const { waitingUserData } = useLoadUserInfo();
	// useNavPage(waitingUserData);

	// usePermission();

	return (
		<Layout>
			{/* <Header className="py-0 px-[24px] bg-transparent shadow"> */}
			<Header className="px-0 py-0 h-[60px] shadow">
				{/* <div className='float-left'>
                    <Logo />
                </div>
                <div className='float-right'>
                    <UserInfo />
                </div> */}
				<ModuleNavigetion />
			</Header>
			<Content className="mainHeight">
				<Outlet />
			</Content>
			<Footer className="text-center bg-[#f7f7f7] border-0 border-solid border-t-[1px] border-t-[#e8e8e8]">
				By using this site you agree with our Privacy Policy © 2024
				ChargeFinder Inc. Terms of use
			</Footer>
		</Layout>
	);
};
