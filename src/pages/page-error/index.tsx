import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { HOME_PATHNAME } from "../../router/routes";

export const PageError = () => {
	return (
		<Result
			status="warning"
			title="There are some problems with your operation."
			subTitle="抱歉,您访问的页面出错了！"
			extra={
				<Link to={HOME_PATHNAME}>
					<Button type="primary">返回首页</Button>
				</Link>
			}
		/>
	);
};
