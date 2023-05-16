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
		description: "",
		added_by: localStorage.getItem("username") || "",
	});


	const addProduction = async (event: { preventDefault: () => void }) => {
		event.preventDefault();
		try {
			const token = localStorage.getItem("token");
			if (token !== null){
				const headers = {Authorization: `Bearer ${token}`};
			await axios.post(`${BACKEND_API_URL}/Production/`, production, {headers});
			}
			navigate("/productions");
		} catch (error) {
			console.log(error);
		}
	};

	const isDescriptionValid = production.description.length > 10;


	const websiteRegex = /^www\.[a-zA-Z]+\.[a-zA-Z]+$/;
	const isWebsiteValid = websiteRegex.test(production.website);

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
							error={!isDescriptionValid}
							helperText={!isDescriptionValid && "Description must be at least 10 char long"}
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
							error={!isWebsiteValid}
							helperText={!isDescriptionValid && "Website format - www.example.com"}
							onChange={(event) => setProduction({ ...production, website: event.target.value })}
						/>
						<Button type="submit" disabled = {!isDescriptionValid}>Add Production</Button>
					</form>
				</CardContent>
				<CardActions></CardActions>
			</Card>
		</Container>
	);
};