import React from 'react';
import { UIRegistry } from '@geeksman/core-ui';
import { Home } from './pages/Home';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';

export function registerMarketplaceModule() {
  UIRegistry.registerRoute({
    path: '/',
    element: React.createElement(Home),
    isProtected: true,
  });

  UIRegistry.registerRoute({
    path: '/product/:id',
    element: React.createElement(ProductDetails),
    isProtected: true,
  });

  UIRegistry.registerRoute({
    path: '/cart',
    element: React.createElement(Cart),
    isProtected: true,
  });

  // Navigation Items
  UIRegistry.registerNavItem({
    id: 'marketplace-portal',
    label: 'Marketplace',
    path: '/',
    icon: React.createElement('svg', {
      width: '20',
      height: '20',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2',
      strokeLinecap: 'round',
      strokeLinejoin: 'round'
    },
      React.createElement('circle', { cx: '9', cy: '21', r: '1' }),
      React.createElement('circle', { cx: '20', cy: '21', r: '1' }),
      React.createElement('path', { d: 'M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6' })
    ),
    section: 'main',
    bgGradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    sublabel: 'Supplier Products'
  });

  UIRegistry.registerNavItem({
    id: 'marketplace-home-nav',
    label: 'Browse Products',
    path: '/',
    icon: React.createElement('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2'
    },
      React.createElement('path', { d: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z' })
    ),
    section: 'extended',
    parentId: 'marketplace-portal'
  });

  UIRegistry.registerNavItem({
    id: 'marketplace-cart-nav',
    label: 'My Cart',
    path: '/cart',
    icon: React.createElement('svg', {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      strokeWidth: '2'
    },
      React.createElement('path', { d: 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z' })
    ),
    section: 'extended',
    parentId: 'marketplace-portal'
  });
}
