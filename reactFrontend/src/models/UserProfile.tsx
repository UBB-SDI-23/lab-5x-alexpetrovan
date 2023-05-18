export interface UserProfile {
    bio: string;
    location: string;
    gender: string;
    marital: string;
    role: string;
    movie_count: number;
    production_count: number;
    actor_count: number;
    page_size: number;
    user: User;
}

interface User {
    username: string;
    password: string;
}