import axios from "axios";

const API_URL = "http://localhost:5000/api/excel";

export const excelService = {
  createTemplate: async () => {
    const response = await axios.get(`${API_URL}/template`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "excel_template.xlsx");
    document.body.appendChild(link);
    link.click();
  },
  createTemplateFilled: async () => {
    const response = await axios.get(`${API_URL}/template-filled`, {
      responseType: "blob",
    });
    const url = URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "excel_template_filled.xlsx");
    document.body.appendChild(link);
    link.click();
  },
  // uploadTemplate: async (file) => {
  //   const formData = new FormData();
  //   formData.append('file', file);

  //   const response = await axios.post(`${API_URL}/upload`, formData, {
  //     headers: { 'Content-Type': 'multipart/form-data' }
  //   });

  //   return response.data;
  // },
  uploadTemplate: async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob", // This ensures you get a blob even on a 422 status
      validateStatus: function (status) {
        return (status >= 200 && status < 300) || status === 422; // Resolve only if successful or if there's a validation error
      },
    });
    
    if (response.status === 422) {
      // Handle the blob which is expected to be the error file
      const timestamp = new Date().toISOString().replace(/[:\-T\.Z]/g, "");

      const url = URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `error_details_${timestamp}.txt`); // Set the filename for download
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      throw new Error("Errors in uploaded file."); // Optionally, throw to handle in catch
    }
  },
};
