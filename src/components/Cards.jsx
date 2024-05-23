import { motion } from "framer-motion";
import Icons from "../assets/svg"
import axios from "axios";
import { configHeader} from "../features/auth";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUserCart } from "../features/api";
import MainURL from "../const/config";
const Card = ({data , cardAnimation}) => {

    const [product, setProduct] = useState([]);

    const notify = () => {
        toast.success("Product ditambahkan", {
          position: "bottom-right",
          className: "w-64 h-6 text-xs",
          autoClose: 2500,
        });
    }

    useEffect(() => {
        getUserCart().then(response => {
            setProduct(response);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);


    async function handleAddCart(id) {
        try {
            // Cari apakah produk dengan ID yang sama sudah ada di keranjang
            const existingProductIndex = product.findIndex((item) => item.product._id === id);
        
            if (existingProductIndex !== -1) {
                // Jika produk sudah ada, tambahkan qty nya
                const updatedProduct = [...product];
                updatedProduct[existingProductIndex].qty += 1;
    
                // Update state dengan produk yang sudah diupdate
                setProduct(updatedProduct);
            } else {
                // Jika produk belum ada, tambahkan produk baru ke keranjang
                await axios.put(`${MainURL}/api/cart`, {
                    items: [
                        ...product,
                        { 
                            product: { _id: id },
                            qty: 1
                        }
                    ]
                }, configHeader);
    
                const response = await getUserCart();
                setProduct([...product, response.data]);
            }
            notify();
        } catch (error) {
            console.error('Error:', error);
            // Tambahkan logika penanganan kesalahan lainnya jika diperlukan
        }        
    }
    

    const tags = data.tags;
    return ( 
        <motion.div className={`w-[24%] max-w-md border border-secondary rounded-lg shadow bg-primary-light`}
            initial={{ x: cardAnimation}}
            animate={{ x: 0}}
            transition={{ duration: 0.5 }}>
                <div className="p-8 rounded-t-lg">
                    <a href="#">
                        <img className="h-52 w-full object-cover text-white " src={`http://${data.image_url}`} alt="product image" />
                    </a>
                </div>
                <div className="px-5 pb-5">
                    <a href="#">
                        <h5 className="text-md font-semibold tracking-tight text-gray-900 dark:text-white max-h-7 truncate text-wrap">{data.name}</h5>
                    </a>
                    <div className="flex flex-row mb-1 min-h-7 truncate max-w-56">
                        { tags.map((tag) =>(
                            <div key={tag._id} className="flex flex-row border-solid border-2 p-1 text-white mr-1 rounded-lg text-xs ">
                                <Icons.TagsSvg width="16"  height="16"/>
                                <p className="text-white font-thin ml-1">
                                    {tag.name}</p>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-semibold text-gray-900 dark:text-white">{data.price}</span>
                        <button onClick={() => handleAddCart(data._id)} className="text-black bg-[#9720FC] hover:bg-[#4C127E] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm px-3 py-2.5 text-center">Add to cart</button>
                    </div>
                </div>
            </motion.div>
    );
}
 
export default Card;