import axios from 'axios';
import { $host } from './index';

export const getRentals = async () => {
    const { data } = await $host.get('api/rentals');
    return data;
};

export const getIsActive = async () => {
    const { data }  = await $host.get('api/active');
    return data.active;
}

export const updateStop = async (id, time) => {
    const { data } = await $host.post('api/stop', { id, time })
    return data;
}

export const updateStart = async (id) => {
    const { data } = await $host.post('api/start', { id })
    return data;
}