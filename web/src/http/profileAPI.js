import axios from 'axios';
import { $host } from './index';

export const getPreviousRides = async () => {
    const { data } = await $host.get('api/previousRides');
    console.log(data)
    return data;
};
