import React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Production } from "../../models/Production";
import { Container, CircularProgress, IconButton, Tooltip, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BACKEND_API_URL } from "../../constants";


export const AllProductions = () => {
    const [loading, setLoading] = useState(false);
    const [productions, setProductions] = useState<Production[]>([]);
    const [filter, setFilter] = useState("");

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/Production`)
            .then((response) => response.json())
            .then((data) => {
                setProductions(data);
                setLoading(false);
            });

    }, []);

    return (
        <Container>
            <h1 className="all-objects-header"> All registered productions </h1>
            <Typography>Filter on names: </Typography>
            <input
                type="text"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
            />
            {loading && <CircularProgress />}
            {!loading && productions.length === 0 && <p> No productions found </p>}
            {!loading && (
                <IconButton component={Link} sx={{ ml: 3 }} to={'/productions/add'}>
                    <Tooltip title="Add a new production" arrow>
                        <AddIcon color="primary" />
                    </Tooltip>
                </IconButton>
            )}
            {!loading && productions.length > 0 && (
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="production-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Country</TableCell>
                                <TableCell align="right">Website</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Operations</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                productions
                                .filter((production) =>
                                    production.companyName.toLowerCase().includes(filter.toLowerCase())
                                )
                                .map((production, index) => (
                                    <TableRow key={production.id}>
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link to={'/productions/${production.id}/detailed'} title="View production details">
                                                {production.companyName}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{production.origin_country}</TableCell>
                                        <TableCell align="right">{production.website}</TableCell>
                                        <TableCell align="right">{production.description}</TableCell>
                                        <TableCell align="right">
                                            <div className="operation-header-wrapper">
                                                <IconButton
                                                    component={Link}
                                                    sx={{ mr: 1 }}
                                                    to={`/productions/${production.id}/details`}>
                                                    <Tooltip title="View production details" arrow>
                                                        <ReadMoreIcon color="primary" />
                                                    </Tooltip>
                                                </IconButton>

                                                <IconButton component={Link} sx={{ mr: 1 }} to={`/productions/${production.id}/edit`}>
                                                    <EditIcon />
                                                </IconButton>

                                                <IconButton component={Link} sx={{ mr: 1 }} to={`/productions/${production.id}/delete`}>
                                                    <DeleteForeverIcon sx={{ color: "red" }} />
                                                </IconButton>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    )

}