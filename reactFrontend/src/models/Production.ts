import { Movie } from "./Movie";

export interface Production {
    [key: string]: any;
    id?: number;
    companyName: string;
    origin_country: string;
    website: string;
    description: string;
    movies?: Movie[];
}