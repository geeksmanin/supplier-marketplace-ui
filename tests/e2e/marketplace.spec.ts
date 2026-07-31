import { test, expect } from '@playwright/test';

test.describe('Supplier Marketplace Public E2E Test Suite', () => {
  test('1. Browse products, add to cart and checkout successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Verify search input is present
    await expect(page.locator('input[placeholder*="Search products"]')).toBeVisible();

    // Click on View Details of first product
    await page.locator('button:has-text("View Details")').first().click();
    await page.waitForTimeout(1000);

    // Verify detail page has loaded
    await expect(page).toHaveURL(/.*\/product\/\d+/);
    await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();

    // Add to cart
    await page.locator('button:has-text("Add to Cart")').click();
    await page.waitForTimeout(1000);

    // Verify cart page loaded and contains item
    await expect(page).toHaveURL(/.*\/cart/);
    await expect(page.locator('button:has-text("Place Order")')).toBeVisible();

    // Checkout
    await page.locator('button:has-text("Place Order")').click();
    await page.waitForTimeout(1000);

    // Verify redirected back to home
    await expect(page).toHaveURL(/.*\/$/);
  });
});
