import { motion } from "framer-motion";

const Pagination = ({ itemsPerPage, totalItems, currentPage, paginate }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="flex justify-center">
                {pageNumbers.map((number) => (
                    <motion.li key={number} className="mx-1" whileHover={{ scale: 1.1 }}>
                        <motion.button
                            onClick={() => paginate(number)}
                            className={`px-3 py-1 rounded-md ${
                                currentPage === number ? "bg-blue-500 text-white" : "bg-white text-blue-500"
                            }`}
                            whileTap={{ scale: 0.9 }}
                        >
                            {number}
                        </motion.button>
                    </motion.li>
                ))}
            </ul>
        </nav>
    );
};

export default Pagination;
