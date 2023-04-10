import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import VideoCameraFrontIcon from '@mui/icons-material/VideoCameraFront';
import MovieIcon from '@mui/icons-material/Movie';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';


export const NavBar = () => {
	const location = useLocation();
	const path = location.pathname;

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static" sx={{ marginBottom: "20px"}}>
				<Toolbar>
					<IconButton
						component={Link}
						to="/"
						size="large"
						edge="start"
						color="inherit"
						aria-label="movies"
						sx={{ mr: 2 }}>
						<HomeIcon />
					</IconButton>
					<Typography variant="h6" component="div" sx={{ mr: 5 }}>
						Movie Management
					</Typography>
					<Button
						variant={path.startsWith("/productions") ? "outlined" : "text"}
						to="/productions"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<VideoCameraFrontIcon />}>
						Productions
					</Button>
                    <Button
						variant={path.startsWith("/movies") ? "outlined" : "text"}
						to="/movies"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<MovieIcon />}>
						Movies
					</Button>
                    <Button
						variant={path.startsWith("/actors") ? "outlined" : "text"}
						to="/actors"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<AccountCircleIcon />}>
						Actors
					</Button>
                    <Button
						variant={path.startsWith("/contracts") ? "outlined" : "text"}
						to="/contracts"
						component={Link}
						color="inherit"
						sx={{ mr: 5 }}
						startIcon={<InsertDriveFileIcon />}>
						Contracts
					</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
};