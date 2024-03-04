import {COUNTRIES} from "./components/countries";

export type SelectMenuOption = typeof COUNTRIES[number]

export type PlaceType={
    id?:number;
    user_id?:string;
    placeType: string;
    neighborhood: string;
    streetAddress: string;
    apt: string;
    postalCode: string;
    district: string;
    province: string;
    country: string | undefined;
    guest_number: number;
    bed_room_number: number;
    bed_number:number;
    bath_room_number:number;
    place_name?: string;
    place_description?: string;
    amenities:string[];
    price: number;
    images:string[]
}