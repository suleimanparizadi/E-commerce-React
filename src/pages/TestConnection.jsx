import { useEffect, useState } from 'react';
import { productsApi } from '@/api/products';

export default function TestConnection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    productsApi.getProducts()
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h1>API Connection Test</h1>
      <p>Found {products.length} products</p>
      <ul>
        {products.map((p) => (
          <li key={p.id}>{p.name} - {p.price}</li>
        ))}
      </ul>
    </div>
  );
}