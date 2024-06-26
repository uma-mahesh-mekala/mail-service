import { useState } from "react";

function App() {
  let [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  let [message, setMessage] = useState("");
  let [attachment, setAttachment] = useState("");
  let [responseMessage, setResponseMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create a FormData object to handle file uploads
    const formData = new FormData();
    formData.append("email", email);
    formData.append("message", message);
    formData.append("subject", subject);
    let hasFile = false;
    if (e.target.attachment.files[0]) {
      formData.append("attachment", e.target.attachment.files[0]);
      hasFile = true;
    }

    const fetchOptions = {
      method: "POST",
      body: hasFile ? formData : JSON.stringify({ email, subject, message }),
      mode: "cors",
    };

    if (!hasFile) {
      fetchOptions.headers = {
        "Content-Type": "application/json",
      };
    }

    // Fetch API to send the form data to the Fastify backend
    try {
      const response = await fetch(
        "http://localhost:3001/api/mail",
        fetchOptions
      );

      if (response.ok) {
        setResponseMessage("Mail sent successfully");
      } else {
        setResponseMessage("Error sending mail");
      }
      const result = await response.json();
      setResponseMessage(result.message);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <header>
        <h1>Mail Service</h1>
      </header>
      <p className="response-message">{responseMessage}</p>
      <form onSubmit={handleSubmit} id="mail-form">
        <label htmlFor="email">To Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="subject">Subject:</label>
        <input
          type="text"
          name="subject"
          id="subject"
          value={subject}
          required
          onChange={(e) => setSubject(e.target.value)}
        />
        <label htmlFor="message">Message:</label>
        <textarea
          name="message"
          id="message"
          rows="5"
          columns="30"
          value={message}
          required
          onChange={(e) => setMessage(e.target.value)}
        />
        <label htmlFor="attachment">Attachment:</label>
        <input
          type="file"
          name="attachment"
          id="attachment"
          value={attachment}
          onChange={(e) => setAttachment(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
