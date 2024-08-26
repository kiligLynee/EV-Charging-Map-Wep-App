import { useEffect, useState } from 'react'
import { Flex, Button, Form, Input, message, Select } from "antd";
import {
	MailOutlined,
	EyeTwoTone,
	EyeInvisibleTwoTone,
	UserOutlined,
} from "@ant-design/icons";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { useRequest } from "ahooks";
import { getVehicleList, registerUser } from "../../service/user.service";
import { LOGIN_PATHNAME } from "../../router/routes";
import { useRecoilState } from 'recoil';
import { IVehicle, vehicleListState } from '../../store/atoms/vehicleAtom';
const RegisterPage = () => {
	const [passwordVisible, setPasswordVisible] = useState(false);

	const [vehicleList, setVehicleList] = useRecoilState(vehicleListState)

	const nav = useNavigate();
	const { run } = useRequest(
		async (values: any) => {
			await registerUser(values);
		},
		{
			manual: true,
			onSuccess: () => {
				message.success("注册成功");
				nav(LOGIN_PATHNAME);
			},
		}
	);

	const onSubmit = (values: unknown) => {
		console.log("Received values of form: ", values);
		run(values);
	};


	useEffect(() => {
		getVehicleList().then(res => {
			// console.log('---res: ', res);
			setVehicleList(res as IVehicle[])
		})
	}, [setVehicleList])

	return (
		<Flex
			vertical
			justify="center"
			align="center"
			className="w-full mainHeight "
		>
			<Form
				name="normal_register"
				className="register-form w-[25%] min-w-[500px] mx-auto"
				labelCol={{ span: 6 }}
				size="large"
				wrapperCol={{ span: 18 }}
				initialValues={{
					// remember: true,
				}}
				onFinish={onSubmit}
			>
				<Form.Item
					name="username"
					label="Username"
					rules={[
						{
							required: true,
							message: "Please input your Username!",
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined className="site-form-item-icon" />
						}
						placeholder="Enter your username"
						style={{
							width: "calc(100%)",
							borderRadius: "5px",
							border: "1px solid #d9d9d9",
							boxShadow:
								"0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04)",
							transition: "all 0.3s",
						}}
					/>
				</Form.Item>
				<Form.Item
					name="password"
					label="Password"
					rules={[
						{
							required: true,
							message: "Please input your Password!",
						},
					]}
				>
					<Input.Password
						placeholder="Enter your password"
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleTwoTone />
						}
						visibilityToggle={{
							visible: passwordVisible,
							onVisibleChange: setPasswordVisible,
						}}
						style={{ width: "calc(100%)" }} // 减去按钮宽度，使输入框自适应
					/>
				</Form.Item>
				<Form.Item
					name="email"
					label="Email"
					rules={[
						{
							required: true,
							message: "Please input your Email!",
						},
						{
							type: "email",
							message: "The input is not a valid email!",
						},
					]}
				>
					<Input
						placeholder="Enter your email"
						prefix={
							<MailOutlined className="site-form-item-icon" />
						}
					/>
				</Form.Item>
				<Form.Item
					name="vehicleId"
					label="Vehicle"
					rules={[
						{
							required: true,
							message: "Please input your vihecle!",
						}
					]}
				>
					{/* <Select options={[{ value: 'sample', label: <span>sample</span> }]} /> */}
					<Select placeholder="Please select your vehicle" options={vehicleList.map(v => ({ value: v.id, label: v.carName }))} />
				</Form.Item>
				<Form.Item
					wrapperCol={{
						offset: 8,
						span: 12,
					}}
					className="text-center mt-[50px]"
				>
					<Button
						htmlType="submit"
						className="register-button w-full py-[6px] text-[#fff] bg-o-5"
					>
						register
					</Button>
				</Form.Item>
				<div className=" w-[25%] min-w-[600px] text-center mx-auto">
					<span className="opacity-50 font-12">
						<Link
							className="opacity-100 text-o-5"
							to="/login"
						>
							log in
						</Link>{" "}
						after register user verification, and accept the
						"Service Terms" and "Privacy Policy"
					</span>
				</div>
			</Form>
		</Flex>
	);
};

export default RegisterPage;
