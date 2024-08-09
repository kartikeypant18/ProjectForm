import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import "./ContactRequest.css";

const ContactRequest = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [subject, setSubject] = useState("");
  const [reply, setReply] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contact-requests")
      .then((response) => setContacts(response.data))
      .catch((error) =>
        console.error("Error fetching contact requests:", error)
      );
  }, []);

  const handleIconClick = (contact) => {
    setSelectedContact(contact);
  };

  const handleCloseDetails = () => {
    setSelectedContact(null);
    setSubject("");
    setReply("");
  };

  const handleSubjectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleSendReply = () => {
    const replyData = {
      subject,
      reply,
    };
    axios
      .post(
        `http://localhost:5000/api/contact-requests/${selectedContact.contact_id}/reply`,
        replyData
      )
      .then((response) => {
        console.log("Reply sent successfully:", response.data);
        handleCloseDetails();
      })
      .catch((error) => console.error("Error sending reply:", error));
  };

  return (
    <div className="table-container">
      {!selectedContact ? (
        <>
          <h2 className="table-header">Contact Requests</h2>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Number</th>
                <th>Messages</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.contact_id}>
                  <td>{contact.contact_id}</td>
                  <td>{contact.contact_name}</td>
                  <td>{contact.contact_email}</td>
                  <td>{contact.contact_number}</td>
                  <td>
                    <FaEnvelope
                      style={{ cursor: "pointer", justifyContent: "center" }}
                      onClick={() => handleIconClick(contact)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="details-container">
          <div className="details-header">
            <h2
              style={{
                padding: "15px",
                color: "white",
                backgroundColor: "rgb(41, 57, 95)",
                fontWeight: "bold",
                fontSize: "1.4rem",
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Message Requested
              <button
                className="close-details-button"
                onClick={handleCloseDetails}
              >
                &times;
              </button>
            </h2>
          </div>
          <table className="details-table">
            <tbody>
              <tr>
                <th>ID</th>
                <td>{selectedContact.contact_id}</td>
              </tr>
              <tr>
                <th>Name</th>
                <td>{selectedContact.contact_name}</td>
              </tr>
              <tr>
                <th>Email</th>
                <td>{selectedContact.contact_email}</td>
              </tr>
              <tr>
                <th>Number</th>
                <td>{selectedContact.contact_number}</td>
              </tr>
              <tr>
                <th>Messages</th>
                <td>
                  <ol style={{ marginLeft: "1rem" }}>
                    {selectedContact.contact_messages.map((message, index) => (
                      <li key={index}>{message}</li>
                    ))}
                  </ol>
                </td>
              </tr>
            </tbody>
          </table>
          <h2
            style={{
              padding: "15px",
              color: "white",
              backgroundColor: "rgb(41, 57, 95)",
              fontWeight: "bold",
              fontSize: "1.4rem",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            Reply
          </h2>
          <div className="reply-section">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
              className="reply-input"
            />
            <CKEditor
              style={{ height: "100rem" }}
              editor={ClassicEditor}
              data={reply}
              onChange={(event, editor) => {
                const data = editor.getData();
                setReply(data);
              }}
              placeholder="Reply"
            />
            <button
              style={{ marginTop: "1rem" }}
              onClick={handleSendReply}
              className="send-reply-button"
            >
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequest;
