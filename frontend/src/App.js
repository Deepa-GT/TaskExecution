import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

function App() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("workflowHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    localStorage.setItem("workflowHistory", JSON.stringify(history));
  }, [history]);

  const runWorkflow = async () => {
    if (!task.trim()) {
      setError("Please enter a task description.");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await axios.post("http://127.0.0.1:8000/run-workflow", {
        task: task
      });
      setResult(res.data);
      setHistory(prev => [res.data, ...prev].slice(0, 5));
    } catch (err) {
      setError(err.response?.data?.detail || err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setResult("");
    setError("");
    setTask("");
  };

  const deleteTask = (e, index) => {
    e.stopPropagation();
    const newHistory = history.filter((_, i) => i !== index);
    setHistory(newHistory);
    if (result && history[index] === result) {
      setResult("");
    }
  };

  const startEditing = (e, index, currentTask) => {
    e.stopPropagation();
    setEditingIndex(index);
    setEditValue(currentTask);
  };

  const saveEdit = (e, index) => {
    e.stopPropagation();
    const newHistory = [...history];
    newHistory[index] = { ...newHistory[index], task: editValue };
    setHistory(newHistory);
    setEditingIndex(null);
    if (result && result === history[index]) {
      setResult(newHistory[index]);
    }
  };

  const cancelEdit = (e) => {
    e.stopPropagation();
    setEditingIndex(null);
  };

  return (
    <div style={{ 
      padding: "40px 20px", 
      fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", 
      maxWidth: "900px", 
      margin: "0 auto",
      backgroundColor: "#f4f7f6",
      minHeight: "100vh"
    }}>
      <header style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#2c3e50", marginBottom: "10px" }}>AI Workflow Automation Agent</h1>
        <p style={{ color: "#7f8c8d" }}>Transform your tasks into actionable plans and executed results</p>
      </header>
      
      <div style={{ 
        backgroundColor: "#ffffff", 
        padding: "30px", 
        borderRadius: "12px", 
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        marginBottom: "30px"
      }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", color: "#34495e" }}>
            What do you want to automate?
          </label>
          <input
            style={{ 
              width: "100%", 
              padding: "15px", 
              fontSize: "16px", 
              borderRadius: "8px", 
              border: "2px solid #e0e0e0",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.3s"
            }}
            placeholder="e.g., Plan and research a 3-day trip to Tokyo"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && runWorkflow()}
          />
        </div>

        <div style={{ display: "flex", gap: "15px" }}>
          <button 
            onClick={runWorkflow} 
            disabled={loading}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: loading ? "#bdc3c7" : "#3498db",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: loading ? "not-allowed" : "pointer",
              flex: 2,
              transition: "background-color 0.3s"
            }}
          >
            {loading ? "Generating Workflow..." : "Run Workflow"}
          </button>

          <button 
            onClick={clearResults}
            disabled={loading}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              fontWeight: "600",
              backgroundColor: "#95a5a6",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              flex: 1,
              transition: "background-color 0.3s"
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div style={{ 
          marginTop: "20px", 
          padding: "15px", 
          backgroundColor: "#fee2e2", 
          color: "#991b1b", 
          borderRadius: "8px",
          borderLeft: "5px solid #ef4444"
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {result && (
        <div style={{ 
          marginTop: "40px",
          animation: "fadeIn 0.5s ease-in-out"
        }}>
          <div style={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            marginBottom: "15px"
          }}>
            <h2 style={{ color: "#2c3e50", margin: 0 }}>Workflow Results</h2>
            <span style={{ 
              backgroundColor: result.mock ? "#f1c40f" : "#2ecc71", 
              padding: "5px 12px", 
              borderRadius: "20px", 
              fontSize: "13px",
              fontWeight: "bold",
              color: result.mock ? "#000" : "#fff",
              textTransform: "uppercase"
            }}>
              {result.provider} Mode
            </span>
          </div>
          
          <div style={{ 
            backgroundColor: "#ffffff", 
            borderRadius: "12px", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            overflow: "hidden"
          }}>
            <div style={{ padding: "25px", borderBottom: "1px solid #f0f0f0" }}>
              <h3 style={{ color: "#2980b9", marginTop: 0, marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>📋</span> Strategic Plan
              </h3>
              <div style={{ 
                color: "#2c3e50", 
                lineHeight: "1.6",
                fontSize: "15px"
              }}>
                <ReactMarkdown>{result.plan}</ReactMarkdown>
              </div>
            </div>

            <div style={{ padding: "25px", backgroundColor: "#f9fbfc" }}>
              <h3 style={{ color: "#27ae60", marginTop: 0, marginBottom: "15px", display: "flex", alignItems: "center" }}>
                <span style={{ marginRight: "10px" }}>🚀</span> Execution Output
              </h3>
              <div style={{ 
                color: "#2c3e50", 
                lineHeight: "1.6",
                fontSize: "15px"
              }}>
                <ReactMarkdown>{result.result}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ marginTop: "60px" }}>
          <h3 style={{ color: "#34495e", borderBottom: "2px solid #e0e0e0", paddingBottom: "10px" }}>Recent Tasks</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "15px", marginTop: "15px" }}>
            {history.map((item, index) => (
              <div 
                key={index} 
                onClick={() => setResult(item)}
                style={{ 
                  padding: "15px", 
                  backgroundColor: "#fff", 
                  border: "1px solid #e0e0e0", 
                  borderRadius: "10px",
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                  {editingIndex === index ? (
                    <input 
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyPress={(e) => e.key === 'Enter' && saveEdit(e, index)}
                      style={{ 
                        flex: 1, 
                        padding: "5px", 
                        borderRadius: "4px", 
                        border: "1px solid #3498db",
                        fontSize: "14px",
                        marginRight: "5px"
                      }}
                    />
                  ) : (
                    <span style={{ 
                      fontWeight: "600", 
                      color: "#2c3e50", 
                      overflow: "hidden", 
                      textOverflow: "ellipsis", 
                      whiteSpace: "nowrap",
                      flex: 1
                    }}>
                      {item.task}
                    </span>
                  )}
                  
                  <div style={{ display: "flex", gap: "5px" }}>
                    {editingIndex === index ? (
                      <>
                        <button 
                          onClick={(e) => saveEdit(e, index)}
                          style={{ border: "none", background: "none", cursor: "pointer", fontSize: "14px" }}
                          title="Save"
                        >✅</button>
                        <button 
                          onClick={(e) => cancelEdit(e)}
                          style={{ border: "none", background: "none", cursor: "pointer", fontSize: "14px" }}
                          title="Cancel"
                        >❌</button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={(e) => startEditing(e, index, item.task)}
                          style={{ border: "none", background: "none", cursor: "pointer", fontSize: "14px", opacity: 0.6 }}
                          title="Edit Title"
                        >✏️</button>
                        <button 
                          onClick={(e) => deleteTask(e, index)}
                          style={{ border: "none", background: "none", cursor: "pointer", fontSize: "14px", opacity: 0.6 }}
                          title="Delete Task"
                        >🗑️</button>
                      </>
                    )}
                  </div>
                </div>

                <span style={{ 
                  fontSize: "11px", 
                  color: "#95a5a6", 
                  textTransform: "uppercase", 
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center"
                }}>
                  <span style={{ 
                    width: "8px", 
                    height: "8px", 
                    borderRadius: "50%", 
                    backgroundColor: item.mock ? "#f1c40f" : "#2ecc71",
                    marginRight: "6px"
                  }}></span>
                  {item.provider}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;