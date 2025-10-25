# 🤝 Quy định đóng góp vào dự án FLogin

## Bước 1: Đồng bộ nhánh `develop` mới nhất

```bash
git checkout develop
git pull origin develop
```

## Bước 2: Tạo nhánh feature/ mới để phát triển tính năng

```bash
git checkout -b feature/ten-tinh-nang
```

## Bước 3: Commit theo cú pháp

```bash
git commit -m "[Feature] Thêm chức test đăng nhập"
```

## Bước 4: Push lên GitHub

```bash
git push origin feature/ten-tinh-nang
```

## Bước 5: Tạo Pull Request (PR) → develop

Giao PR cho Leader hoặc người review
Không tự merge
Ghi rõ mô tả: chức năng, ảnh (nếu có), cách test
