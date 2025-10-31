/* eslint-env jest */
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm from '../components/ProductForm';
import { describe, expect, test } from 'vitest';

describe(' Product Management CRUD 5 test important', () => {

    test('TC_FAIL_001 - Create product should fail because success message not match', async () => {
    render(<ProductForm/>);
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: 'Macbook Air' },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
      target: { value: '250000' },
    });
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: '5' },
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
      target: { value: 'PHONE' },
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
        target : {value: 'hello' },
    });

    fireEvent.click(screen.getByRole('button', { name: /Create/i }));

    expect(await screen.findByText(/Tạo sản phẩm thành công/i)).toBeInTheDocument();
  });

  test('TC_FAIL_002 - Create product should fail when using wrong field label', async () => {
    render(<ProductForm/>);

    // Label không tồn tại => sẽ throw error
    fireEvent.change(screen.getByLabelText(/Product Name/i), {
      target: { value: 'iPhone 15' },
    });
    fireEvent.change(screen.getByLabelText(/Price/i), {
        target: { value: '200000'},
    }) 
    fireEvent.change(screen.getByLabelText(/Quantity/i), {
        target: { value: '23'},
    });
    fireEvent.change(screen.getByLabelText(/Category/i), {
        target: { value : 'ASUS'},
    });
    fireEvent.change(screen.getByLabelText(/Description/i), {
        target: {value: ''},
    });

    fireEvent.click(screen.getByRole('button', {name: /Create/i}));
    expect(await screen.findByText(/Không được để trống mô tả/i)).toBeInTheDocument();
  });

  //  TC_FAIL_003
  test('TC_FAIL_003 - Update product but expect wrong quantity', async () => {
    render(<ProductForm mode="edit" defaultValues={{
      name: 'Asus TUF',
      price: 19000000,
      quantity: -8,
      category: 'Laptop',
      description: 'hello'
    }} />);
    const priceInput = screen.getByLabelText(/Price/i);
    fireEvent.change(priceInput, { target: { value: '18000000' } });
    fireEvent.click(screen.getByRole('button', { name: /Update/i }));

    expect(await screen.findByText(/số lượng phải lớn hơn 0 và bé hơn 99999/i)).toBeInTheDocument();
  });

  //  TC_FAIL_004
  test('TC_FAIL_004 - Delete product but expect different success text', async () => {
    render(<ProductForm mode="delete" defaultValues={{
      id: -1,
    }} />);

    fireEvent.click(screen.getByRole('button', { name: /Delete/i }));

    expect(await screen.findByText(/ID không hợp lệ/i)).toBeInTheDocument();
  });

  //  TC_FAIL_005
  test('TC_FAIL_005 - Update product but expect wrong category', async() => {
    render(<ProductForm mode="edit" defaultValues={{
      name: 'HP Omen',
      price: 21000000,
      quantity: 2,
      category: 'Gaming Laptop',
      description: 'Laptop mạnh mẽ cho lập trình viên.',
    }} />);

    // Sai giá trị => fail
    fireEvent.click(screen.getByRole('button', {name: /Update/i }));
    expect(await screen.findByText(/Sản phẩm không có trong danh mục/i)).toBeInTheDocument();

  });
});
