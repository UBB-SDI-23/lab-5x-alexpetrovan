import { Container } from "@mui/system";
import { SetStateAction, useEffect, useState } from "react"; 1
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL } from "../../constants";
import { UserProfile } from "../../models/UserProfile";
import {
	Box,
	MenuItem,
	Select,
	SelectChangeEvent,
	TextField,
} from "@mui/material";
import axios from "axios";

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

	useEffect(() => {
		fetch(`${BACKEND_API_URL}/User/${username}`)
			.then((response) => response.json())
			.then((data) => {
				console.log(data);
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
				src={`/assets/img/${userProfile?.gender === 'female' ? 'female_profile_avatar.png' : 'male_profile_avatar.png'}`}
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

				<TextField
					id="outlined-pagesize-input"
					label="Page Size"
					sx={{ width: "10%" }}
					select
					value={pageSize}
					onChange={handlePageSizeChange}
				>
					<MenuItem value={25}>25</MenuItem>
					<MenuItem value={50}>50</MenuItem>
					<MenuItem value={100}>100</MenuItem>
				</TextField>

			</Box>
		</Container>
	);
};