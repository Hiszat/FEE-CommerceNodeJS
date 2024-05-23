import { useState } from "react";
import Modal from "./Modal";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { configHeader } from "../features/auth";
import { toast } from "react-toastify";
import { getUserDeliveryAddress } from "../features/api";
import MainURL from "../const/config";

const DeliveryAddress = () => {
    const [state, setState] = useState({
        isModalOpen: false,
        namaAlamat: "",
        selectedProvince: "",
        selectedRegency: "",
        selectedDistrict: "",
        selectedVillage: "",
        address: ""
    });

    const notify = () => {
        toast.success("Alamat ditambahkan", {
          position: "bottom-right",
          className: "w-64 h-6 text-xs",
          autoClose: 2500,
        });
    }

    const queryClient = useQueryClient();

    const hapusAlamat = (id) => {
        try {
            axios.delete(`${MainURL}/api/da/${id}`, configHeader);
            toast.warn("Alamat berhasil dihapus", {
                position: "bottom-right",
                className: "w-64 h-6 text-xs",
                autoClose: 2500,
            });
            queryClient.invalidateQueries('address');
        } catch (error) {
            toast.error(`Terjadi kesalahan : ${error}`, {
                position: "bottom-right",
                className: "w-64 h-6 text-xs",
                autoClose: 2500,
            });
        }
        
    }

    const fetchProvinces = async () => {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`);
        const provinces = await response.json();
        return provinces;
    }

    const fetchRegencies = async (provinceId) => {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinceId}.json`);
        const regencies = await response.json();
        return regencies;
    }

    const fetchDistricts = async (regencyId) => {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${regencyId}.json`);
        const districts = await response.json();
        return districts;
    }

    const fetchVillages = async (districtId) => {
        const response = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${districtId}.json`);
        const villages = await response.json();
        return villages;
    }

    const { isLoading: isLoadingProvinces, data: provinces, error: errorProvinces } = useQuery("province", fetchProvinces);
    const { isLoading: isLoadingAddress, data: addressGet, error: errorAddress } = useQuery("address", getUserDeliveryAddress);
    const { isLoading: isLoadingRegencies, data: regencies, error: errorRegencies } = useQuery(
        ["regency", state.selectedProvince],
        () => fetchRegencies(state.selectedProvince),
        { enabled: !!state.selectedProvince }
    );
    const { isLoading: isLoadingDistricts, data: districts, error: errorDistricts } = useQuery(
        ["district", state.selectedRegency],
        () => fetchDistricts(state.selectedRegency),
        { enabled: !!state.selectedRegency }
    );
    const { isLoading: isLoadingVillages, data: villages, error: errorVillages } = useQuery(
        ["village", state.selectedDistrict],
        () => fetchVillages(state.selectedDistrict),
        { enabled: !!state.selectedDistrict }
    );

    const openModal = () => setState(prevState => ({ ...prevState, isModalOpen: true }));
    const closeModal = () => setState(prevState => ({ ...prevState, isModalOpen: false }));

    const addAddress = async (requestBody) => {
        const response = await axios.post('http://localhost:2020/api/da', requestBody, configHeader);
        return response.data;
    }

    const mutation = useMutation(addAddress, {
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries('address');
            closeModal();
            notify();
        },
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState(prevState => ({ ...prevState, [name]: value }));
    }

    const handleSubmit = async () => {
        const provinceName = provinces.find(province => province.id === state.selectedProvince)?.name;
        const regencyName = regencies?.find(regency => regency.id === state.selectedRegency)?.name;
        const districtName = districts?.find(district => district.id === state.selectedDistrict)?.name;
        const villageName = villages?.find(village => village.id === state.selectedVillage)?.name;
        
        const requestBody = {
            nama: state.namaAlamat,
            kelurahan: villageName,
            kecamatan: districtName,
            kabupaten: regencyName,
            provinsi: provinceName,
            detail: state.address,
        };
    
        mutation.mutate(requestBody);
    }

    return (
        <>
            <button onClick={openModal} className="py-2 px-3 bg-orange-400 rounded-full">Tambah Alamat</button>
            {addressGet && addressGet.map((item) => (
                <div className="w-[790px] mt-3 border-2 border-primary p-3 flex items-center" key={item._id}>
                    <div className="w-4/5">
                        <h3 className="text-2xl font-medium">{item.nama}</h3>
                        <p className="font-medium">Alamat: <span className="font-thin">{item.kelurahan}, {item.kecamatan}, {item.kabupaten}, {item.provinsi}</span></p>
                        <p className="font-medium">Detail: <span className="font-thin">{item.detail}</span></p>
                    </div>
                    <div className="w-1/5 text-center">
                        <button onClick={() => hapusAlamat(item._id)}>Hapus</button>
                    </div>
                </div>
            ))}

            <Modal isOpen={state.isModalOpen} onClose={closeModal} title="Menambahkan address" btnText="Tambahkan" onSubmit={handleSubmit}>
                <label htmlFor="namaAlamat" className="block mb-2 text-sm font-medium text-gray-900">Nama Alamat</label>
                <input type="text" name="namaAlamat" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                    value={state.namaAlamat}
                    onChange={handleChange}
                />
                <label htmlFor="selectedProvince" className="block mb-2 text-sm font-medium text-gray-900">Pilih Provinsi</label>
                {isLoadingProvinces ? (
                    <p>Loading...</p>
                ) : errorProvinces ? (
                    <p>Error loading provinces</p>
                ) : (
                    <select
                        id="selectedProvince"
                        name="selectedProvince"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                        value={state.selectedProvince}
                        onChange={handleChange}
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map((item) => (
                            <option key={item.id} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                )}

                {state.selectedProvince && (
                    <>
                        <label htmlFor="selectedRegency" className="block mb-2 text-sm font-medium text-gray-900">Pilih Kabupaten</label>
                        {isLoadingRegencies ? (
                            <p>Loading...</p>
                        ) : errorRegencies ? (
                            <p>Error loading regencies</p>
                        ) : (
                            <select
                                id="selectedRegency"
                                name="selectedRegency"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={state.selectedRegency}
                                onChange={handleChange}
                            >
                                <option value="">Pilih Kabupaten</option>
                                {regencies.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        )}
                    </>
                )}

                {state.selectedRegency && (
                    <>
                        <label htmlFor="selectedDistrict" className="block mb-2 text-sm font-medium text-gray-900">Pilih Kecamatan</label>
                        {isLoadingDistricts ? (
                            <p>Loading...</p>
                        ) : errorDistricts ? (
                            <p>Error loading districts</p>
                        ) : (
                            <select
                                id="selectedDistrict"
                                name="selectedDistrict"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={state.selectedDistrict}
                                onChange={handleChange}
                            >
                                <option value="">Pilih Kecamatan</option>
                                {districts.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        )}
                    </>
                )}

                {state.selectedDistrict && (
                    <>
                        <label htmlFor="selectedVillage" className="block mb-2 text-sm font-medium text-gray-900">Pilih Desa</label>
                        {isLoadingVillages ? (
                            <p>Loading...</p>
                        ) : errorVillages ? (
                            <p>Error loading villages</p>
                        ) : (
                            <select
                                id="selectedVillage"
                                name="selectedVillage"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                                value={state.selectedVillage}
                                onChange={handleChange}
                            >
                                <option value="">Pilih Desa</option>
                                {villages.map((item) => (
                                    <option key={item.id} value={item.id}>{item.name}</option>
                                ))}
                            </select>
                        )}
                    </>
                )}
                {state.selectedVillage && (
                    <>
                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900">Detail Alamat</label>
                        <input type="text" name="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                            value={state.address}
                            onChange={handleChange}/>
                    </>
                )}
            </Modal>
        </>
    );
}

export default DeliveryAddress;
