import { Button, Result } from "antd";
import { Link } from "react-router-dom";
import { HOME_PATHNAME } from "../../router/routes";

export const NotFound = () => {
	return (
		<Result
			status="404"
			title="404"
			subTitle="抱歉,您访问的页面不存在！"
			extra={
				<Link to={HOME_PATHNAME}>
					<Button type="primary">返回首页</Button>
				</Link>
			}
		/>
	);
};
