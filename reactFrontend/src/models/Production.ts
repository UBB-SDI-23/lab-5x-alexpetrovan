import { Movie } from "./Movie";

export interface Production {
    id?: number;
    companyName: string;
    origin_country: string;
    website: string;
    description: string;
    movies?: Movie[];
}