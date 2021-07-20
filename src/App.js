import "./App.scss";
import { UploadIcon, SuccessIcon } from "./components/Icon";
import { useState } from "react";
import axios from "axios";

const UPLOAD_ENPOINT = "http://localhost:3001";

function App() {
  const [files, setFiles] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(
    "Click or drag to upload your dataset"
  );
  const [itemName, setItemName] = useState("");
  const [error, setError] = useState("");
  const [repoLink, setRepoLink] = useState("");
  const [spinnerGit, setSpinnerGit] = useState(false);
  const [spinnerUpload, setSpinnerUpload] = useState(false);
  const [toggleGitSetup, setToggleGitSetup] = useState(true);
  const [errorGit, setErrorGit] = useState("");
  const [datasetList, setDatasetList] = useState([]);

  const onHandleUploadFiles = (event) => {
    setUploadMessage(`You have seleceted ${event.target.files.length} files`);
    setFiles(event.target.files);
  };

  const onHandleRepoInput = (event) => {
    setRepoLink(event.target.value);
  };

  const onChangeItemName = (event) => {
    setItemName(event.target.value);
  };

  const onSubmitRepo = async () => {
    setSpinnerGit(true);
    try {
      const result = await axios.post(UPLOAD_ENPOINT + "/git-repo", {
        name: repoLink,
      });
      if (result.data.msg === "success") {
        setToggleGitSetup(false);
      }
    } catch (err) {
      setErrorGit("You already configured this repo !");
      setToggleGitSetup(false);
    }
    setSpinnerGit(false);
  };

  const onHandleUploadSubmit = async (event) => {
    event.preventDefault();

    if (files === null || itemName === "") {
      setError("You must upload dataset and its name before submit");
    } else {
      setError("");
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append(`file`, files[i]);
      }
      const fileUploadAxiosConfig = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };

      const datasetNameData = {
        nameDataset: itemName,
        repoName: repoLink.split(".git").join("").split("/")[
          repoLink.split(".git").join("").split("/").length - 1
        ],
      };
      setSpinnerUpload(true);
      try {
        const nameDatasetResult = await axios.post(
          UPLOAD_ENPOINT + "/name-data-set",
          datasetNameData
        );
        const fileUploadResult = await axios.post(
          UPLOAD_ENPOINT + "/dataset-upload",
          formData,
          fileUploadAxiosConfig
        );

        if (fileUploadResult.data.msg === "success") {
          // window.location.reload();
          const getDatasetList = await axios.get(UPLOAD_ENPOINT + "/dataset");
          setDatasetList(getDatasetList.data.list);
          setToggleGitSetup(true);
          files(null);
          setErrorGit("");
          setError("");
        }
      } catch (err) {
        setError("System error !");
      }
      setSpinnerUpload(false);
    }
  };

  return (
    <div className="app util_boder-box">
      {toggleGitSetup && (
        <div>
          <div className="git-input-box util_flex-row-between-center util_mgb-8">
            <input
              value={repoLink}
              onChange={onHandleRepoInput}
              placeholder="Enter your git repository link"
              className="git-input-box__input util_boder-box util_typo-h1"
              type="text"
            />
            <button
              onClick={onSubmitRepo}
              className="git-input-box__btn util_radius util_pointer util_flex-row-center-center"
            >
              <span>ADD</span>
              {spinnerGit && (
                <img className="spinner" src="/images/spinner.gif" alt="spin" />
              )}
            </button>
          </div>
          {errorGit.length !== 0 && (
            <div className="upload-box__error-message">{errorGit}</div>
          )}
        </div>
      )}

      {!toggleGitSetup && (
        <form onSubmit={onHandleUploadSubmit}>
          <div className="upload-box">
            <div className="upload-box__area util_radius util_flex-col-center-center util_pointer util_mgb-4">
              {files === null ? <UploadIcon /> : <SuccessIcon />}
              <div className="upload-box__inform-text-area util_typo-big-1">
                {uploadMessage}
              </div>
              <input
                type="file"
                className="upload-box__file-input util_pointer"
                onChange={onHandleUploadFiles}
                multiple="true"
                name="file"
              />
            </div>
            <div className="git-input-box util_flex-row-between-center util_mgb-8">
              <input
                value={itemName}
                onChange={onChangeItemName}
                placeholder="Enter your dataset name"
                className="git-input-box__input util_boder-box util_typo-h1"
                type="text"
              />
              <button
                onClick={onHandleUploadSubmit}
                className="git-input-box__btn util_radius util_pointer util_flex-row-center-center"
              >
                <span>ADD</span>
                {spinnerUpload && (
                  <img
                    className="spinner"
                    src="/images/spinner.gif"
                    alt="spin"
                  />
                )}
              </button>
            </div>
          </div>
          {error.length !== 0 && (
            <div className="upload-box__error-message">{error}</div>
          )}
        </form>
      )}

      {datasetList.length !== 0 && (
        <div>
          <h1>YOUR DATASET</h1>
          <h3>Repo: {repoLink}</h3>
          {datasetList.map((item) => (
            <div className="util_mgb-4">
              <div className="dataset">
                <div className="dataset__head util_flex-row-start-center util_weight-600">
                  Dataset Name: {item.datasetName}
                </div>

                <div className="dataset__content">
                  {item.list.map((item) => (
                    <div className="dataset__item util_flex-row-start-center">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="dataset__intro">
                  <div>Run the following comment to get: </div>
                  <div className="util_weight-600">
                    dvc get {repoLink}
                    {item.datasetName}
                  </div>
                </div>
                <div className="dataset__intro">
                  <div>Run the following comment to view: </div>
                  <div className="util_weight-600">
                    dvc list {repoLink}
                    {item.datasetName}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
