import React, { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Production } from "../../models/Production";
import { Container, CircularProgress, IconButton, Tooltip, Paper, Table, TableCell, TableContainer, TableHead, TableRow, TableBody, Typography, Menu, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { BACKEND_API_URL } from "../../constants";
import { PaginationComponent } from "../../customPagination/pagination";

export const isEditable = (username:string): boolean => {
    const role = localStorage.getItem("role");
    
    const loggedUser = localStorage.getItem("username");

    return username==loggedUser || role=="moderator" || role=="admin";
}

export const AllProductions = () => {
    const [loading, setLoading] = useState(false);
    const [productions, setProductions] = useState<Production[]>([]);
    const [filter, setFilter] = useState("");
    const [sortValue, setSortValue] = useState("")
    const [productionCount, setProductionCount] = useState(0);
    const [currentPage, setPage] = useState(1);
    const [pageSize, setPageSize] = useState<number>(100);

    const isEditable = (username:string): boolean => {
        const role = localStorage.getItem("role");
        
        const loggedUser = localStorage.getItem("username");

        return username==loggedUser || role=="moderator" || role=="admin";
    }

    useEffect(() => {
        setLoading(true);
        const size = localStorage.getItem("pageSize");
        if (size !== null) {
            setPageSize(parseInt(size,10));
            fetch(`${BACKEND_API_URL}/Production/?page_size=${size}`)
            .then((response) => response.json())
            .then((data) => {
                setProductions(data.results);
                setProductionCount(data.count);
                setSortValue("id");
                setLoading(false);
            });
        } else {
            fetch(`${BACKEND_API_URL}/Production`)
            .then((response) => response.json())
            .then((data) => {
                setProductions(data.results);
                setProductionCount(data.count);
                setSortValue("id");
                setLoading(false);
            });
        }
    }, []);

    function handleChange(event: SelectChangeEvent<string>, child: ReactNode): void {
        const value = event.target.value ? event.target.value : "id";
        setSortValue(value);
        sortValues(value);
    }

    function sortValues(sortValue: string) {
        setProductions(
            [...productions].sort((a, b) => {
                if (a[sortValue] < b[sortValue]) return -1;
                if (a[sortValue] > b[sortValue]) return 1;
                return 0;
            })
        );
    }

    return (
        <Container>
            <h1 className="all-objects-header"> All registered productions </h1>
            <div style={{ display: "flex", width: "100%", alignItems: "center" }}>
                <Typography
                    marginLeft={"1%"}
                    marginRight={"2%"}
                >Filter on names: </Typography>
                <input
                    type="text"
                    value={filter}
                    color="rgb(177, 197, 203)"
                    onChange={(e) => setFilter(e.target.value)}
                />

                <IconButton component={Link} sx={{ m: 3 }} to={'/productions/add'}>
                    <Tooltip title="Add a new production" arrow>
                        <AddIcon />
                    </Tooltip>
                </IconButton>
                <FormControl sx={{ marginLeft: "auto", marginRight: "2%" }}>
                    <InputLabel id="select-sort-label">Sort</InputLabel>
                    <Select
                        id="select-sort"
                        value={sortValue}
                        label="Sort"
                        onChange={handleChange}
                    >

                        <MenuItem value={"id"}>Sort by ID</MenuItem>
                        <MenuItem value={"companyName"}>Sort by name</MenuItem>
                        <MenuItem value={"origin_country"}>Sort by country</MenuItem>
                        <MenuItem value={"website"}>Sort by website</MenuItem>
                    </Select>
                </FormControl>
            </div>
            {loading && <CircularProgress />}
            {!loading && productions.length === 0 && <p> No productions found </p>}
            {!loading && (
                <div>
                </div>
            )}
            {!loading && productions.length > 0 && (
                <TableContainer component={Paper} sx={{ marginRight: "2%" }}>
                    <Table sx={{
                        minWidth: 650,
                    }} aria-label="production-table">
                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell align="right">Name</TableCell>
                                <TableCell align="right">Country</TableCell>
                                <TableCell align="right">Website</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Added by</TableCell>
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
                                                {index + 1 + (currentPage - 1) * pageSize}
                                            </TableCell>
                                            <TableCell align="right">
                                                <Link to={`/productions/${production.id}/details`} title="View production details">
                                                    {production.companyName}
                                                </Link>
                                            </TableCell>
                                            <TableCell align="right">{production.origin_country}</TableCell>
                                            <TableCell align="right">{production.website}</TableCell>
                                            <TableCell align="right">{production.description}</TableCell>
                                            <TableCell align="right">
                                                <Link to={`/user/${production.added_by_username}`} title="View user profile page">
                                                    {production.added_by_username}
                                                </Link>
                                            </TableCell>
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

                                                    <IconButton 
                                                    component={Link} 
                                                    sx={{ mr: 1 }}
                                                    disabled={!isEditable(production.added_by_username || "")}
                                                    to={`/productions/${production.id}/edit`}>
                                                        <Tooltip title={"Edit production"}>
                                                        <EditIcon />
                                                        </Tooltip>
                                                    </IconButton>

                                                    <IconButton 
                                                    component={Link} 
                                                    sx={{ mr: 1 }} 
                                                    disabled={!isEditable(production.added_by_username || "")}
                                                    to={`/productions/${production.id}/delete`}>
                                                        <Tooltip title={"Remove production"}>
                                                        <DeleteForeverIcon sx={{ color: "red" }} />
                                                        </Tooltip>
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            }
                        </TableBody>
                    </Table>
                    <div>
                        <PaginationComponent page={currentPage} totalPages={Math.ceil(productionCount / pageSize)} handlePagination={function (page: number): void {
                            setPage(page);
                            setLoading(true);
                            fetch(`${BACKEND_API_URL}/Production/?page_size=${pageSize}&page=${page}`)
                                .then((response) => response.json())
                                .then((data) => {
                                    setProductions(data.results);
                                    setLoading(false);
                                });

                        }} />
                    </div>
                </TableContainer>
            )}

        </Container>
    )

}

