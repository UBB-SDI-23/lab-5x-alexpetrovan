import { Actor } from "./Actor";
import { Movie } from "./Movie";

export interface Contract {
    id: number;
    movie: Movie;
    actor: Actor;
    role: string;
}