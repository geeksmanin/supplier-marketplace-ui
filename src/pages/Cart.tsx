import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient, Button, useToast } from '@geeksman/core-ui';

interface CartItem {
  product_id: number;
  product_name: string;
  variant_id: number;
  variant_name: string;
  sku_code: string;
  price: number;
  quantity: number;
  packings: Array<{ unit: string; quantity: number }>;
}

export function Cart() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('marketplace_cart') || '[]');
    setItems(cart);
  }, []);

  const handleRemove = (idx: number) => {
    const updated = items.filter((_, i) => i !== idx);
    setItems(updated);
    localStorage.setItem('marketplace_cart', JSON.stringify(updated));
    showToast('Item removed from cart', 'success');
  };

  const handleCheckout = async () => {
    if (items.length === 0) return;

    // Send order request to backend.
    const orderPayload = {
      items: items.map((item) => ({
        vendor_product_id: item.product_id,
        vendor_variant_id: item.variant_id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      // In real marketplace checkout: creates a PO/Requisition or internal rfq order
      await apiClient.post('/rfq/orders', orderPayload);
      showToast('Order placed successfully!', 'success');
      localStorage.removeItem('marketplace_cart');
      setItems([]);
      navigate('/');
    } catch (err: any) {
      console.error(err);
      showToast(err.response?.data?.message || 'Failed to checkout', 'error');
    }
  };

  const totalAmount = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-[800px] mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-700/50 pb-4">
          <h1 className="text-2xl font-bold text-slate-100">Shopping Cart</h1>
          <Button onClick={() => navigate('/')} variant="secondary">
            Continue Shopping
          </Button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="divide-y divide-slate-700/50">
              {items.map((item, idx) => (
                <div key={idx} className="py-4 flex justify-between items-center first:pt-0">
                  <div>
                    <h3 className="font-bold text-slate-200">{item.product_name}</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {item.variant_name} ({item.sku_code})
                    </p>
                    <div className="text-xs text-slate-500 mt-1">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-emerald-400 text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => handleRemove(idx)}
                      className="text-red-400 hover:text-red-300 text-xs transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-700/50 pt-4 flex justify-between items-center">
              <div>
                <span className="text-slate-400 text-sm block">Total Amount</span>
                <span className="text-2xl font-bold text-emerald-400">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <Button onClick={handleCheckout} variant="primary">
                Place Order
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
