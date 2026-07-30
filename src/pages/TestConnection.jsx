import { useEffect, useState } from 'react';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

export default function TestConnection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    apiClient.get('/products/')
      .then((res) => {
        console.log('✅ API Response:', res.data);
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('❌ API Error:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;
  if (error) return <div style={{ padding: 40, color: 'red' }}>Error: {error}</div>;

  return (
    <div style={{ padding: 40 }}>
      <h1>✅ Connected! Found {products.length} products</h1>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} — {p.price}</li>
        ))}
      </ul>
    </div>
  );
}