import axios from "axios";
import { configHeader } from "../features/auth";
import CartItems from "./CartItems";
import { useQuery } from "react-query";
import Modal from "./Modal";
import { useState } from "react";
import { getUserCart, getUserDeliveryAddress } from "../features/api";

const Cart = () => {
    const [state, setState] = useState({
        isModalOpen: false,
        alamatList: [],
        selectedAlamat: "",
        filteredProducts: [],
        totalPrice: 0,
        delPrice: 0
    });

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const { isLoading, error } = useQuery("product", getUserCart, {
        onSuccess: (data) => {
            const totalPrice = data.reduce((sum, item) => sum + item.price * item.qty, 0);
            setState(prevState => ({
                ...prevState,
                filteredProducts: data,
                totalPrice
            }));
        }
    });
    const { isLoading: isLoadingAlamat} = useQuery("alamat", getUserDeliveryAddress, {
        onSuccess: (data) => {
            setState(prevState => ({
                ...prevState,
                alamatList: data,
            }));
        }
    });

    const handleOrder = async (items) => {
        const requestBody = {
            items: items.map(item => ({
                product: { _id: item.product._id },
                qty: item.qty
            })),
        };

        const reqBodyAlamat = {
            delivery_address : state.alamatList,
            delivery_fee: state.delPrice
        };

        try {
            const response = await axios.put('http://localhost:2020/api/cart', requestBody, configHeader);
            if(response){
                const order = await axios.post('http://localhost:2020/api/orders', reqBodyAlamat, configHeader);
                if(order){
                    closeModal();
                }
            }
            
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const openModal = () => setState(prevState => ({ ...prevState, isModalOpen: true }));
    const closeModal = () => setState(prevState => ({ ...prevState, isModalOpen: false }));

    const updateProductQty = (id, qty) => {
        const updatedProducts = state.filteredProducts.map(item => {
            if (item._id === id) {
                return { ...item, qty };
            }
            return item;
        });
        const totalPrice = updatedProducts.reduce((sum, item) => sum + item.price * item.qty, 0);
        setState(prevState => ({
            ...prevState,
            filteredProducts: updatedProducts,
            totalPrice,
        }));
    };

    if (isLoading || isLoadingAlamat) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleAlamatChange = (event) => {
        setState(prevState => ({
            ...prevState,
            selectedAlamat: event.target.value,
            delPrice: getRandomInt(10000, 100000)
        }));
    };

    const handleOrderSubmit = () => {
        handleOrder(state.filteredProducts);
    };

    return (
        <div className="bg-secondary min-h-screen w-full p-8">
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">Image</th>
                            <th scope="col" className="px-4 py-3">Product name</th>
                            <th scope="col" className="px-4 py-3">Quantity</th>
                            <th scope="col" className="px-4 py-3">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.filteredProducts.map((item) => (
                            <CartItems 
                                key={item._id} 
                                data={item} 
                                onUpdateQty={(id, qty) => updateProductQty(id, qty)} 
                            />
                        ))}
                    </tbody>
                    <tfoot className="text-md text-gray-700 uppercase font-medium bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <td colSpan={2} className="text-white text-right px-6 py-3">
                                Total
                            </td>
                            <td colSpan={2} className="text-white text-right pr-[99px] py-3">
                                {state.totalPrice}
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={4}>
                                <button 
                                    className="w-full bg-orange-700 text-white h-10" 
                                    onClick={openModal}
                                >
                                    Buy
                                </button>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <Modal isOpen={state.isModalOpen} onClose={closeModal} title="Pilih Alamat" btnText="Pesan" onSubmit={handleOrderSubmit}>
                    <div>
                        <label htmlFor="alamat">Alamat:</label><br />   
                        <select id="alamat" value={state.selectedAlamat} onChange={handleAlamatChange} className="border-2 border-slate-950 px-2 py-2 rounded-full mb-2 mt-1">
                            <option value="">Pilih Alamat</option>
                            {state.alamatList.map((alamat) => (
                                <option key={alamat._id} value={alamat._id}>{alamat.nama}</option>
                            ))}
                        </select>
                        { state.selectedAlamat && (
                            <>
                                <p>Delivery Price:</p>
                                <p className="py-2">Rp. <span className="ml-1">{state.delPrice}</span> </p>
                            </>
                        )
                        }
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default Cart;
