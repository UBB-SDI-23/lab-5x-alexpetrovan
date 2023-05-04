import { ReactNode, useEffect, useState} from "react";
import { Link } from "react-router-dom";
import { Movie } from "../../models/Movie";
import { Container, CircularProgress, IconButton, Tooltip, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BACKEND_API_URL } from "../../constants";

import { PaginationComponent, Props } from "../../customPagination/pagination";
import { Production } from "../../models/Production";


export const AllMovies = () => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieCount, setMovieCount] = useState(0);
    const [currentPage, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        fetch(`${BACKEND_API_URL}/Movie/?page=${currentPage}`)
            .then((response) => response.json())
            .then((data) => {
                setMovies(data.results);
                setMovieCount(data.count);
                setLoading(false);
            });

    }, []);

    return (
        <Container>
            <h1 className="all-objects-header"> All registered movies </h1>
            {loading && <CircularProgress />}
            {!loading && movies.length === 0 && <p> No movies found </p>}
            {!loading && (
                <div>


                </div>
            )}
            {!loading && movies.length > 0 && (
                <TableContainer component={Paper}>
                    <Table aria-label="movie-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Rating</TableCell>
                                <TableCell align="right">Genre</TableCell>
                                <TableCell align="right">Budget</TableCell>
                                <TableCell align="right">No. of actors</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                movies
                                    .map((movie, index) => (
                                        <TableRow key={movie.id}>
                                            <TableCell component="th" scope="row">
                                                {index + 1 + (currentPage-1)*100}
                                            </TableCell>
                                            <TableCell align="right">{movie.name}</TableCell>
                                            <TableCell align="right">{movie.rating}</TableCell>
                                            <TableCell align="right">{movie.genre}</TableCell>
                                            <TableCell align="right">{movie.budget}</TableCell>
                                            <TableCell align="center">{movie.actors.length}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                    
                </TableContainer>
            )}
            <div>
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(movieCount/100)} handlePagination={function (page: number): void {
                            
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Movie/?page=${page}`)
                            .then((response) => response.json())
                            .then((data) => {
                                setMovies(data.results);
                                setLoading(false);
                            });
                            
                        } }/>
            </div>
        </Container>
    )

}