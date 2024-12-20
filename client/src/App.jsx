import { useRef, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { excelService } from "./services/excelService";
import "./App.css";

function App() {
  const [infoMessage, setInfoMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const clearInfoMsg = (timeout = 0) => {
    setTimeout(() => {
      setInfoMessage("");  // Stop loading when the message is cleared
    }, timeout);
  };

  const handleDownloadTemplate = async () => {
    try {
      clearInfoMsg();
      // setIsLoading(true);
      await excelService.createTemplate();
      setInfoMessage("Template downloaded successfully!");
    } catch (error) {
      console.error("Error downloading template:", error);
      setInfoMessage("Error downloading template");
    } finally {
      setIsLoading(false);
      clearInfoMsg(6000);
    }
  };

  const handleDownloadTemplateFilled = async () => {
    try {
      clearInfoMsg();
      // setIsLoading(true);
      await excelService.createTemplateFilled();
      setInfoMessage("Template filled downloaded successfully!");
    } catch (error) {
      console.error("Error downloading filled template:", error);
      setInfoMessage("Error downloading filled template");
    } finally {
      setIsLoading(false);
      clearInfoMsg(6000);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        clearInfoMsg();
        setIsLoading(true);
        await excelService.uploadTemplate(file);
        setInfoMessage("Upload successful!");
      } catch (error) {
        console.error("Error uploading file:", error);
        setInfoMessage("Upload failed. Please try again.");
      } finally {
        event.target.value = null;
        setIsLoading(false);
        clearInfoMsg(6000);
      }
    }
  };

  const handleUploadExcel = () => {
    if (!isLoading) {
      fileInputRef.current.click(); // Programmatically click the hidden file input
    }
  };

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Excel Template</h1>
      <div className="card">
        <button
          disabled={isLoading}
          style={{ marginRight: 12 }}
          onClick={handleDownloadTemplate}
        >
          Download Template
        </button>
        <button
          disabled={isLoading}
          style={{ marginRight: 12 }}
          onClick={handleDownloadTemplateFilled}
        >
          Download Filled Template 
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
          accept=".xlsx, .xls"
        />
        <button
          disabled={isLoading}
          onClick={handleUploadExcel}
        >
          Upload Excel
        </button>
      </div>
      {infoMessage && <p>{infoMessage}</p>}
      {isLoading && <p>Loading...</p>}
    </>
  );
}

export default App;
