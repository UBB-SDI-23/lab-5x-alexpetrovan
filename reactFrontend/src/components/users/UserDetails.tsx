import { Card, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";1
import { Link, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL } from "../../constants";
import { UserProfile } from "../../models/UserProfile";

export const UserDetails = () => {
	const { username } = useParams();
	const [ userProfile, setUserProfile] = useState<UserProfile>();

	useEffect(() => {
            fetch(`${BACKEND_API_URL}/User/${username}`)
                .then((response) => response.json())
                .then((data) => {
                    setUserProfile(data);
                })
	}, [username]);

	return (
		<Container>
            <h1 className="details-page-text details-page-header">User Profile Page</h1>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/`}>
						<ArrowBackIcon />
					</IconButton>
					<p className="details-page-text">Bio: {userProfile?.bio}</p>
					<p className="details-page-text">Gender: {userProfile?.gender}</p>
					<p className="details-page-text">Address: {userProfile?.location}</p>
					<p className="details-page-text">Marital Status: {userProfile?.marital}</p>
                    <p className="details-page-text">Added Productions: {userProfile?.production_count}</p>
                    <p className="details-page-text">Added Movies: {userProfile?.movie_count}</p>
                    <p className="details-page-text">Added Actors: {userProfile?.actor_count}</p>
					
				</CardContent>
			</Card>
		</Container>
	);
};