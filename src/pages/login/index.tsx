import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRequest } from "ahooks";
import { Flex, Button, Checkbox, Form, Input, message } from "antd";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../../service/user.service";
import { getUserToken, setUserInfoInCookie, setUserToken } from "../../utils/user-token";
import { SEARCH_PATHNAME } from "../../router/routes"
import { useSetRecoilState } from "recoil"
import { userInfoState } from "../../store"

const USER_EMAIL_KEY = "USER_EMAIL"
const PASSWORD_KEY = "PASSWORD"

const rememberUser = (email: string, password: string) => {
	localStorage.setItem(USER_EMAIL_KEY, email)
	localStorage.setItem(PASSWORD_KEY, password)
}

const getUserFromLocalStorage = () => {
	const email = localStorage.getItem(USER_EMAIL_KEY)
	const password = localStorage.getItem(PASSWORD_KEY)
	return { email, password }
}

const deleteUser = () => {
	localStorage.removeItem(USER_EMAIL_KEY)
	localStorage.removeItem(PASSWORD_KEY)
}

const LoginPage = () => {
	const navigateTo = useNavigate()
	const setUserInfo = useSetRecoilState(userInfoState)
	// const jumpSearch = () => {
	// 	navigate("/us");
	// };
	// const handleRegisterClick = () => {
	// 	navigate("/login");
	// };

	useEffect(() => {
		const userToken = getUserToken()
		if (userToken) {
			navigateTo(SEARCH_PATHNAME)
		}
	}, [navigateTo])

	const [form] = Form.useForm()
	useEffect(() => {
		const { email, password } = getUserFromLocalStorage()
		form.setFieldsValue({ email, password })
	}, [form])

	const { run } = useRequest(
		async (values: any) => {
			// try {
			const data = await userLogin(values)
			return data
			// } catch (error: any) {
			// 	console.log("login page error: ", error);
			// }
		},
		{
			manual: true,
			onSuccess: (res) => {
				// debugger;
				console.log("res: ", res)
				setUserInfoInCookie(JSON.stringify(res))
				setUserInfo(res)
				setUserToken(res.token)

				message.success("登录成功")
				navigateTo(SEARCH_PATHNAME)
			},
			onError: (error) => {
				console.log("login page error: ", error)
			// message.error(error.message);
			// message.info("登录失败");
			},
		}
	)
	const onFinish = (values: any) => {
		// console.log('values:  ', values);
		const { email, password, remember } = values
		if (remember) {
			rememberUser(email, password)
		} else {
			deleteUser()
		}
		run(values)
	}
	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed: ", errorInfo)
	}

	return (
		<Flex
			vertical
			justify="center"
			align="center"
			className="w-full mainHeight"
		>
			<Form
				name="normal_login"
				form={form}
				className="login-form w-[25%] min-w-[600px] mx-auto"
				labelCol={{ span: 6 }}
				size="large"
				wrapperCol={{ span: 18 }}
				initialValues={{
					remember: true,
				}}
				onFinish={onFinish}
				onFinishFailed={onFinishFailed}
				autoComplete="off"
			>
				<Form.Item
					name="email"
					rules={[
						{
							required: true,
							message: "Please input your Register Email!",
						},
					]}
				>
					<Input
						prefix={
							<UserOutlined className="site-form-item-icon" />
						}
						placeholder="Enter your Register Email"
						style={{
							fontSize: "16px",
							padding: "10px 15px",
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
					rules={[
						{
							required: true,
							message: "Please input your Password!",
						},
					]}
				>
					<Input.Password
						prefix={
							<LockOutlined className="site-form-item-icon" />
						}
						placeholder="Enter your password"
						style={{
							fontSize: "16px",
							padding: "10px 15px",
							borderRadius: "5px",
							border: "1px solid #d9d9d9",
							boxShadow:
								"0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04)",
							transition: "all 0.3s",
						}}
					/>
				</Form.Item>
				<Form.Item>
					<Form.Item
						name="remember"
						valuePropName="checked"
						noStyle
					>
						<Checkbox>Remember me</Checkbox>
					</Form.Item>
					<Link
						to="/register"
						className="text-o-5"
					>
						or register
					</Link>
				</Form.Item>

				<Form.Item>
					{/* <Button
						htmlType="submit"
						className="login-form-butto text-[#fff] gradient-button-radial-scale"
						onClick={jumpSearch}
						style={{
							width: "100%",
							fontSize: "16px",
							lineHeight: "16px",
							padding: "18px 0",
							borderRadius: "5px",
							boxShadow:
								"0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04)",
							transition: "all 0.3s",
						}}
					> */}
					<Button
						htmlType="submit"
						className="login-form-butto text-[#fff] gradient-button-radial-scale"
						style={{
							width: "100%",
							fontSize: "16px",
							lineHeight: "16px",
							padding: "18px 0",
							borderRadius: "5px",
							boxShadow:
								"0 2px 4px rgba(0,0,0,.12), 0 0 6px rgba(0,0,0,.04)",
							transition: "all 0.3s",
						}}
					>
						log in
					</Button>
				</Form.Item>
			</Form>
		</Flex>
	)
}

export default LoginPage;
