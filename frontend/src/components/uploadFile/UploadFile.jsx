import React, { useRef, useState } from 'react';
import axios from '../../api/axios';
import './uploadFile.css';

export const UploadFile = (props) => {
  const [fileName, setFileName] = useState('');

  const removeFile = async () => {
    props.passFile([]);
  }

  const uploadFile = async (e) => {
    e.preventDefault();
    // setFileName();
    
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    try {
      const res = await axios.post('/v1/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      props.passFile(res.data, e.target.files[0].name);
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
    <div className='select-file'>
            <label onChange={uploadFile} htmlFor="formId" className='input-file-label'>
            <p>Select file</p>  
            <svg className="add-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6 13h-5v5h-2v-5h-5v-2h5v-5h2v5h5v2z"/></svg>
              <input name="" type="file" id="formId" hidden />
            </label>
    </div>
  )
}
