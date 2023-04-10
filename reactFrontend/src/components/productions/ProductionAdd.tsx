import {
	Button,
	Card,
	CardActions,
	CardContent,
	IconButton,
	TextField,
} from "@mui/material";
import { Container } from "@mui/system";
import { useState } from "react";
import { Link, useNavigate} from "react-router-dom";
import { Production } from "../../models/Production";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";

export const ProductionAdd = () => {
	const navigate = useNavigate();

	const [production, setProduction] = useState<Production>({
		companyName: "",
		origin_country: "",
		website: "",
		description: ""
	});


	const addProduction = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			await axios.post(`/api/Production/`, production);
			navigate("/productions");
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
					<form onSubmit={addProduction}>
						<TextField
							id="companyName"
							label="Name"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setProduction({ ...production, companyName: event.target.value })}
						/>
						<TextField
							id="description"
							label="Description"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setProduction({ ...production, description: event.target.value })}
						/>
						<TextField
							id="origin_country"
							label="Country"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setProduction({ ...production, origin_country: event.target.value })}
						/>
						<TextField
							id="website"
							label="Website"
							variant="outlined"
							fullWidth
							sx={{ mb: 2 }}
							onChange={(event) => setProduction({ ...production, website: event.target.value })}
						/>
						<Button type="submit" >Add Production</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};