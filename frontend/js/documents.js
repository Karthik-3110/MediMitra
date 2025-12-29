document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const uploadBtn = document.getElementById("uploadBtn");
  const statusText = document.getElementById("statusText");
  const questionInput = document.getElementById("questionInput");
  const askBtn = document.getElementById("askBtn");
  const qaAnswer = document.getElementById("qaAnswer");

  let documentLoaded = false;

  // Helper function for fetch with timeout
  async function fetchWithTimeout(resource, options = {}) {
    const { timeout = 10000 } = options;
    
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
      ...options,
      signal: controller.signal  
    });
    clearTimeout(id);

    return response;
  }

  // ================= TEST BACKEND CONNECTION =================
  async function testBackendConnection() {
    try {
      const response = await fetchWithTimeout("http://127.0.0.1:8001/");
      if (response.ok) {
        console.log("Backend connection successful");
        return true;
      }
    } catch (error) {
      console.error("Backend connection failed:", error);
      qaAnswer.innerHTML = `
        <div style="color: #ef4444; padding: 20px; background: rgba(239,68,68,0.1); border-radius: 10px;">
          <strong>⚠️ Backend Connection Failed</strong><br>
          Please make sure the backend server is running:<br>
          1. Open PowerShell<br>
          2. Run: python main.py<br>
          3. Wait for "Uvicorn running on http://0.0.0.0:8000"<br><br>
          Error: ${error.message}
        </div>
      `;
      return false;
    }
  }

  // Test connection on page load
  testBackendConnection();

  // ================= FILE SELECT =================
  fileInput.addEventListener("change", () => {
    if (fileInput.files.length > 0) {
      statusText.innerText = `Selected: ${fileInput.files[0].name}`;
      statusText.style.color = "#38bdf8";
    }
  });

  // ================= UPLOAD DOCUMENT =================
  uploadBtn.addEventListener("click", async () => {
    if (fileInput.files.length === 0) {
      alert("Please select a PDF or TXT file first");
      return;
    }

    const file = fileInput.files[0];
    
    // Check file type
    const allowedTypes = ['.pdf', '.txt'];
    const fileExt = '.' + file.name.split('.').pop().toLowerCase();
    
    if (!allowedTypes.includes(fileExt)) {
      alert("Please upload only PDF or TXT files");
      return;
    }

    statusText.innerText = "Uploading document...";
    statusText.style.color = "#f59e0b";
    uploadBtn.disabled = true;
    qaAnswer.innerHTML = "Uploading and processing document...";

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetchWithTimeout("http://127.0.0.1:8001/upload", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      documentLoaded = true;
      statusText.innerHTML = `<span style="color: #10b981">✅ ${data.message}</span>`;
      qaAnswer.innerHTML = `
        <div style="background: rgba(16,185,129,0.1); padding: 15px; border-radius: 10px; border-left: 4px solid #10b981;">
          <strong>Document Ready!</strong><br>
          <em>${file.name}</em> has been uploaded successfully.<br>
          File size: ${Math.round(data.size / 1024)} KB<br><br>
          <strong>Preview:</strong><br>
          <div style="background: rgba(0,0,0,0.2); padding: 10px; border-radius: 5px; margin-top: 5px; font-size: 0.9em;">
            ${data.preview || "No text preview available"}
          </div>
        </div>
      `;

    } catch (error) {
      console.error("Upload error:", error);
      statusText.innerHTML = `<span style="color: #ef4444">❌ Upload failed</span>`;
      qaAnswer.innerHTML = `
        <div style="color: #ef4444; background: rgba(239,68,68,0.1); padding: 15px; border-radius: 10px;">
          <strong>Upload Error:</strong> ${error.message}<br>
          Make sure the backend is running.
        </div>
      `;
    } finally {
      uploadBtn.disabled = false;
    }
  });

  // ================= ASK QUESTION =================
  askBtn.addEventListener("click", async () => {
    const question = questionInput.value.trim();

    if (!documentLoaded) {
      alert("Please upload a document first");
      return;
    }

    if (!question) {
      alert("Please enter a question");
      return;
    }

    qaAnswer.innerHTML = `
      <div style="text-align: center; padding: 30px; color: #38bdf8;">
        <div style="font-size: 2em; margin-bottom: 10px;">🤔</div>
        <strong>Thinking about your question...</strong><br>
        "${question}"
      </div>
    `;
    
    askBtn.disabled = true;

    try {
      const response = await fetchWithTimeout("http://127.0.0.1:8001/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      const data = await response.json();
      
      qaAnswer.innerHTML = `
        <div style="background: rgba(56,189,248,0.1); padding: 20px; border-radius: 10px; border-left: 4px solid #38bdf8;">
          <div style="margin-bottom: 15px;">
            <strong style="color: #38bdf8;">Question:</strong><br>
            ${question}
          </div>
          <div style="background: rgba(0,0,0,0.2); padding: 15px; border-radius: 5px;">
            <strong style="color: #22c55e;">Answer:</strong><br>
            ${data.answer.replace(/\n/g, '<br>')}
          </div>
          <div style="margin-top: 15px; font-size: 0.9em; color: #94a3b8;">
            <i>Backend response received successfully</i>
          </div>
        </div>
      `;

    } catch (error) {
      console.error("Ask error:", error);
      qaAnswer.innerHTML = `
        <div style="color: #ef4444; background: rgba(239,68,68,0.1); padding: 20px; border-radius: 10px;">
          <div style="font-size: 2em; margin-bottom: 10px;">❌</div>
          <strong>Connection Error</strong><br><br>
          <strong>Problem:</strong> ${error.message}<br><br>
          <strong>Solution:</strong><br>
          1. Make sure backend is running (python main.py)<br>
          2. Check if port 8000 is not blocked by firewall<br>
          3. Try refreshing the page<br><br>
          <button onclick="location.reload()" style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    } finally {
      askBtn.disabled = false;
    }
  });

  // Press Enter to ask question
  questionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      askBtn.click();
    }
  });
});