import { ReactNode, useEffect, useState } from "react";
import { Movie } from "../../models/Movie";
import { Container, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, Checkbox } from "@mui/material";
import { BACKEND_API_URL } from "../../constants";
import { Link } from "react-router-dom";

import { PaginationComponent, Props } from "../../customPagination/pagination";
import axios from "axios";


export const AllMovies = () => {
    const [loading, setLoading] = useState(false);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [movieCount, setMovieCount] = useState(0);
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
            fetch(`${BACKEND_API_URL}/Movie/?page_size=${size}&page=${currentPage}`)
                .then((response) => response.json())
                .then((data) => {
                    setMovies(data.results);
                    setMovieCount(data.count);
                    setLoading(false);
                });
        } else {
            fetch(`${BACKEND_API_URL}/Movie`)
                .then((response) => response.json())
                .then((data) => {
                    setMovies(data.results);
                    setMovieCount(data.count);
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
                            {isAdmin ? (<TableCell>Delete</TableCell>) : (<TableCell>#</TableCell>)}
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
                                            {isAdmin ? (<TableCell>
                                                <Checkbox
                                                    onChange={(event) => handleCheckBoxChanged(event, movie?.id || 0)}
                                                />
                                            </TableCell>) :
                                                (<TableCell component="th" scope="row">
                                                    {index + 1 + (currentPage - 1) * pageSize}
                                                </TableCell>)}
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
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(movieCount / pageSize)} handlePagination={function (page: number): void {
                            setIdsToDelete([]);
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Movie/?page_size=${pageSize}&page=${page}`)
                                .then((response) => response.json())
                                .then((data) => {
                                    setMovies(data.results);
                                    setLoading(false);
                                });

                        }} />
                    </div>
                </TableContainer>
            )}
        {
                isSomethingChecked ? (
                    <button
                        className="floating-button"
                        onClick={handleDeleteAll}
                    >
                        Delete {idsToDelete.length}
                    </button>) : null}
        </Container>
    )

}