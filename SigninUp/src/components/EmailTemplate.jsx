import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPen } from "react-icons/fa";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editorData, setEditorData] = useState("");

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/email-templates"
        );
        setTemplates(response.data);
      } catch (error) {
        console.error("Error fetching email templates:", error);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateClick = async (slug) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/email-templates/${slug}`
      );
      setSelectedTemplate(response.data);
      setEditorData(response.data.temp_content);
    } catch (error) {
      console.error("Error fetching template content:", error);
    }
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
  };

  const handleSaveTemplate = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/save-email-templates/${selectedTemplate.temp_slug}`,
        {
          temp_slug: selectedTemplate.temp_slug,
          temp_content: editorData,
          file_path: `${selectedTemplate.temp_slug}.html`,
        }
      );
      alert("Template updated successfully!");
      setSelectedTemplate(null);
    } catch (error) {
      console.error("Error saving template:", error);
    }
  };

  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div
      style={{
        width: "100%",
        height: "auto",
        margin: "2rem",
        padding: "20px",
        backgroundColor: "#f8f9fa",
        borderRadius: "5px",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <h2
        style={{
          color: "white",
          backgroundColor: "#29395f",
          fontWeight: "bold",
          fontSize: "1.6rem",
          padding: "15px",
          marginBottom: "1rem",
          borderRadius: "5px",
        }}
      >
        Email Templates
      </h2>
      {selectedTemplate ? (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            backgroundColor: "#fff",
            borderRadius: "4px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <h3>{selectedTemplate.temp_title}</h3>
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={(event, editor) => {
              const data = editor.getData();
              setEditorData(data);
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "15px",
            }}
          >
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#4CAF50",
                color: "white",
                transition: "background-color 0.3s ease",
              }}
              onClick={handleSaveTemplate}
            >
              Save
            </button>
            <button
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                backgroundColor: "#f44336",
                color: "white",
                transition: "background-color 0.3s ease",
              }}
              onClick={handleCloseTemplate}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  textAlign: "left",
                  backgroundColor: "#e9ecef",
                }}
              >
                Template Name
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  textAlign: "left",
                  backgroundColor: "#e9ecef",
                }}
              >
                Created At
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  textAlign: "left",
                  backgroundColor: "#e9ecef",
                }}
              >
                Updated At
              </th>
              <th
                style={{
                  padding: "10px",
                  border: "1px solid #dee2e6",
                  textAlign: "left",
                  backgroundColor: "#e9ecef",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template, index) => (
              <tr
                key={template.temp_slug}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#fff",
                }}
              >
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {template.temp_slug}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {formatDateString(template.temp_created_at)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  {formatDateString(template.temp_updated_at)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #dee2e6",
                    textAlign: "left",
                  }}
                >
                  <button
                    onClick={() => handleTemplateClick(template.temp_slug)}
                    style={{
                      cursor: "pointer",
                      background: "none",
                      border: "none",
                      color: "#007bff",
                      fontSize: "1rem",
                    }}
                  >
                    <FaPen />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EmailTemplates;
