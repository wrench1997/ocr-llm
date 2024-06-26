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
    setResult('Please wait for response ...');
    try {
      const response = await axios.post('http://localhost:3001/ocrllm', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    const parsedData = JSON.parse(response.data);
    const formattedJsonString = JSON.stringify(parsedData, null, 2);

    //setFormattedData(formattedJsonString);
    // 设置结果
    setResult( formattedJsonString);
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
