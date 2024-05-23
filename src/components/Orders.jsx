import axios from "axios";
import { configHeader } from "../features/auth";
import { useQuery } from "react-query";
import { useState } from "react";
import Modal from "./Modal";
import MainURL from "../const/config"; // Pastikan Anda memiliki MainURL yang diimpor dengan benar

const Orders = () => {
    const [state, setState] = useState({
        isModalOpen: false,
        orderDetails: {},
    });

    const openModal = async (id) => {
        try {
            const invoices = await getInvoiceUser(id);
            setState(prevState => ({
                ...prevState,
                isModalOpen: true,
                orderDetails: invoices.order // Pastikan invoices.order berisi data yang sesuai
            }));
        } catch (error) {
            console.error('Error fetching invoice:', error);
        }
    };

    const closeModal = () => setState(prevState => ({
        ...prevState,
        isModalOpen: false,
        orderDetails: {}
    }));

    const fetchOrders = async () => {
        const response = await axios.get('http://localhost:2020/api/orders', configHeader);
        return response.data; // Mengembalikan data yang sebenarnya
    };

    const { isLoading: isLoadingOrders, data: ordersData, error: errorOrders } = useQuery("order", fetchOrders);

    async function getInvoiceUser(id) {
        try {
            const response = await axios.get(`${MainURL}/api/invoice/${id}`, configHeader);
            return response.data; // Mengembalikan data yang sebenarnya
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error; // Menyebarkan kembali kesalahan agar bisa ditangani di luar
        }
    }

    return (
        <>
            {isLoadingOrders && <p>Loading...</p>}
            {errorOrders && <p>Error: {errorOrders.message}</p>}

            {ordersData && ordersData.data.map((item) => (
                <div className="w-full max-w-lg bg-white shadow-md rounded-lg overflow-hidden my-4" key={item._id}>
                    <div className="px-6 py-4">
                        <div className="font-bold text-md mb-2">Order #{item._id}</div>
                        <p className="text-gray-700 text-base">
                            Delivery Fee: Rp. {item.delivery_fee}<br />
                            Status: <span className={`font-semibold ${item.status === "waiting_payment" ? "text-red-600" : "text-green-600"}`}>{item.status === "waiting_payment" ? "Menunggu Pembayaran" : "Sudah Dibayar"}</span><br />
                            Total Items: {item.items_count}
                        </p>
                    </div>
                    <div className="px-6 py-4">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => openModal(item._id)}>Lihat Invoice</button>
                    </div>
                </div>
            ))}

            <Modal isOpen={state.isModalOpen} onClose={closeModal} title="Order Details" btnText2="Tutup">
                <div className="p-4">
                    {state.orderDetails.delivery_address && (
                        <>
                            <p>Alamat Pengiriman:</p>
                            <p>{state.orderDetails.delivery_address.detail}</p>
                            <p className="mb-3">{state.orderDetails.delivery_address.kelurahan}, {state.orderDetails.delivery_address.kecamatan}, {state.orderDetails.delivery_address.kabupaten}, {state.orderDetails.delivery_address.provinsi}</p>
                        </>
                    )}
                    <p className="mb-2">Delivery Fee: Rp. {state.orderDetails.delivery_fee}</p>
                    <p>Status: <span className={`font-semibold ${state.orderDetails.status === "waiting_payment" ? "text-red-600" : "text-green-600"}`}>{state.orderDetails.status === "waiting_payment" ? "Menunggu Pembayaran" : "Sudah Dibayar"}</span></p>
                </div>
            </Modal>
        </>
    );
}

export default Orders;
