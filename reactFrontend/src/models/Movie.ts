import { Actor } from "./Actor";
import { Production } from "./Production";

export interface Movie {
    id?: number;
    name: string;
    releaseYear: Date;
    rating: number;
    genre: string;
    budget: number;
    production: Production;
    actors: Actor[];
}