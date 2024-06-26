import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import '../App.css'; // 导入自定义 CSS

const ImageUploadAndAnalyze = () => {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: acceptedFiles => {
      const file = acceptedFiles[0];
      setImage(Object.assign(file, {
        preview: URL.createObjectURL(file)
      }));
      analyzeImage(file);
    }
  });

  const analyzeImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('YOUR_BACKEND_ENDPOINT', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setResult(response.data);
    } catch (error) {
      console.error('Error uploading image:', error);
      setResult('Error analyzing image');
    }
  };

  return (
    <div className="container">
      <div className="dropzone" {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop an image here, or click to select one</p>
      </div>
      {image && <img className="image-preview" src={image.preview} alt="preview" />}
      {result && <div className="result">{JSON.stringify(result, null, 2)}</div>}
    </div>
  );
};

export default ImageUploadAndAnalyze;
