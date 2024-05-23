import { useState, useEffect } from "react";

const CartItems = ({ data, onUpdateQty }) => {
    const [qty, setQty] = useState(data.qty);

    useEffect(() => {
        setQty(data.qty);
    }, [data.qty]);

    const handleIncrement = () => {
        const newQty = qty + 1;
        setQty(newQty);
        onUpdateQty(data._id, newQty);
    };

    const handleDecrement = () => {
        const newQty = Math.max(qty - 1, 1);
        setQty(newQty);
        onUpdateQty(data._id, newQty);
    };

    return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                <img
                    src={`http://localhost:2020/public/images/products/${data.image_url}`}
                    alt=""
                    className="p-0 w-fit h-48 object-contain aspect-square"
                />
            </th>
            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {data.name}
            </th>
            <td className="px-4 py-2">
                <button className="w-5 bg-gray-50 text-black py-2" onClick={handleDecrement}>
                    -
                </button>
                <input
                    type="text"
                    value={qty}
                    className="w-8 bg-gray-100 text-black text-center p-2"
                    disabled
                />
                <button className="w-5 bg-gray-50 text-black py-2" onClick={handleIncrement}>
                    +
                </button>
            </td>
            <td className="px-4 py-2">{data.price}</td>
        </tr>
    );
};

export default CartItems;
