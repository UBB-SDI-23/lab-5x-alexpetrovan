import { Movie } from "./Movie";

export interface Actor {
    id: number;
    name: string;
    gender: string;
    age: number;
    experience: number;
    nationality: string;
    movies: Movie[]
}