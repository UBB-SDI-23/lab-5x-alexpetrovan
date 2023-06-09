import { ReactNode, useEffect, useState} from "react";
import { Contract } from "../../models/Contract";
import { Container, CircularProgress, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { BACKEND_API_URL } from "../../constants";

import { PaginationComponent } from "../../customPagination/pagination";


export const AllContracts = () => {
    const [loading, setLoading] = useState(false);
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [contractCount, setContractCount] = useState(0);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(100);

    useEffect(() => {
        setLoading(true);
        const size = localStorage.getItem("pageSize");
        if (size !== null) {
            setPageSize(parseInt(size, 10));
            fetch(`${BACKEND_API_URL}/Contract/?page_size=${size}`)
                .then((response) => response.json())
                .then((data) => {
                    setContracts(data.results);
                    setContractCount(data.count);
                    setLoading(false);
                });
        } else {
            fetch(`${BACKEND_API_URL}/Contract`)
                .then((response) => response.json())
                .then((data) => {
                    setContracts(data.results);
                    setContractCount(data.count);
                    setLoading(false);
                });
        }
    }, []);

    return (
        <Container>
            <h1 className="all-objects-header"> All registered contracts </h1>
            {loading && <CircularProgress />}
            {!loading && contracts.length === 0 && <p> No contracts found </p>}
            {!loading && (
                <div>


                </div>
            )}
            {!loading && contracts.length > 0 && (
                <TableContainer component={Paper}>
                    <Table aria-label="movie-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">Movie</TableCell>
                                <TableCell align="right">Actor</TableCell>
                                <TableCell align="right">Role</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                contracts
                                    .map((contract, index) => (
                                        <TableRow key={contract.id}>
                                            <TableCell component="th" scope="row">
                                                {index + 1 + (currentPage-1)*pageSize}
                                            </TableCell>
                                            <TableCell align="right">{contract.movie.name}</TableCell>
                                            <TableCell align="right">{contract.actor.name}</TableCell>
                                            <TableCell align="right">{contract.role}</TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                    <div>
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(contractCount/pageSize)} handlePagination={function (page: number): void {
                            
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Contract/?page_size=${pageSize}&page=${page}`)
                            .then((response) => response.json())
                            .then((data) => {
                                setContracts(data.results);
                                setLoading(false);
                            });
                            
                        } }/>
                    </div>
                </TableContainer>
            )}
            
        </Container>
    )

}