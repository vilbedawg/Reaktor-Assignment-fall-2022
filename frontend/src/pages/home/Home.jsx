import './home.css';
import { useRef, useState } from "react"
import React from 'react';
import {  Details } from '../../components/details/Details';
import { UploadFile } from '../../components/uploadFile/UploadFile';

export const Home = () => {
    const [data, setData] = useState([]);
    const [isActivePkg, setActivePkg] = useState('');
    const [currentFile, setCurrentFile] = useState('');
    const pkgItemRef = useRef(null);


    const showDetails = (pkg) => {
        setActivePkg(pkg);  
    }

    const setFile = (file, filename) => {
        setData(file);
        setCurrentFile(filename);
    }

    const showDependency = (pkg) => {
        const searchName = pkg[0] || pkg['name']
        const found = data.find(x => x['name'] === searchName);
        if(found === undefined) return;
        setActivePkg(found)
        setTimeout(() => {
            pkgItemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
       }, 100);
    }

  return (
      data.length === 0 
      ? 
      (
        <div className='details empty'>
                <h3>No file selected</h3>
                <UploadFile passFile={setFile}/>
        </div>
      )
      :
      (
        <>
        <div className='close-file' onClick={() => setData([])}>
            <p>{currentFile}</p>
         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm5.5 16.084l-1.403 1.416-4.09-4.096-4.102 4.096-1.405-1.405 4.093-4.092-4.093-4.098 1.405-1.405 4.088 4.089 4.091-4.089 1.416 1.403-4.092 4.087 4.092 4.094z"/></svg>
        </div>
        <div className="packages">
            <div className="pkgList">
                {data.map((item, key) => {
                    return (
                        <span key={key} 
                            className={isActivePkg['name'] === item['name'] ? "pkgName active" : "pkgName"} 
                            onClick={() => showDetails(item)}
                            ref={isActivePkg['name'] === item['name'] ? pkgItemRef : null}
                            >
                            {
                                item['name']
                            }
                        </span>
                    )
                })}
            </div>
        </div>
        {isActivePkg !== "" 
        ?   (
            <div className="details">
                <div className="header">
                        <span onClick={() => setActivePkg('')} className="return-button">
                            View All
                        </span>
                        <span>{isActivePkg['name']}</span>
                    </div>
                <div className='general details-container'>
                    <Details pkg={isActivePkg}/>
                </div>
                <div className='general dependencies-container'>
                <div className='dependencies'>
                        <h3>Dependencies</h3>
                        {isActivePkg["DEPENDENCIES"] !== null
                        ? 
                        (
                            <Details pkg={isActivePkg['DEPENDENCIES']} 
                                    dependency={true} 
                                    showDependency={showDependency}
                                    data={data}
                                />
                        )
                        : null
                        } 
                </div>
                <div className='reverse-dependencies'>
                        <h3>Reverse dependencies</h3>
                        {data.map((item, i) => {
                                return(
                                        item['DEPENDENCIES'] !== undefined 
                                        && Object.keys(item['DEPENDENCIES']).length !== 0
                                        && Object.keys(item['DEPENDENCIES']).includes(isActivePkg['name'])
                                        ? <div key={i}  
                                                className="pkg-keys">
                                                    <span className='dependency-clickable' 
                                                        onClick={() => showDependency(item)}>
                                                        {item['name'].toUpperCase()}
                                                    </span>
                                            </div>
                                        : null    
                                    )
                                }
                            )
                        }
                </div>  
                </div>
            </div>
            )
            :  
            (
                <div className='details all' style={{backgroundColor: "white"}}>
                    {
                        data.map((item, key) => {
                            return (
                                <div className='package-card' key={key} onClick={() => showDependency(item)}>
                                <span  
                                    className="card-detail" 
                                    >
                                    {
                                        item['name']
                                    }
                                </span>
                                <span className='box-svg'>
                                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.499 12.03v11.971l-10.5-5.603v-11.835l10.5 5.467zm11.501 6.368l-10.501 5.602v-11.968l10.501-5.404v11.77zm-16.889-15.186l10.609 5.524-4.719 2.428-10.473-5.453 4.583-2.499zm16.362 2.563l-4.664 2.4-10.641-5.54 4.831-2.635 10.474 5.775z"/></svg>
                                </span>
                                </div>
                            )})
                    }
                </div> 
            )
        }
    </>
      )
   
  )
}
