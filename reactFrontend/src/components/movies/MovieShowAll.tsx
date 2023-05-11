import { ReactNode, useEffect, useState} from "react";
import { Movie } from "../../models/Movie";
import { Container, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { BACKEND_API_URL } from "../../constants";
import { Link } from "react-router-dom";

import { PaginationComponent, Props } from "../../customPagination/pagination";


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
                                <TableCell align="right">Production</TableCell>
                                <TableCell align="right">Added by</TableCell>
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
                                            <TableCell align="right">{movie.production.companyName}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/users/${movie.added_by}/details`} title="View user profile page">
                                                    {movie.added_by_username}
                                                    </Link>
                                            </TableCell>
                                            <TableCell align="center">{movie.actors.length}</TableCell>
                                            
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
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
                </TableContainer>
            )}
            
        </Container>
    )

}