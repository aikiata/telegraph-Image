# telegraph-Image

> Phiên bản cũ nằm ở nhánh [static](https://github.com/x-dr/telegraph-Image/tree/static)

### Demo

[https://img.131213.xyz](https://img.131213.xyz)

### Link thử nghiệm
[https://telegraph-image-e49.pages.dev/](https://telegraph-image-e49.pages.dev/)

```
Tài khoản admin thử nghiệm: admin
Mật khẩu admin thử nghiệm: admin

Tài khoản người dùng thường: user
Mật khẩu người dùng thường: user
```

### Ưu điểm

1. **Không giới hạn số lượng ảnh lưu trữ** – bạn có thể tải lên số lượng ảnh không giới hạn.

2. **Không cần mua máy chủ** – được lưu trữ trên mạng lưới của Cloudflare. Khi sử dụng không vượt quá giới hạn miễn phí của Cloudflare thì hoàn toàn miễn phí.

3. **Không cần mua tên miền** – có thể sử dụng tên miền phụ miễn phí *.pages.dev do Cloudflare Pages cung cấp. Ngoài ra, hỗ trợ liên kết tên miền riêng.

4. **Hỗ trợ API kiểm duyệt ảnh** – có thể bật/tắt theo nhu cầu. Khi bật, các hình ảnh không phù hợp sẽ tự động bị chặn và không tải lên.

5. **Hỗ trợ quản lý hình ảnh qua giao diện quản trị**, quản lý nhật ký truy cập, xem 20 nguồn truy cập (Referer), IP, hình ảnh nhiều nhất; cho phép xem trước ảnh trực tuyến, thêm vào danh sách trắng, danh sách đen,...

---

### Hướng dẫn triển khai bằng Cloudflare Pages

1. Nhấn nút [Use this template](https://github.com/x-dr/telegraph-Image/generate) để tạo một kho lưu trữ (repository) mới.

2. Đăng nhập vào bảng điều khiển [Cloudflare](https://dash.cloudflare.com/).

3. Trên trang chủ tài khoản, chọn `Pages` > `Create a project` > `Connect to Git`.

4. Chọn kho lưu trữ dự án bạn đã tạo, tại mục `Set up builds and deployments`, ở phần `Framework preset`, chọn `Next.js`.

![Next.js Setting](./docs/img/nextjsimages1.png)

5. Nhấn `Save and Deploy` để tiến hành triển khai.

6. [Cài đặt biến môi trường & bật chức năng quản lý ảnh](./docs/manage.md)

7. Cài đặt cờ tương thích:
   - Vào trang quản lý Cloudflare Pages.
   - Vào `Settings` -> `Functions` -> `Compatibility flags` -> `Configure production compatibility flags`.
   - Thêm `nodejs_compat`.

![Compatibility Setting](./docs/img/image2.png)

8. Vào `Deployments` -> tìm bản triển khai mới nhất -> nhấn `Retry deployment` để triển khai lại.

![Retry Deployment](./docs/img/image3.png)

---

> Các biến môi trường cần thiết:

| Tên biến      | Giá trị | Loại dữ liệu |
| ------------- | ----------- | ----------- |
| PROXYALLIMG  | Có chuyển tiếp (proxy) tất cả ảnh không (mặc định: false) | boolean |
| BASIC_USER   | Tên người dùng đăng nhập trang quản lý | string |
| BASIC_PASS   | Mật khẩu đăng nhập trang quản lý | string |
| ENABLE_AUTH_API | Có bật xác thực người dùng không (mặc định: false) | boolean |
| REGULAR_USER | Tên người dùng thường | string |
| REGULAR_PASS | Mật khẩu người dùng thường | string |
| ModerateContentApiKey | API Key kiểm duyệt nội dung ảnh | string |
| RATINGAPI | URL đến API kiểm duyệt nội dung tự dựng ([nsfwjs-api](https://github.com/x-dr/nsfwjs-api)) | string |
| CUSTOM_DOMAIN | https://your-custom-domain.com (Tên miền tùy chỉnh) | string |
| TG_BOT_TOKEN | Token của bot Telegram (lấy từ [@BotFather](https://t.me/BotFather)) | string |
| TG_CHAT_ID | ID của kênh hoặc nhóm Telegram (bot cần là admin của kênh/nhóm) | string |

> **TG_BOT_TOKEN** – Token tạo bot Telegram

[Hình minh họa TG_BOT_TOKEN](https://img.131213.xyz/api/file/02735b83dbdcf5fe31a45.png)

> **Cách lấy TG_CHAT_ID:**  
Sử dụng bot [@VersaToolsBot](https://t.me/VersaToolsBot) để lấy ID.

- `TG_CHAT_ID` có thể là ID số hoặc username của kênh (ví dụ `@channelusername`).
- Nếu đối tượng là cá nhân hoặc kênh riêng tư → chỉ dùng ID số.
- Nếu là kênh công khai hoặc nhóm → dùng username hoặc ID số đều được.

---

### Lịch sử gắn sao (Star History)

[![Star History Chart](https://api.star-history.com/svg?repos=x-dr/telegraph-Image&type=Date)](https://star-history.com/#x-dr/telegraph-Image&Date)
