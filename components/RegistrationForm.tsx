
import React, { useState, useEffect } from 'react';

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState({
        // Student Data
        fullName: '',
        nickname: '',
        nisn: '',
        gender: 'Laki-laki',
        birthPlace: '',
        birthDate: '',
        childOrder: '',
        siblingCount: '',
        address: '',
        // Parent Data
        fatherName: '',
        fatherJob: '',
        motherName: '',
        motherJob: '',
        phone: '',
        parentAddress: '',
        // Previous School
        prevSchoolName: '',
        prevSchoolAddress: ''
    });

    const [isAddressSame, setIsAddressSame] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAddressCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsAddressSame(checked);
        if (checked) {
            setFormData(prev => ({ ...prev, parentAddress: prev.address }));
        } else {
             setFormData(prev => ({ ...prev, parentAddress: '' }));
        }
    }
    
    useEffect(() => {
        if (isAddressSame) {
            setFormData(prev => ({ ...prev, parentAddress: prev.address }));
        }
    }, [formData.address, isAddressSame]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, you would send this data to a server
        console.log("Form submitted:", formData);
        alert("Pendaftaran berhasil dikirim! (Data ditampilkan di console untuk demonstrasi)");
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm";
    const labelClass = "block text-sm font-medium text-gray-700";

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            {/* Section: Data Siswa */}
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">I. Data Calon Siswa</legend>
                <div>
                    <label htmlFor="fullName" className={labelClass}>Nama Lengkap</label>
                    <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="nickname" className={labelClass}>Nama Panggilan</label>
                    <input type="text" name="nickname" id="nickname" value={formData.nickname} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="nisn" className={labelClass}>NISN (jika ada)</label>
                    <input type="text" name="nisn" id="nisn" value={formData.nisn} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <span className={labelClass}>Jenis Kelamin</span>
                    <div className="mt-2 flex items-center space-x-6">
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                            <span className="ml-2 text-gray-700">Laki-laki</span>
                        </label>
                        <label className="flex items-center">
                            <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleChange} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300" />
                            <span className="ml-2 text-gray-700">Perempuan</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="birthPlace" className={labelClass}>Tempat Lahir</label>
                        <input type="text" name="birthPlace" id="birthPlace" value={formData.birthPlace} onChange={handleChange} className={inputClass} required/>
                    </div>
                    <div>
                        <label htmlFor="birthDate" className={labelClass}>Tanggal Lahir</label>
                        <input type="date" name="birthDate" id="birthDate" value={formData.birthDate} onChange={handleChange} className={inputClass} required/>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="childOrder" className={labelClass}>Anak ke-</label>
                        <input type="number" name="childOrder" id="childOrder" value={formData.childOrder} onChange={handleChange} className={inputClass} />
                    </div>
                     <div>
                        <label htmlFor="siblingCount" className={labelClass}>Jumlah Saudara</label>
                        <input type="number" name="siblingCount" id="siblingCount" value={formData.siblingCount} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
                <div>
                    <label htmlFor="address" className={labelClass}>Alamat Lengkap Siswa</label>
                    <textarea name="address" id="address" value={formData.address} onChange={handleChange} rows={3} className={inputClass} required></textarea>
                </div>
            </fieldset>

            {/* Section: Data Orang Tua */}
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">II. Data Orang Tua/Wali</legend>
                 <div>
                    <label htmlFor="fatherName" className={labelClass}>Nama Ayah</label>
                    <input type="text" name="fatherName" id="fatherName" value={formData.fatherName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="fatherJob" className={labelClass}>Pekerjaan Ayah</label>
                    <input type="text" name="fatherJob" id="fatherJob" value={formData.fatherJob} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="motherName" className={labelClass}>Nama Ibu</label>
                    <input type="text" name="motherName" id="motherName" value={formData.motherName} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="motherJob" className={labelClass}>Pekerjaan Ibu</label>
                    <input type="text" name="motherJob" id="motherJob" value={formData.motherJob} onChange={handleChange} className={inputClass} />
                </div>
                 <div>
                    <label htmlFor="phone" className={labelClass}>Nomor Telepon/HP Aktif</label>
                    <input type="tel" name="phone" id="phone" value={formData.phone} onChange={handleChange} className={inputClass} required/>
                </div>
                <div>
                    <label htmlFor="parentAddress" className={labelClass}>Alamat Lengkap Orang Tua</label>
                     <div className="mt-2 flex items-start">
                        <div className="flex items-center h-5">
                            <input id="same-address" name="same-address" type="checkbox" checked={isAddressSame} onChange={handleAddressCheckbox} className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="same-address" className="font-medium text-gray-700">Sama dengan alamat siswa</label>
                        </div>
                    </div>
                    <textarea name="parentAddress" id="parentAddress" value={formData.parentAddress} onChange={handleChange} rows={3} className={`${inputClass} mt-2`} disabled={isAddressSame} required></textarea>
                </div>
            </fieldset>

            {/* Section: Asal Sekolah */}
            <fieldset className="space-y-4 p-4 border border-gray-200 rounded-lg">
                <legend className="text-lg font-semibold text-gray-800 px-2">III. Asal Sekolah</legend>
                <div>
                    <label htmlFor="prevSchoolName" className={labelClass}>Nama TK/RA</label>
                    <input type="text" name="prevSchoolName" id="prevSchoolName" value={formData.prevSchoolName} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                    <label htmlFor="prevSchoolAddress" className={labelClass}>Alamat TK/RA</label>
                    <textarea name="prevSchoolAddress" id="prevSchoolAddress" value={formData.prevSchoolAddress} onChange={handleChange} rows={2} className={inputClass}></textarea>
                </div>
            </fieldset>
            
            <button type="submit" className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Kirim Pendaftaran
            </button>
        </form>
    );
}

export default RegistrationForm;
