import { Card, CardActions, CardContent, IconButton } from "@mui/material";
import { Container } from "@mui/system";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Production } from "../../models/Production";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { BACKEND_API_URL } from "../../constants";

export const ProductionDetails = () => {
	const { productionId } = useParams();
	const [production, setProduction] = useState<Production>();

	useEffect(() => {
            fetch(`$/api/Production/${productionId}`)
                .then((response) => response.json())
                .then((data) => {
                    setProduction(data);
                })
	}, [productionId]);

	return (
		<Container>
			<Card>
				<CardContent>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/productions`}>
						<ArrowBackIcon />
					</IconButton>
					<h1 className="details-page-text details-page-header">Production Details</h1>
					<p className="details-page-text">Name: {production?.companyName}</p>
					<p className="details-page-text">Description: {production?.description}</p>
					<p className="details-page-text">Website: {production?.website}</p>
					<p className="details-page-text">Movies:</p>
					<ul>
						{production?.movies?.map((movie) => (
							<li key={movie.id}>{movie.name}</li>
						))}
					</ul>
				</CardContent>
				<CardActions>
					<IconButton component={Link} sx={{ mr: 3 }} to={`/productions/${productionId}/edit`}>
						<EditIcon />
					</IconButton>

					<IconButton component={Link} sx={{ mr: 3 }} to={`/productions/${productionId}/delete`}>
						<DeleteForeverIcon sx={{ color: "red" }} />
					</IconButton>
				</CardActions>
			</Card>
		</Container>
	);
};