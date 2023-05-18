import { Container } from "@mui/system";
import { useEffect, useState } from "react"; 1
import { useParams } from "react-router-dom";
import { BACKEND_API_URL } from "../../constants";
import { UserProfile } from "../../models/UserProfile";
import {
	Box,
	MenuItem,
	TextField,
} from "@mui/material";
import axios from "axios";
import male from "/assets/img/male_profile_avatar.png";
import female from "/assets/img/female_profile_avatar.png";

export const UserDetails = () => {
	const { username } = useParams();
	const [userProfile, setUserProfile] = useState<UserProfile>();
	const [pageSize, setPageSize] = useState(userProfile?.page_size || 100);

	const handlePageSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(event.target.value);
		if (userProfile){
			userProfile.page_size = value;
			updateUserProfile();
		}
		setPageSize(value);
		localStorage.setItem("pageSize", value.toString());
	};

	const updateUserProfile = async () => {
		try {
			const token = localStorage.getItem("token");
			if (token !== null){
				const headers = {Authorization: `Bearer ${token}`};
				if (userProfile)
					await axios.patch(`${BACKEND_API_URL}/User/${username}/`, {page_size: userProfile.page_size}, {headers});}
		} catch (error) {

			throw new Error("Error updating the userProfile entity");
		}
	}

	const isAdmin = localStorage.getItem("role") === "admin";

	useEffect(() => {
		fetch(`${BACKEND_API_URL}/User/${username}`)
			.then((response) => response.json())
			.then((data) => {
				setUserProfile(data);
				setPageSize(data.page_size);
			})
	}, [username]);

	return (
		<Container
			sx={{
				justifyContent: "space-between",
			}}>
			<img
				src={userProfile?.gender === 'female' ? female : male}
				alt="cartoon png"
				id="profile_img"
			/>
			<Box
				component="form"
				sx={{
					'& .MuiTextField-root': { m: 1 },
				}}
				noValidate
				autoComplete="off"
			>
				<div className="space-between-div">
					<TextField
						id="outlined-username-input"
						label="Username"
						value={username || ""}
						sx={{ width: "24%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						id="outlined-gender-input"
						label="Gender"
						value={userProfile?.gender || ""}
						sx={{ width: "24%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						id="outlined-marital-input"
						label="Marital Status"
						value={userProfile?.marital || ""}
						sx={{ width: "24%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
					<TextField
						id="outlined-role-input"
						label="Role"
						value={userProfile?.role || ""}
						sx={{ width: "24%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
				</div>
				<div>
					<TextField
						id="outlined-location-input"
						label="Address"
						value={userProfile?.location || ""}
						sx={{ width: "98.5%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
				</div>
				<div>
					<TextField
						id="outlined-bio-input"
						label="Bio"
						value={userProfile?.bio || ""}
						sx={{ width: "98.5%" }}
						fullWidth
						InputProps={{
							readOnly: true,
						}}
					/>
				</div>
				<div className="space-between-div">
					<TextField
						id="outlined-moviecount-input"
						label="Movies Added"
						value={userProfile?.movie_count || 0}
						sx={{ width: "33%" }}
						InputProps={{
							readOnly: true,
						}}
					/><TextField
						id="outlined-actorcount-input"
						label="Actors Added"
						value={userProfile?.actor_count || 0}
						sx={{ width: "33%" }}
						InputProps={{
							readOnly: true,
						}}
					/><TextField
						id="outlined-productioncount-input"
						label="Productions Added"
						value={userProfile?.production_count || 0}
						sx={{ width: "33%" }}
						InputProps={{
							readOnly: true,
						}}
					/>
				</div>
				{ isAdmin? (<TextField
					id="outlined-pagesize-input"
					label="Page Size"
					sx={{ width: "32%" }}
					select
					value={pageSize}
					defaultValue={userProfile?.page_size}
					onChange={handlePageSizeChange}
					disabled={!isAdmin}
				>
					<MenuItem value={25}>25</MenuItem>
					<MenuItem value={50}>50</MenuItem>
					<MenuItem value={100}>100</MenuItem>
				</TextField>) : (<div>

				</div>)}
				

			</Box>
		</Container>
	);
};