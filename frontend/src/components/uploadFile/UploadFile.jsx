import React, { useState } from 'react';
import axios from '../../api/axios';

export const UploadFile = (props) => {
    const [fileName, setFileName] = useState('');
  const [file, setFile] = useState('Choose File');
  const [parsedFile, setParsedFile] = useState('');

  const onChange = e => {
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
  }

  const removeFile = async () => {
    setFile('');
    setFileName('');
    props.passFile([]);
  }

  const uploadFile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      props.passFile(res.data);
    } catch (error) {
      if(error.status === 500) {
        console.error("Something went wrong with the server");
      }
      else {
        console.error(error.message)
      }
    }

  }

  return (
    <div>
        <form className='file-input' onSubmit={uploadFile}>
              <input
              type='file'
              id='customFile'
              className='custom-file-input'
              onChange={onChange}/>
              <button type='submit'>Upload</button>
            </form>
              {/* <button onClick={removeFile}>remove</button> */}
    </div>
  )
}
