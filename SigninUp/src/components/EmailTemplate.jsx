import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPen } from "react-icons/fa"; // Import the pen icon
import "./EmailTemplates.css"; // Import your CSS file

const EmailTemplates = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

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
    } catch (error) {
      console.error("Error fetching template content:", error);
    }
  };

  const handleCloseTemplate = () => {
    setSelectedTemplate(null);
  };

  // Helper function to format date strings
  const formatDateString = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formats date as MM/DD/YYYY
  };

  return (
    <div
      className="email-template-container"
      style={{ width: "100%", height: "auto" }}
    >
      <h2 className="email-template-header">Email Templates</h2>
      {selectedTemplate ? (
        <div className="email-template-details">
          <h3>{selectedTemplate.temp_title}</h3>
          <div
            className="email-template-content"
            dangerouslySetInnerHTML={{ __html: selectedTemplate.temp_content }}
          />
          <button
            className="close-template-button"
            onClick={handleCloseTemplate}
          >
            Close
          </button>
        </div>
      ) : (
        <table className="email-template-table">
          <thead>
            <tr>
              <th>Template Name</th>
              <th>Created At</th>
              <th>Updated At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {templates.map((template) => (
              <tr key={template.temp_slug} className="email-template-row">
                <td>{template.temp_slug}</td>
                <td>{formatDateString(template.temp_created_at)}</td>
                <td>{formatDateString(template.temp_updated_at)}</td>
                <td>
                  <button
                    onClick={() => handleTemplateClick(template.temp_slug)}
                    className="edit-button"
                  >
                    <FaPen /> {/* Render pen icon */}
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
