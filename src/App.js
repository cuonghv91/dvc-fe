import './App.scss';
import { UploadIcon, SuccessIcon } from './components/Icon'
import { useState } from 'react'
import axios from 'axios'

const UPLOAD_ENPOINT = 'http://localhost:3001'

function App() {
  const [files, setFiles] = useState(null)
  const [uploadMessage, setUploadMessage] = useState("Click or drag to upload your dataset");
  const [itemName, setItemName] = useState('')
  const [error, setError] = useState(false);
  const [repoLink, setRepoLink] = useState('')
  const [spinnerGit, setSpinnerGit] = useState(false)
  const [spinnerUpload, setSpinnerUpload] = useState(false)

  const onHandleUploadFiles = (event) => {
    setUploadMessage(`You have seleceted ${event.target.files.length} files`)
    setFiles(event.target.files)
  }

  const onHandleRepoInput = (event) => {
    setRepoLink(event.target.value)
  }

  const onChangeItemName = (event) => {
    setItemName(event.target.value)
  }

  const onSubmitRepo = async () => {
    const result = await axios.post(UPLOAD_ENPOINT + '/git-repo', { name: repoLink })
    console.log(111, result)
  }

  const onHandleUploadSubmit = async (event) => {
    event.preventDefault();

    if (files === null || itemName === '') {
      setError(true)
    } else {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
          formData.append(`images[${i}]`, files[i])
      }
      const fileUploadAxiosConfig = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
  
      const datasetNameData = {
        nameDataset: itemName
      }
  
      const fileUploadResult = await axios.post(UPLOAD_ENPOINT + '/dataset-upload', formData, fileUploadAxiosConfig)
      const nameDatasetResult = await axios.post(UPLOAD_ENPOINT + '/name-data-set', datasetNameData)
    }
  }

  return (
    <div className="app util_boder-box">

      <div className="git-input-box util_flex-row-between-center util_mgb-8">
        <input value={repoLink} onChange={onHandleRepoInput} placeholder="Enter your git repository link" className="git-input-box__input util_boder-box util_typo-h1" type="text"/>
        <button onClick={onSubmitRepo} className="git-input-box__btn util_radius util_pointer util_flex-row-center-center">
          <span>ADD</span>
          {spinnerGit && <img className="spinner" src="/images/spinner.gif" alt="spin" />}
        </button>
      </div>
      
      <form onSubmit={onHandleUploadSubmit}>
        <div className="upload-box">
          <div className="upload-box__area util_radius util_flex-col-center-center util_pointer util_mgb-4">
            {files === null ? <UploadIcon /> : <SuccessIcon />}
            <div className="upload-box__inform-text-area util_typo-big-1">
              {uploadMessage}
            </div>
            <input type="file" className="upload-box__file-input util_pointer" onChange={onHandleUploadFiles} multiple="true"/>
          </div>
          <div className="git-input-box util_flex-row-between-center util_mgb-8">
            <input value={itemName} onChange={onChangeItemName} placeholder="Enter your dataset name" className="git-input-box__input util_boder-box util_typo-h1" type="text"/>
            <button onClick={onHandleUploadSubmit} className="git-input-box__btn util_radius util_pointer util_flex-row-center-center">
              <span>ADD</span>
              {spinnerUpload && <img className="spinner" src="/images/spinner.gif" alt="spin" />}
            </button>
          </div>
        </div>
        {error && <div className="upload-box__error-message">
          You must upload dataset and its name before submit
        </div>}
      </form>


    </div>
  );
}

export default App;
