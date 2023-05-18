import {
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Production } from "../../models/Production";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";

export const ProductionUpdate = () => {
	const navigate = useNavigate();
	const { productionId } = useParams();

	const [production, setProduction] = useState({
		companyName: "",
		origin_country: "",
		website: "",
		description: ""
	});

	useEffect(() => {
		const fetchProduction = async () => {
			const response = await fetch(`${BACKEND_API_URL}/Production/${productionId}`);
			const prod = await response.json();
			setProduction({
				companyName: prod.companyName,
				origin_country: prod.origin_country,
				website: prod.website,
				description: prod.description,
			})
		};
		fetchProduction();
	}, [productionId])


	const updateProduction = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (token !== null) {
				const headers = { Authorization: `Bearer ${token}` };
				await axios.patch(`${BACKEND_API_URL}/Production/${productionId}/`, production, { headers });
			}
			navigate(`/productions`);
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container>
			<Card>
				<CardContent >
					<IconButton component={Link} sx={{ mr: 3 }} to={`/productions`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					<form onSubmit={updateProduction}>
						<TextField
							id="companyName"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							value={production.companyName}
							onChange={(event) => setProduction({ ...production, companyName: event.target.value })}
						/>
						<TextField
							id="description"
							label="Description"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							value={production.description}
							onChange={(event) => setProduction({ ...production, description: event.target.value })}
						/>
						<TextField
							id="origin_country"
							label="Country"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							value={production.origin_country}
							onChange={(event) => setProduction({ ...production, origin_country: event.target.value })}
						/>
						<TextField
							id="website"
							label="Website"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							value={production.website}
							onChange={(event) => setProduction({ ...production, website: event.target.value })}
						/>

						<Button type="submit" >Update Production</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};