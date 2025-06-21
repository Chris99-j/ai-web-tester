import { useState } from 'react';
import './App.css';
import { jsPDF } from 'jspdf';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import jsLang from 'react-syntax-highlighter/dist/esm/languages/hljs/javascript';
import htmlLang from 'react-syntax-highlighter/dist/esm/languages/hljs/xml';
import { github } from 'react-syntax-highlighter/dist/esm/styles/hljs';

SyntaxHighlighter.registerLanguage('html', htmlLang);
SyntaxHighlighter.registerLanguage('javascript', jsLang);

function App() {
  const [inputCode, setInputCode] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    setAiResponse('Analyzing...');

    const prompt = `Analyze this website code and suggest improvements in accessibility, UX, SEO, and code quality:\n\n${inputCode}`;

    const response = await fetch('http://localhost:000**/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3',
        prompt,
        stream: false,
      }),
    });

    const result = await response.json();
    setAiResponse(result.response);
    setLoading(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setInputCode(reader.result as string);
    };
    reader.readAsText(file);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('AI Website Tester Report', 10, 10);
    const lines = doc.splitTextToSize(aiResponse, 180);
    doc.text(lines, 10, 20);
    doc.save('ai-website-report.pdf');
  };

  return (
  <div className="app-container">
    <h1>🧪 AI Website Tester</h1>

    <textarea
      placeholder="Paste your HTML/CSS/JS code here..."
      rows={10}
      value={inputCode}
      onChange={(e) => setInputCode(e.target.value)}
    />

    <input type="file" accept=".html,.css,.js" onChange={handleFileUpload} />

    <button onClick={handleAnalyze} disabled={loading || !inputCode}>
      {loading ? 'Analyzing...' : 'Analyze Code with AI'}
    </button>

    {inputCode && (
      <div className="syntax-preview">
        <h3>📄 Code Preview:</h3>
        <SyntaxHighlighter language="html" style={github}>
          {inputCode}
        </SyntaxHighlighter>
      </div>
    )}

    {aiResponse && (
      <div className="ai-feedback">
        <h3>🧠 AI Feedback:</h3>
        <p>{aiResponse}</p>
        <button onClick={handleExportPDF}>📥 Export AI Report as PDF</button>
      </div>
    )}
  </div>
);

}

export default App;
