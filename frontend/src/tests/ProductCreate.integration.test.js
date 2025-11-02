import ProductAdd from "../components/ProductAdd";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
/* eslint-env jest */
describe('ProductAdd Integration test', () => {
    test('TC01_Fail khi do dai ten san pham < 3', async () => {
        render(<ProductAdd/>);
        fireEvent.change(screen.getByLabelText('Tên sản phẩm'), {
            target: {value: 'l'}
        })
        fireEvent.change(screen.getByLabelText('Mô tả sản phẩm'), {
            target: {value : 'laptop xịn 5.0'}
        })
        fireEvent.change(screen.getByLabelText('Giá sản phẩm (VNĐ)'), {
            target: {value : '150000'}
        })
        fireEvent.change(screen.getByLabelText('Danh mục'), {
            target: {value : 'Books'}
        })
        fireEvent.change(screen.getByLabelText('Số lượng tồn kho'), {
            target: {value : '20'}
        })

        fireEvent.click(screen.getByText('Thêm sản phẩm'));

        expect(screen.getByText(/Tên sản phẩm phải có ít nhất 3 ký tự hoặc không được để trống/i)).toBeInTheDocument();
    });
   test('TC_02 FAIl khi price < 0 or > 999999999', async () => {
        render(<ProductAdd/>);
        fireEvent.change(screen.getByLabelText('Tên sản phẩm'), {
            target: {value: 'laptop Gaming'}
        })
        fireEvent.change(screen.getByLabelText('Mô tả sản phẩm'), {
            target: {value : 'laptop xịn 5.0'}
        })
        fireEvent.change(screen.getByLabelText('Giá sản phẩm (VNĐ)'), {
            target: {value : '-20000'}
        })
        fireEvent.change(screen.getByLabelText('Danh mục'), {
            target: {value : 'Books'}
        })
        fireEvent.change(screen.getByLabelText('Số lượng tồn kho'), {
            target: {value : '10'}
        })

        fireEvent.click(screen.getByText('Thêm sản phẩm'));

        expect(screen.getByText(/Giá phải lớn hơn 0 hoặc nhỏ hơn 1 tỷ/i)).toBeInTheDocument();
   });
   test('TC_03 FAIl khi quantity < 0 or > 100000', async () => {
        render(<ProductAdd/>);
        fireEvent.change(screen.getByLabelText('Tên sản phẩm'), {
            target: {value: 'laptop Gaming'}
        })
        fireEvent.change(screen.getByLabelText('Mô tả sản phẩm'), {
            target: {value : 'laptop xịn 5.0'}
        })
        fireEvent.change(screen.getByLabelText('Giá sản phẩm (VNĐ)'), {
            target: {value : '2000000'}
        })
        fireEvent.change(screen.getByLabelText('Danh mục'), {
            target: {value : 'Books'}
        })
        fireEvent.change(screen.getByLabelText('Số lượng tồn kho'), {
            target: {value : '100000'}
        })

        fireEvent.click(screen.getByText('Thêm sản phẩm'));

        expect(screen.getByText(/Số lượng không được âm hoặc nhỏ hơn 100000/i)).toBeInTheDocument();
   });
   test('TC_04 FAIl khi desciption qua 200 dong', async () => {
        render(<ProductAdd/>);
        const longdesc = "a".repeat(201);
        fireEvent.change(screen.getByLabelText('Tên sản phẩm'), {
            target: {value: 'laptop Gaming'}
        })
        fireEvent.change(screen.getByLabelText('Mô tả sản phẩm'), {
            target: {value : longdesc}
        })
        fireEvent.change(screen.getByLabelText('Giá sản phẩm (VNĐ)'), {
            target: {value : '200000'}
        })
        fireEvent.change(screen.getByLabelText('Danh mục'), {
            target: {value : 'Books'}
        })
        fireEvent.change(screen.getByLabelText('Số lượng tồn kho'), {
            target: {value : '10000'}
        })

        fireEvent.click(screen.getByText('Thêm sản phẩm'));

        expect(screen.getByText(/Mô tả không được quá 200 ký tự./i)).toBeInTheDocument();
   });
});
