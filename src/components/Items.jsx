import { useState, useEffect } from "react";
import axios from "axios";
import Card from "./Cards";
import Icons from "../assets/svg";
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Pagination from "./Pagination";

const Items = () => {
    const [product, setProduct] = useState([]);
    const [tags, setTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const itemsPerPage = 8;

    function getProduct(pageNumber) {
        const skip = (pageNumber - 1) * itemsPerPage;
        return axios.get(`http://localhost:2020/api/product?limit=${itemsPerPage}&skip=${skip}`);
    }

    function getTag() {
        return axios.get('http://localhost:2020/api/tags');
    }

    useEffect(() => {
        getProduct(pageNumber).then(response => {
            setProduct(response.data.transformedProducts); // assuming response.data.products contains the products
            setTotalItems(response.data.totalProducts); // assuming response.data.total contains the total number of items
        }).catch(error => {
            console.error('Error fetching data:', error);
        });

        getTag().then(response => {
            setTags(response.data);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, [pageNumber]);

    function handleTagClick(tagName) {
        setSelectedTag(tagName);
    }

    function filteredProducts() {
        if (selectedTag !== null && selectedTag.trim() !== '') {
            return product.filter(item => item.tags.some(tag => tag.name === selectedTag));
        } else {
            return product;
        }
    }

    const filterPrd = filteredProducts();

    const paginate = (pageNumber) => {
        setPageNumber(pageNumber);
    };

    return (
        <div className="bg-slate-100 min-h-screen w-full p-8">
            <div className="flex flex-row mb-5 items-center">
                <p className="text-secondary mr-2">Tags :</p>
                {tags.map((tag) => (
                    <a href="#" onClick={() => handleTagClick(tag.name)} className={`flex flex-row items-center border-solid border-2 mr-1 rounded-lg px-2 py-1 text-secondary border-secondary hover:bg-slate-200 hover:border-slate-600 hover:text-slate-600 ${selectedTag === tag.name ? 'bg-slate-200 border-slate-900 text-slate-900' : ''}`} key={tag._id}>
                        <Icons.TagsSvg width={15} height={15} className="mr-1" />
                        <p>{tag.name}</p>
                    </a>
                ))}
            </div>
            <div className="flex flex-wrap gap-3 overflow-hidden mx-auto ps-2">
                {filterPrd.map((item) => (
                    <Card key={item._id} data={item} />
                ))}
            </div>
            <Pagination 
                itemsPerPage={itemsPerPage} 
                totalItems={totalItems} 
                currentPage={pageNumber} 
                paginate={paginate} 
            />
            <ToastContainer limit={3} />
        </div>
    );
}

export default Items;
