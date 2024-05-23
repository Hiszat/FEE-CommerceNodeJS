import axios from "axios";
import { configHeader } from "./auth";
import MainURL from "../const/config";

async function getUserCart() {
    try {
        const response = await axios.get(`${MainURL}/api/cart`, configHeader);
        return response.data; // Mengembalikan data yang sebenarnya
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Menyebarkan kembali kesalahan agar bisa ditangani di luar
    }
}

async function getUserDeliveryAddress() { 
    try {
        const response = await axios.get(`${MainURL}/api/da`, configHeader);
        return response.data; // Mengembalikan data yang sebenarnya
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Menyebarkan kembali kesalahan agar bisa ditangani di luar
    }
}

async function getInvoiceUser(id) { 
    try {
        const response = await axios.get(`${MainURL}/api/invoice/${id}`, configHeader);
        return response.data; // Mengembalikan data yang sebenarnya
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; // Menyebarkan kembali kesalahan agar bisa ditangani di luar
    }
}

export {
    getUserCart,
    getUserDeliveryAddress,
    getInvoiceUser
}
