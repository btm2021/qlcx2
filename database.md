# Hướng dẫn Database & Nghiệp vụ Dự án Cầm Xe (QLCX)

Tài liệu này giải thích cấu trúc cơ sở dữ liệu và luồng nghiệp vụ cho các Agent phát triển dự án. Dự án tập trung vào quản lý cầm cố phương tiện (ô tô, xe máy) và các nghiệp vụ tài chính liên quan.

---

## 1. Luồng nghiệp vụ cốt lõi (Core Workflow)

Quy trình của một hợp đồng (Contract) đi qua các giai đoạn (`stage` trong bảng `contracts`):
1. **Reception (Tiếp nhận)**: Khách hàng mang xe đến, tạo hồ sơ khách hàng (`customers`) và phương tiện (`vehicles`).
2. **Inspection (Kiểm định)**: Nhân viên thẩm định (`appraiser`) kiểm tra tình trạng xe, chụp ảnh (`inspection_photos`) và điền checklist (`inspection_items`).
3. **Contract Draft (Lên hợp đồng)**: Định giá xe (`contract_valuations`) và xác định số tiền cho vay (`loan_amount`), lãi suất (`interest_rate`).
4. **Disbursement (Giải ngân)**: Kế toán thực hiện chi tiền cho khách hàng, ghi lại vào bảng `disbursements`.
5. **Storage (Lưu kho)**: Xe được đưa vào bãi đỗ (`storage_locations`) và gán vào vị trí cụ thể (`storage_slots`). Trạng thái chuyển sang `temp_storage` hoặc `formal_storage`.
6. **Payment (Thanh toán)**: Khách hàng đóng lãi định kỳ hoặc trả gốc. Dữ liệu ghi vào `payments` và phân bổ vào `payment_allocations`.
7. **Return (Trả xe)**: Sau khi tất toán, thực hiện thủ tục trả xe và đóng hợp đồng (`completed`).

---

## 2. Các nhóm bảng chính (Entity Groups)

### 2.1. Quản lý Người dùng & Phân quyền (RBAC)
*   **`users`**: Thông tin nhân viên. Liên kết với `auth.users` của Supabase qua `id`.
    *   *Lưu ý*: Có cột `is_active` để chặn truy cập khi cần.
*   **`roles` & `user_roles`**: Phân quyền theo vai trò (admin, appraiser, accountant,...). Một người có thể có nhiều vai trò.

### 2.2. Khách hàng & Tài sản (CRM & Assets)
*   **`customers`**: Thông tin định danh khách hàng (CMND/CCCD là `identity_card` - Duy nhất).
*   **`vehicles`**: Thông tin chi tiết xe (Biển số `license_plate` - Duy nhất).
*   **`vehicle_types`, `brands`, `models`**: Phân loại xe để hỗ trợ định giá tự động trong tương lai.

### 2.3. Hợp đồng & Tài chính (Contracts & Financial)
*   **`contracts`**: Bảng quan trọng nhất. Chứa số hợp đồng, số tiền vay, lãi suất và trạng thái hiện tại (`stage`).
*   **`contract_valuations`**: Lưu lịch sử định giá. Giá thị trường (`market_value`) vs Số tiền cho vay thực tế (`final_loan_value`).
*   **`interest_calculations`**: Bảng tính toán tiền lãi dự kiến dựa trên ngày quá hạn.

### 2.4. Vận hành & Kho bãi (Operations)
*   **`inspections`**: Hồ sơ kiểm định xe. Gắn liền với hợp đồng.
*   **`storage_slots`**: Quản lý vị trí đỗ xe trong kho. Cột `is_occupied` đánh dấu vị trí đã có xe hay chưa.
*   **`qr_codes` & `qr_scans`**: Dùng để check-in/check-out xe tại cổng kho hoặc tra cứu nhanh hợp đồng.

---

## 3. Quy tắc cho Agent (Developer Guidelines)

1.  **Sử dụng UUID**: Tất cả các bảng đều dùng UUID làm khóa chính. Đừng giả định ID là số tự tăng.
2.  **Khóa ngoại (Foreign Keys)**: Luôn kiểm tra ràng buộc khi xóa (ví dụ: không xóa khách hàng nếu đang có hợp đồng hoạt động).
3.  **Audit Logs**: Mọi thao tác thay đổi dữ liệu quan trọng (Hợp đồng, Thanh toán) nên được ghi nhận vào bảng `audit_logs`.
4.  **Trạng thái Hợp đồng**: Khi code logic chuyển bước, phải cập nhật đúng cột `stage` trong `contracts` và ghi lại lịch sử vào `contract_stage_history`.
5.  **RLS (Row Level Security)**: Mặc dù hiện tại một số bảng tắt RLS, nhưng khi triển khai thực tế cần tuân thủ theo `user_roles`.

---

## 4. Các Enum quan trọng
*   `contract_stage`: `reception`, `inspection`, `contract_draft`, `disbursement`, `temp_storage`, `formal_storage`, `reinspection`, `redemption_request`, `payment`, `return`, `completed`.
*   `user_role`: `admin`, `manager`, `receptionist`, `appraiser`, `contract_officer`, `accountant`, `warehouse_staff`.
