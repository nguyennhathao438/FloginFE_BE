/* eslint-env jest */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';
import { describe, expect, test } from 'vitest';

describe('Product Update FAIL scenarios', () => {
  // ❌ TC_FAIL_001 - Update product nhưng chưa nhập Product Name
  test('TC_FAIL_001 - Update product with missing name', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      name: '',
      price: 15000000,
      quantity: 10,
      category: 'PHONE',
      description: 'hello'
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Tên sản phẩm không được để trống/i)).toBeInTheDocument(); // → FAIL vì chưa code logic này
  });

  // ❌ TC_FAIL_002 - Update product với giá âm
  test('TC_FAIL_002 - Update product with negative price', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      name: 'Laptop Dell',
      price: -500,
      quantity: 10,
      category: 'Electronics',
      description: 'hello',
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Giá phải lớn hơn 0 và bé hơn 999999999/i)).toBeInTheDocument(); // → FAIL
  });

  // ❌ TC_FAIL_003 - Update product với category không tồn tại
  test('TC_FAIL_003 - Update product with invalid category', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      name: 'Laptop Dell',
      price: 15000000,
      quantity: 10,
      category: 'UnknownCategory',
      description: 'hello',
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Sản phẩm không có trong danh mục/i)).toBeInTheDocument(); // → FAIL
  });

  // ❌ TC_FAIL_004 - Update product nhưng không thay đổi dữ liệu
  test('TC_FAIL_004 - Update product with no changes', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      name: 'Laptop Dell',
      price: 15000000,
      quantity: 10,
      category: 'PHONE',
      description: 'hello',
    }} />);
    const name = screen.getByLabelText(/Product Name/i);
    const price = screen.getByLabelText(/Price/i);
    const quantity = screen.getByLabelText(/Quantity/i);
    const category = screen.getByLabelText(/Category/i);
    const description = screen.getByLabelText(/Description/i);
    fireEvent.change(name,{target: {value: 'Laptop Dell'}});
    fireEvent.change(price, {target: {value: '15000000'}});
    fireEvent.change(quantity, {target: {value: '10'}});
    fireEvent.change(category, {target: {value: 'PHONE'}});
    fireEvent.change(description, {target: {value: 'hello'}});
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/Không có thay đổi nào để cập nhật/i)).toBeInTheDocument(); // → FAIL
  });
});
