import { Movie } from "./Movie";

export interface Actor {
    id: number;
    name: string;
    gender: string;
    age: number;
    experience: number;
    nationality: string;
    movies: Movie[];
    added_by: string;
    added_by_username: string;
}