# 🔐 TÀI KHOẢN DEMO

## Tài khoản người dùng thường

**Username:** `mockuser`  
**Password:** `123456`  
**Role:** User  
**Quyền:** Xem video, thêm yêu thích, bình luận

---

## Tài khoản Admin

**Username:** `admin`  
**Password:** `admin123`  
**Role:** Admin  
**Quyền:** Quản lý user, video, báo cáo, toàn quyền hệ thống

---

## Lưu ý

- Đây là tài khoản mock để test UI
- Khi kết nối backend API, cần thay thế logic authentication
- Hiện tại chỉ check username/password trong file `AuthModal.vue`
- Sau khi đăng nhập, thông tin user được lưu trong `localStorage`

---

## Cách sử dụng

1. Mở trang chủ: `http://localhost:5173`
2. Click nút "Đăng nhập" trên navbar
3. Nhập username và password từ danh sách trên
4. Click "Đăng nhập"

**User thường** → Chuyển đến trang Favorites  
**Admin** → Chuyển đến trang Admin Dashboard

---

## Thay đổi tài khoản

Để thêm/sửa tài khoản mock, chỉnh sửa trong file:  
`4in1-vue/src/components/modals/AuthModal.vue`

```javascript
const mockAccounts = {
  'mockuser': { password: '123456', role: 'user', fullname: 'Mock User' },
  'admin': { password: 'admin123', role: 'admin', fullname: 'Admin User' },
  // Thêm tài khoản mới ở đây
}
```
