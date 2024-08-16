import React, { useEffect, useState } from "react";
import { FaEnvelope } from "react-icons/fa";
import axios from "axios";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ContactRequest.css";

const ContactRequest = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [subject, setSubject] = useState("");
  const [reply, setReply] = useState("");
  const [sentMessages, setSentMessages] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/contact-requests")
      .then((response) => setContacts(response.data))
      .catch((error) =>
        console.error("Error fetching contact requests:", error)
      );
  }, []);

  useEffect(() => {
    if (selectedContact?.contact_id) {
      axios
        .get(
          `http://localhost:5000/api/sent-messages/${selectedContact.contact_id}`
        )
        .then((response) =>
          setSentMessages((prev) => ({
            ...prev,
            [selectedContact.contact_id]: response.data,
          }))
        )
        .catch((error) =>
          console.error("Error fetching sent messages:", error)
        );
    }
  }, [selectedContact]);

  const handleIconClick = (contact) => {
    setSelectedContact({
      ...contact,
      contact_messages: contact.contact_messages || [],
    });
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
    if (!reply || !selectedContact?.contact_id) {
      toast.error("Please fill in all fields before sending.");
      return;
    }

    const replyData = {
      contact_id: selectedContact.contact_id,
      message: reply,
    };

    axios
      .post("http://localhost:5000/api/sendReply", replyData)
      .then(() => {
        toast.success("Message sent successfully!");
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.contact_id === selectedContact.contact_id
              ? { ...contact, replied: true, contact_status: "attended" }
              : contact
          )
        );
        setSentMessages((prevSentMessages) => ({
          ...prevSentMessages,
          [selectedContact.contact_id]: [
            ...(prevSentMessages[selectedContact.contact_id] || []),
            reply,
          ],
        }));
        handleCloseDetails();
      })
      .catch((error) => {
        console.error("Error sending reply or updating status:", error);
      });
  };

  return (
    <div className="table-container">
      <ToastContainer />
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
                <tr
                  key={contact.contact_id}
                  style={{
                    backgroundColor:
                      contact.contact_status === "attended"
                        ? "#d4edda" // Light green color for attended
                        : contact.replied
                        ? "#d4edda" // Light green color if replied
                        : "inherit", // Default color if not attended
                  }}
                >
                  <td>{contact.contact_id}</td>
                  <td>{contact.contact_name}</td>
                  <td>{contact.contact_email}</td>
                  <td>{contact.contact_number}</td>
                  <td>
                    <FaEnvelope
                      style={{
                        cursor: "pointer",
                        color: "black",
                      }}
                      onClick={() => handleIconClick(contact)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : (
        <div className="chat-container">
          <div className="chat-header">
            <h2 className="chat-title">
              Chat with {selectedContact.contact_name}
            </h2>
            <button className="close-chat-button" onClick={handleCloseDetails}>
              &times;
            </button>
          </div>
          <div className="chat-messages">
            <div className="messages-list">
              {selectedContact?.contact_messages?.length > 0 ? (
                selectedContact.contact_messages.map((message, index) => (
                  <div
                    key={index}
                    className={`message ${message.type}`}
                    style={{
                      backgroundColor:
                        message.type === "request" ? "#a5b8cc" : "#d1e7dd", // Different colors for request and reply
                    }}
                  >
                    <div className="message-content">{message.content}</div>
                  </div>
                ))
              ) : (
                <div className="no-messages">No messages available</div>
              )}
            </div>
          </div>
          <div className="reply-section">
            <input
              type="text"
              placeholder="Subject"
              value={subject}
              onChange={handleSubjectChange}
              className="reply-input"
            />
            <CKEditor
              editor={ClassicEditor}
              data={reply}
              onChange={(event, editor) => {
                const data = editor.getData();
                setReply(data);
              }}
              config={{
                placeholder: "Write your reply here...",
              }}
            />
            <button onClick={handleSendReply} className="send-reply-button">
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactRequest;
