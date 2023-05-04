import { useEffect, useState} from "react";
import { Actor } from "../../models/Actor";
import { Container, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { BACKEND_API_URL } from "../../constants";

import { PaginationComponent } from "../../customPagination/pagination";


export const AllActors = () => {
    const [loading, setLoading] = useState(false);
    const [actors, setActors] = useState<Actor[]>([]);
    const [actorCount, setActorCount] = useState(0);
    const [currentPage, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/Actor/?page=${currentPage}`)
            .then((response) => response.json())
            .then((data) => {
                setActors(data.results);
                setActorCount(data.count);
                setLoading(false);
            });

    }, []);

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
                                <TableCell>#</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Gender</TableCell>
                                <TableCell align="right">Age</TableCell>
                                <TableCell align="right">Experience</TableCell>
                                <TableCell align="right">Nationality</TableCell>
                                <TableCell align="right">No. of Movies</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                actors
                                    .map((actor, index) => (
                                        <TableRow key={actor.id}>
                                            <TableCell component="th" scope="row">
                                                {index + 1 + (currentPage-1)*100}
                                            </TableCell>
                                            <TableCell align="right">{actor.name}</TableCell>
                                            <TableCell align="right">{actor.gender}</TableCell>
                                            <TableCell align="right">{actor.age}</TableCell>
                                            <TableCell align="right">{actor.experience}</TableCell>
                                            <TableCell align="right">{actor.nationality}</TableCell>
                                            <TableCell align="right">{actor.movies.length}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                    <div>
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(actorCount/100)} handlePagination={function (page: number): void {
                            
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Actor/?page=${page}`)
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