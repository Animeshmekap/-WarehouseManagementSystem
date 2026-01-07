import React from 'react';

export default function ProductList({ products = [], onDelete }) {
  if (!products || products.length === 0) return <div>No products found</div>;

  return (
    <div className="product-list">
      {products.map(p => (
        <div className="product-item" key={p.id}>
          <div style={{ flex: 1 }}>
            <strong>{p.name}</strong>
            <div style={{ fontSize: 13, color: '#444' }}>{p.description}</div>
            <div style={{ fontSize: 13, color: '#666' }}>Price: ${p.price} • Qty: {p.quantity}</div>
          </div>
          <div style={{ marginLeft: 12 }}>
            <button className="btn-danger" onClick={() => onDelete(p.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
