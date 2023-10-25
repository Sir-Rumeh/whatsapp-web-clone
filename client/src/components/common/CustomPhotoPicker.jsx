import React, { useState, useRef } from "react";

const FileUpload = ({ handleFileChange }) => {
	const fileRef = useRef < HTMLInputElement > null;

	const handleFileChange = async () => {
		try {
			const file = e.currentTarget.files;
			if (file) {
				if (!isFileTypeValid(file[0].name)) notifyError("File should be either pdf, jpg, png or jpeg");
				if (!isFileSizeValid(file[0].size)) notifyError("File should be lesser than or equal to 5MB");
				const base64 = await convertBase64(file[0]);
				formik.setFieldValue(name, base64);
				// formik.setFieldValue(name, file[0]);
				setUploadedfileName(file[0].name);
			}
		} catch (error) {
			return Promise.reject(error);
		}
	};

	return (
		<div className="relative">
			<input type="file" ref={fileRef} className="absolute inset-0 z-10 hidden" onChange={handleFileChange} />
			<button
				type="button"
				className="cursor-pointer px-10 py-4 w-full p-6 border-2 rounded-xl flex items-center justify-center border-dashed"
				onClick={() => {
					if (fileRef.current) {
						fileRef.current.click();
					}
				}}
			></button>
		</div>
	);
};

export default FileUpload;
