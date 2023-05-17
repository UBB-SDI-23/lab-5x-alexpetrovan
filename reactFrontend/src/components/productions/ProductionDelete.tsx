import { Container, Card, CardContent, IconButton, CardActions, Button } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import axios from "axios";
import { BACKEND_API_URL } from "../../constants";

export const ProductionDelete = () => {
	const { productionId } = useParams();
	const navigate = useNavigate();

	const handleDelete = async (event: { preventDefault: () => void }) => {
		event.preventDefault();const token = localStorage.getItem("token");
		if (token !== null) {
			const headers = { Authorization: `Bearer ${token}` };
			await axios.delete(`${BACKEND_API_URL}/Production/${productionId}`, { headers });
		}
		// go to productions list
		navigate("/productions");
	};

	const handleCancel = (event: { preventDefault: () => void }) => {
		event.preventDefault();
		// go to productions list
		navigate("/productions");
	};

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/productions`}>
						<ArrowBackIcon />
					</IconButton>{" "}
					Are you sure you want to delete this production? This cannot be undone!
				</CardContent>
				<CardActions>
					<Button onClick={handleDelete}>Delete it</Button>
					<Button onClick={handleCancel}>Cancel</Button>
				</CardActions>
			</Card>
		</Container>
	);
};