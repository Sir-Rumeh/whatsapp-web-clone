import { BeatLoader } from "react-spinners";

const override = {
	display: "block",
	margin: "0 auto",
	borderColor: "#25D366",
};

const Loader = ({ loading }) => {
	return (
		<>
			<div className="h-full flex items-center justify-center">
				<BeatLoader
					color={"#25D366"}
					loading={loading}
					cssOverride={override}
					size={15}
					aria-label="Loading Spinner"
					data-testid="loader"
				/>
			</div>
		</>
	);
};

export default Loader;
