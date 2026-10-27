import { useState, useEffect } from 'react';
import API from '../services/api';
import ContactUs from '../components/ContactUs';

export default function Home() {
    const [companies, setCompanies] = useState([]);
    const [category, setCategory] = useState('Semua');
    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        API.get('/companies')
            .then(res => {
                // Pastikan selalu menyimpannya sebagai array untuk mencegah error .filter
                const data = res.data.data || res.data;
                setCompanies(Array.isArray(data) ? data : []);
            })
            .catch(err => {
                console.error("Gagal memuat data:", err);
                setCompanies([]); // Set jadi array kosong jika error
            });
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, category]);

    // Amankan dengan Array.isArray atau default [] agar tidak pernah error .filter
    const safeCompanies = Array.isArray(companies) ? companies : [];
    
    const filteredData = safeCompanies.filter(c => {
        const matchCategory = category === 'Semua' || c.category_name === category;
        const matchSearch = c.name ? c.name.toLowerCase().includes(search.toLowerCase()) : false;
        return matchCategory && matchSearch;
    });

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    return (
        <div 
            className="min-h-screen bg-blue-950 bg-cover bg-center bg-fixed py-6 px-4 md:py-10 md:px-6"
            style={{ backgroundImage: "url('/the-historich.jpg')" }}
        >
            {/* Kotak Utama */}
            <div 
                className="max-w-[1000px] mx-auto rounded-xl shadow-2xl p-4 md:p-6 mb-8 backdrop-blur-md border border-white/20"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.75)' }}
            >
                
                {/* Header, Search & Filter */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                    <h2 className="text-xl font-bold text-gray-900">List Perusahaan</h2>
                    
                    <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Cari nama perusahaan..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white/90 focus:outline-none focus:ring-1 focus:ring-blue-950 w-full md:w-64"
                        />

                        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                            <span className="text-sm font-semibold text-gray-700">Kategori:</span>
                            <select 
                                value={category} 
                                onChange={(e) => setCategory(e.target.value)}
                                className="border border-gray-300 rounded px-3 py-1.5 text-sm bg-white/90 focus:outline-none"
                            >
                                <option value="Semua">Semua</option>
                                <option value="Teknologi">Teknologi</option>
                                <option value="Kuliner & F&B">Kuliner & F&B</option>
                                <option value="Keuangan & Fintech">Keuangan & Fintech</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Tampilan Desktop: Tabel */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-sm">
                        <thead>
                            <tr className="border-b border-gray-300 text-gray-800 bg-white/50">
                                <th className="p-3 w-1/5">Nama</th>
                                <th className="p-3 w-1/6">Kategori</th>
                                <th className="p-3 w-1/3">Bergerak di bidang</th>
                                <th className="p-3 w-24">Gmaps</th>
                                <th className="p-3 w-24">Website</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/60">
                            {currentData.length > 0 ? (
                                currentData.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/40">
                                        <td className="p-3 font-semibold text-gray-900">{c.name}</td>
                                        <td className="p-3 text-gray-700">{c.category_name || '-'}</td>
                                        <td className="p-3 text-gray-700">{c.description}</td>
                                        <td className="p-3">
                                            {c.gmaps || c.website ? (
                                                <a href={c.gmaps || c.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Buka Maps</a>
                                            ) : '-'}
                                        </td>
                                        <td className="p-3">
                                            {c.website ? (
                                                <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline font-medium">Link Web</a>
                                            ) : '-'}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center p-6 text-gray-600">Tidak ada perusahaan yang ditemukan.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Tampilan Mobile: Kartu Responsif */}
                <div className="md:hidden space-y-4">
                    {currentData.length > 0 ? (
                        currentData.map((c) => (
                            <div key={c.id} className="bg-white/80 p-4 rounded-xl shadow-sm border border-gray-200/80 space-y-2">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-base font-bold text-gray-900">{c.name}</h3>
                                    <span className="text-[11px] font-bold text-blue-900 bg-blue-100/80 px-2 py-0.5 rounded">
                                        {c.category_name || 'Tanpa Kategori'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-700">
                                    <span className="font-semibold">Bergerak di bidang:</span> {c.description}
                                </p>
                                <div className="flex gap-4 text-xs pt-2 border-t border-gray-200">
                                    {c.gmaps && (
                                        <a href={c.gmaps} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">
                                            📍 Buka Maps
                                        </a>
                                    )}
                                    {c.website && (
                                        <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-blue-700 font-medium hover:underline">
                                            🔗 Website
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-6 text-gray-600 text-sm">Tidak ada perusahaan yang ditemukan.</div>
                    )}
                </div>

                {/* Kontrol Paginasi */}
                {filteredData.length > itemsPerPage && (
                    <div className="flex justify-between items-center border-t border-gray-300/80 pt-4 mt-6">
                        <span className="text-xs text-gray-700 font-medium">
                            Menampilkan {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} dari {filteredData.length} data
                        </span>

                        <div className="flex gap-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                    currentPage === 1 
                                        ? 'bg-gray-300/50 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-950 hover:bg-blue-900 text-white cursor-pointer'
                                }`}
                            >
                                Previous
                            </button>
                            
                            <span className="flex items-center text-xs font-bold px-2 text-gray-800">
                                {currentPage} / {totalPages}
                            </span>

                            <button
                                onClick= {handleNext}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1.5 rounded text-xs font-bold transition ${
                                    currentPage === totalPages 
                                        ? 'bg-gray-300/50 text-gray-400 cursor-not-allowed' 
                                        : 'bg-blue-950 hover:bg-blue-900 text-white cursor-pointer'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

            </div>

            {/* Komponen ContactUs */}
            <div className="max-w-[1000px] mx-auto">
                <ContactUs />
            </div>
        </div>
    );
}
