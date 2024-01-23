export default interface City {
    id?: string;
    name: string;
    day: number;
    description: string;
    accomodation: string;
    activities: string[];
    video?: File | null; 
}



