import React, { useState } from 'react';
import './App.css';

function App() {
  const [ipInput, setIpInput] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleCheckIPs = async () => {
    setLoading(true);
    const ipList = ipInput
      .replace(/,/g, '\n')
      .split('\n')
      .map(ip => ip.trim())
      .filter(ip => ip !== '');

    const responses = await Promise.all(ipList.map(ip =>
      fetch(`http://localhost:4000/check-ip?ip=${ip}`)
        .then(res => res.json())
        .then(json => ({
          ip: ip,
          isp: json.data?.isp || 'N/A',
          country: json.data?.countryCode || 'N/A',
          reports: json.data?.totalReports || 0,
          confidence: json.data?.abuseConfidenceScore || 0,
          error: json.error || null
        }))
        .catch(err => ({ ip, error: err.message }))
    ));

    setResults(responses);
    setLoading(false);
  };

  return (
    <div className="App">
      <h2>AbuseIPDB Multi-IP Checker</h2>
      <textarea
        rows="6"
        placeholder="Enter IPs separated by commas or new lines"
        value={ipInput}
        onChange={e => setIpInput(e.target.value)}
      />
      <br />
      <button onClick={handleCheckIPs} disabled={loading}>
        {loading ? 'Checking...' : 'Check IPs'}
      </button>

    <div style={{ marginTop: '20px', textAlign: 'left', whiteSpace: 'pre-line' }}>
      {results.map((res, i) =>
        res.error
          ? <div key={i}>{res.ip} | ERROR: {res.error}</div>
          : <div key={i}>{`${res.ip} , ${res.isp} , ${res.country} , This IP was reported ${res.reports} times , Confidence of Abuse is ${res.confidence}%`}</div>
      )}
    </div>
    </div>
  );
}

export default App;
