import { useAuthContext } from "@/context/AuthContext";
import { useSettingsContext } from "@/context/SettingsContext";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Dashboard from "@/components/home/Dashboard";

export default function Home() {
	const router = useRouter();
	const { authUser, signOut, isLoading } = useAuthContext();
	const { view } = useSettingsContext();

	useEffect(() => {
		if (!authUser) {
			router.push("/user/login");
		}
	}, [authUser]);

	return (
		<main>
			{!isLoading && authUser ? (
				<>
					{view === "dashboard" && <Dashboard />}
					<button onClick={signOut}>Logout</button>
				</>
			) : (
				<p>Loading</p>
			)}
		</main>
	);
}
