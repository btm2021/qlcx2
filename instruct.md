# Hướng dẫn Phát triển Trang Giao diện (Compact Split-View Style)

Tài liệu này hướng dẫn cách tạo các trang chức năng cho dự án QLCX2 theo phong cách thiết kế hiện tại (Compact, Dense, Split-View).

## 1. Cấu trúc Layout (Split-View)
Mỗi trang quản lý thực thể (Khách hàng, Hợp đồng, Xe...) nên sử dụng cấu trúc 2 cột:
- **Cột Trái (col-lg-7)**: Hiển thị Danh sách (Table).
- **Cột Phải (col-lg-5)**: Hiển thị Form chi tiết (Dùng chung cho Thêm mới & Chỉnh sửa).

### Code Template cơ bản:
```html
<template>
  <div class="page-container">
    <div class="row">
      <!-- Bên trái: Danh sách -->
      <div class="col-lg-7 mb-4">
        <div class="card border-0 shadow-sm h-100">
          <div class="card-header bg-white border-0 py-2 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">Tiêu đề danh sách</h6>
            <div class="search-wrapper">
               <b-input-group size="sm">
                  <b-form-input v-model="searchQuery" placeholder="Tìm..." class="border-left-0 pl-1" />
               </b-input-group>
            </div>
          </div>
          <div class="card-body p-0">
            <b-table-simple small responsive hover borderless class="mb-0">
               <!-- Table Headers & Body -->
            </b-table-simple>
          </div>
        </div>
      </div>

      <!-- Bên phải: Form chi tiết (Sticky) -->
      <div class="col-lg-5">
        <div class="card border-0 shadow-sm sticky-top" style="top: 20px;">
          <div class="card-body p-3">
             <!-- Form Content -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## 2. Nguyên tắc Thiết kế (Design Principles)

### Độ nén Giao diện (Compactness)
- **Padding/Margin**: Sử dụng các khoảng cách nhỏ (`p-2`, `p-3`, `mb-2`). Tránh dùng `p-4` hoặc `mb-4` trừ khi cần phân đoạn lớn.
- **Typography**: 
  - Tiêu đề card dùng `h6` với `fw-bold`.
  - Nhãn form dùng class `.form-label-small` (cấu hình trong `themes.css`).
  - Text phụ dùng `.extra-small` hoặc `.text-muted`.
- **Form Elements**: Sử dụng class `.form-control-custom` và `size="sm"` cho các input để giao diện gọn gàng.

### Thành phần Table
- Luôn sử dụng `<b-table-simple small responsive hover borderless>`.
- Header bảng (`b-thead`) nên có font chữ nhỏ, uppercase và đậm (đã được skin trong `themes.css`).
- Các dòng dữ liệu (`b-tr`) nên có hiệu ứng `:class="{ 'active-row': form.id === item.id }"` để highlight khi đang chỉnh sửa.

## 3. Kết nối Dữ liệu (Supabase API)
- Tham chiếu cấu trúc bảng và schema tại file `database.md`.
- Sử dụng `this.$supabase` để thực hiện các thao tác CRUD.
- **Tối ưu hóa**: Khi `insert` hoặc `update`, luôn có thông báo `toast` với `variant="success"` hoặc `danger`.
- **Xác nhận xóa**: Luôn dùng `confirm()` trước khi thực hiện hành động xóa.

## 4. Các Class Utility quan trọng (Từ themes.css)
- `.fw-bold`: Font weight 700.
- `.extra-small`: Font size 0.7rem.
- `.form-label-small`: Font label nhỏ, đậm.
- `.active-row`: Highlight dòng đang chọn trong bảng (màu xanh nhạt).
- `.badge-primary-soft`: Badge màu xanh dương nhạt cho các trạng thái hoặc nhãn.

## 5. Danh sách thực thể cần phát triển
Dựa vào `database.md`, các trang tiếp theo cần tuân thủ phong cách này:
1. **Khách hàng (Customers)**: Quản lý thông tin định danh, liên hệ.
2. **Phương tiện (Vehicles)**: Quản lý loại xe, biển số, thương hiệu.
3. **Hợp đồng (Contracts)**: Trang phức tạp nhất, quản lý quy trình cầm cố (`stage`).
4. **Kho bãi (Storage)**: Quản lý vị trí đỗ xe.

---
*Lưu ý: Luôn ưu tiên trải nghiệm "Một khung hình" (Single Viewport) - hạn chế cuộn trang quá nhiều bằng cách nén các thành phần lại.*
