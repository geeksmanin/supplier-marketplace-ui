import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient, Button, useToast } from '@geeksman/core-ui';

interface Variant {
  id: number;
  name: string;
  sku_code: string;
  price: number;
  min_order_qty: number;
  packings: Array<{ unit: string; quantity: number }>;
}

interface Product {
  id: number;
  name: string;
  brand_name: string;
  category: string;
  description: string;
  variants: Variant[];
}

export function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    apiClient
      .get(`/rfq/vendor-products/${id}`)
      .then((res: any) => {
        if (res.data && res.data.data) {
          setProduct(res.data.data);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-900 text-slate-100">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 bg-slate-900 min-h-screen text-slate-100 text-center">
        Product not found
      </div>
    );
  }

  const selectedVariant = product.variants?.[selectedVariantIdx];

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    if (qty < selectedVariant.min_order_qty) {
      showToast(
        `Minimum order quantity for this variant is ${selectedVariant.min_order_qty}`,
        'warning'
      );
      return;
    }

    const cartItem = {
      product_id: product.id,
      product_name: product.name,
      variant_id: selectedVariant.id,
      variant_name: selectedVariant.name,
      sku_code: selectedVariant.sku_code,
      price: selectedVariant.price,
      quantity: qty,
      packings: selectedVariant.packings,
    };

    // Lazy cart storage in localStorage
    const currentCart = JSON.parse(localStorage.getItem('marketplace_cart') || '[]');
    currentCart.push(cartItem);
    localStorage.setItem('marketplace_cart', JSON.stringify(currentCart));

    showToast('Product added to cart!', 'success');
    navigate('/cart');
  };

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100 p-6">
      <div className="max-w-[800px] mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-8 space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
              {product.category || 'General'}
            </span>
            <h1 className="text-2xl font-bold mt-1 text-slate-100">{product.name}</h1>
            {product.brand_name && (
              <span className="text-sm text-slate-400 block mt-1">Brand: {product.brand_name}</span>
            )}
          </div>
          <Button onClick={() => navigate('/')} variant="secondary">
            Back to Marketplace
          </Button>
        </div>

        <p className="text-slate-300 text-sm">{product.description || 'No description available.'}</p>

        {product.variants && product.variants.length > 0 ? (
          <div className="space-y-4 border-t border-slate-700/50 pt-6">
            <h2 className="text-lg font-bold text-slate-200">Select Variant</h2>

            <div className="flex flex-col gap-2 max-w-[480px]">
              <label className="text-xs font-semibold text-slate-400">Variant Option</label>
              <select
                className="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                value={selectedVariantIdx}
                onChange={(e) => {
                  setSelectedVariantIdx(Number(e.target.value));
                  const newVar = product.variants[Number(e.target.value)];
                  setQty(newVar.min_order_qty);
                }}
              >
                {product.variants.map((v, index) => (
                  <option key={v.id} value={index}>
                    {v.name} - ${v.price.toFixed(2)} (SKU: {v.sku_code})
                  </option>
                ))}
              </select>
            </div>

            {selectedVariant && (
              <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 space-y-4 max-w-[480px]">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Unit Price</span>
                  <span className="font-bold text-emerald-400">${selectedVariant.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Minimum Order Quantity</span>
                  <span className="font-semibold text-slate-200">{selectedVariant.min_order_qty} units</span>
                </div>
                {selectedVariant.packings && selectedVariant.packings.length > 0 && (
                  <div className="text-sm">
                    <span className="text-slate-400 block mb-2">Packing details:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedVariant.packings.map((pkg, idx) => (
                        <span key={idx} className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-lg">
                          {pkg.quantity} {pkg.unit}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2 border-t border-slate-700/50 pt-4">
                  <label className="text-xs font-semibold text-slate-400">Order Quantity</label>
                  <input
                    type="number"
                    min={selectedVariant.min_order_qty}
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <Button onClick={handleAddToCart} variant="primary" className="w-full mt-2">
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-slate-400">No variants available for this product.</div>
        )}
      </div>
    </div>
  );
}
