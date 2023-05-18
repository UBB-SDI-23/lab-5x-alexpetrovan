import { useEffect, useState} from "react";
import { Actor } from "../../models/Actor";
import { Container, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Checkbox } from "@mui/material";
import { BACKEND_API_URL } from "../../constants";

import { PaginationComponent } from "../../customPagination/pagination";
import { Link } from "react-router-dom";
import axios from "axios";


export const AllActors = () => {
    const [loading, setLoading] = useState(false);
    const [actors, setActors] = useState<Actor[]>([]);
    const [actorCount, setActorCount] = useState(0);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(100);
    const [idsToDelete, setIdsToDelete] = useState<number[]>([]);
    const [fetchData, setFetchData] = useState(true);

    const isAdmin = localStorage.getItem("role") == "admin";

    useEffect(() => {
        setLoading(true);
        const size = localStorage.getItem("pageSize");
        if (size !== null) {
            setPageSize(parseInt(size, 10));
            fetch(`${BACKEND_API_URL}/Actor/?page_size=${size}&page=${currentPage}`)
                .then((response) => response.json())
                .then((data) => {
                    setActors(data.results);
                    setActorCount(data.count);
                    setLoading(false);
                });
        } else {
            fetch(`${BACKEND_API_URL}/Actor`)
                .then((response) => response.json())
                .then((data) => {
                    setActors(data.results);
                    setActorCount(data.count);
                    setLoading(false);
                });
        }
    }, [fetchData]);

    function handleCheckBoxChanged(event: React.ChangeEvent<HTMLInputElement>, id: number): void {
        if (id === 0)
            return;
        if (event.target.checked === true) {
            setIdsToDelete(prevIds => [...prevIds, id]);
        }
        else { setIdsToDelete(prevIds => prevIds.filter(prevId => prevId !== id)); }
    }

    const isSomethingChecked = idsToDelete.length > 0;

    const handleDeleteAll = async () => {

        try {
            const token = localStorage.getItem("token");
            if (token !== null) {
                const headers = { Authorization: `Bearer ${token}`};
                await axios.delete(`${BACKEND_API_URL}/Delete/production/`, { data: {ids: idsToDelete}, headers: headers, });
                setIdsToDelete([]);
                setFetchData((prevValue) => !prevValue);
            }
        } catch (error) {
            throw new Error("Error deleting productions");
        }

    }

    return (
        <Container>
            <h1 className="all-objects-header"> All registered actors </h1>
            {loading && <CircularProgress />}
            {!loading && actors.length === 0 && <p> No actors found </p>}
            {!loading && (
                <div>
                </div>
            )}
            {!loading && actors.length > 0 && (
                <TableContainer component={Paper}>
                    <Table aria-label="movie-table">
                        <TableHead>
                            <TableRow>
                                {isAdmin ? (<TableCell>Delete</TableCell>) : (<TableCell>#</TableCell>)}
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Gender</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="right">Experience</TableCell>
                                <TableCell align="right">Nationality</TableCell>
                                <TableCell align="right">No. of Movies</TableCell>
                                <TableCell align="right">Added by</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                actors
                                    .map((actor, index) => (
                                        <TableRow key={actor.id}>
                                            {isAdmin ? (<TableCell>
                                                <Checkbox
                                                    onChange={(event) => handleCheckBoxChanged(event, actor?.id || 0)}
                                                />
                                            </TableCell>) :
                                                (<TableCell component="th" scope="row">
                                                    {index + 1 + (currentPage - 1) * pageSize}
                                                </TableCell>)}
                                            <TableCell align="right">{actor.name}</TableCell>
                                            <TableCell align="right">{actor.gender}</TableCell>
                                            <TableCell align="right">{actor.age}</TableCell>
                                            <TableCell align="right">{actor.experience}</TableCell>
                                            <TableCell align="right">{actor.nationality}</TableCell>
                                            <TableCell align="right">{actor.movies.length}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/users/${actor.added_by}/details`} title="View user profile page">
                                                    {actor.added_by_username}
                                                    </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                    <div>
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(actorCount/pageSize)} handlePagination={function (page: number): void {
                            
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Actor/?page_size=${pageSize}&page=${page}`)
                            .then((response) => response.json())
                            .then((data) => {
                                setActors(data.results);
                                setLoading(false);
                            });
                            
                        } }/>
                    </div>
                </TableContainer>
                
            )}
            
        </Container>
    )

}