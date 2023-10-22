import { useRouter } from "next/router";
import Avatar from "../common/Avatar";

const Sidebar = () => {
	const router = useRouter();
	return (
		<div className="bg-panel-header-background flex flex-col max-h-screen z-20">
			<div className="w-full px-3 mt-10 flex flex-col">
				<div className="flex items-center justify-center gap-x-4 scale-150">
					<Avatar type={"lg"} image="/gpt-logo.webp" />
					<h1 className="text-white text-xl">Chat-GPT Bot</h1>
				</div>
				<button
					className="mt-12 w-full p-3 rounded-md font-bold bg-outgoing-background  text-xl text-white"
					onClick={() => router.push("/home")}
				>
					Back to main chat page
				</button>
			</div>
		</div>
	);
};

export default Sidebar;
