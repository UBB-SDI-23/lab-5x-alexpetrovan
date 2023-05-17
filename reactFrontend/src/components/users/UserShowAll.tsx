import { Container } from "@mui/system";
import React, { ReactNode, useEffect, useState } from "react";
import { UserProfile } from "../../models/UserProfile";
import { BACKEND_API_URL } from "../../constants";
import { CircularProgress, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { PaginationComponent } from "../../customPagination/pagination";
import axios from "axios";

export const AllUsers = () => {
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState<number>(100);
    const [currentPage, setPage] = useState(1);
    const [userCount, setUserCount] = useState(0);

    useEffect(() => {
        setLoading(true);
        const size = localStorage.getItem("pageSize");
        if (size !== null) {
            setPageSize(parseInt(size, 10));
            fetch(`${BACKEND_API_URL}/User/?page_size=${size}`).
                then((response) => response.json()).
                then((data) => {
                    setUserProfiles(data.results);
                    setUserCount(data.count);
                    setLoading(false);
                });
        }
        else {
            fetch(`${BACKEND_API_URL}/User/`).
                then((response) => response.json()).
                then((data) => {
                    setUserProfiles(data.results);
                    setUserCount(data.count);
                    setLoading(false);
                });
        }
    }, []);

    const handleChange = async (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        username: string
      ) => {
        const value = event.target.value;
        try {
          await updateUserProfile(username, value);
          // Update the role value in userProfiles without refreshing
          setUserProfiles((prevUserProfiles) =>
            prevUserProfiles.map((userProfile) => {
              if (userProfile.user.username === username) {
                return {
                  ...userProfile,
                  role: value,
                };
              }
              return userProfile;
            })
          );
        } catch (error) {
          throw new Error("Error updating the userProfile entity");
        }
      };
    const updateUserProfile = async (username: string, role: string) => {
        try {
            const token = localStorage.getItem("token");
            if (token !== null) {
                const headers = { Authorization: `Bearer ${token}` };
                await axios.patch(`${BACKEND_API_URL}/User/${username}/`, { role: role }, { headers });
            }
        } catch (error) {

            throw new Error("Error updating the userProfile entity");
        }

    }

    return (<Container>
        <h1 className="all-objects-header">All registered users</h1>
        {loading && <CircularProgress />}
        {!loading && userProfiles.length === 0 && <p> No users registered </p>}
        {!loading && (<div></div>)}
        {!loading && userProfiles.length > 0 && (
            <TableContainer component={Paper} sx={{ marginRight: "2%" }}>
                <Table
                    sx={{ minWidth: 650 }}
                    aria-label="production-table"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell align="right">Username</TableCell>
                            <TableCell align="right">Gender</TableCell>
                            <TableCell align="right">Marital</TableCell>
                            <TableCell align="right">Role</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            userProfiles.
                                map((userProfile, index) => (
                                    <TableRow key={userProfile.user.username}>
                                        <TableCell component="th" scope="row">
                                            {index + 1 + (currentPage - 1) * pageSize}
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link to={`/users/${userProfile.user.username}`} title="View user details">
                                                {userProfile.user.username}
                                            </Link>
                                        </TableCell>
                                        <TableCell align="right">{userProfile.gender}</TableCell>
                                        <TableCell align="right">{userProfile.marital}</TableCell>
                                        <TableCell align="right">
                                            <TextField
                                                id="outlined-role-input"
                                                label="Role"
                                                select
                                                value={userProfile?.role}
                                                defaultValue={userProfile?.role}
                                                onChange={(event) => handleChange(event, userProfile?.user.username)}
                                            >
                                                <MenuItem value={"regular"}>Regular</MenuItem>
                                                <MenuItem value={"moderator"}>Moderator</MenuItem>
                                                <MenuItem value={"admin"}>Admin</MenuItem>
                                            </TextField>
                                        </TableCell>
                                    </TableRow>
                                ))
                        }
                    </TableBody>

                </Table>
                <div>
                    <PaginationComponent page={currentPage} totalPages={Math.ceil(userCount / pageSize)} handlePagination={function (page: number): void {
                        setPage(page);
                        setLoading(true);
                        fetch(`${BACKEND_API_URL}/User/?page_size=${pageSize}&page=${page}`)
                            .then((response) => response.json())
                            .then((data) => {
                                setUserProfiles(data.results);
                                setLoading(false);
                            });

                    }} />
                </div>
            </TableContainer>
        )}
    </Container>
    )
}