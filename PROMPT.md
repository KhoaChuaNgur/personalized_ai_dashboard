# NHẬT KÝ CÂU LỆNH PROMPT (PROMPT LOG)

Dưới đây là toàn bộ nhật ký các câu lệnh prompt được sử dụng trong quá trình phát triển ứng dụng **Personalized AI Dashboard**, được giữ nguyên vẹn 100% nội dung gốc theo thứ tự thực hiện.

---

## Prompt 1: Khởi tạo Layout UI To-Do List

```text
Bạn là một lập trình viên thiết kế UI, hãy xây dựng chương trình do to list theo yêu cầu về layout như sau: 
Header: Hiển thị lời chào cá nhân hóa (ví dụ: "Chào Khoa, hôm nay bạn thế nào?") và thời gian thực (Giờ/Phút/Giây) cập nhật liên tục.
Input Section: Một ô nhập công việc và nút "Thêm".
Task List: Danh sách các công việc đã thêm.
Footer: Hiển thị tổng số công việc đang có, Sử dụng HTML5 và CSS."*
```

---

## Prompt 2: Xử lý tương tác DOM cơ bản & Bẫy lỗi Input

```text
Vai trò: Lập trình viên JavaScript.   Nhiệm vụ: Dựa trên cấu trúc HTML/CSS ở Bước 1, viết mã JavaScript thao tác với DOM: Bắt sự kiện khi click nút "Thêm" hoặc nhấn phím Enter tại ô input. Bẫy logic kiểm tra: Nếu ô input trống (hoặc chỉ có khoảng trắng), hiển thị alert('Vui lòng nhập nội dung!') và dừng thực thi, không thêm công việc. Khi hợp lệ: Tạo thẻ <li> mới thêm vào danh sách, mỗi task đi kèm một nút "Xóa", sau đó tự động xóa rỗng ô input và focus lại. Cập nhật hàm tính và hiển thị đúng tổng số task ở Footer. Đảm bảo mã nguồn không phát sinh lỗi ở Console.
```

---

## Prompt 3: Nâng cấp tương tác, Xóa mượt & Event Delegation

```text
Vai trò: Lập trình viên JavaScript & UI Interaction.Nhiệm vụ: Nâng cấp các sự kiện tương tác và thời gian thực cho ứng dụng:   Hoàn thành task: Click vào dòng chữ công việc sẽ toggle class .completed (gạch ngang chữ text-decoration: line-through).   Xóa mượt mà: Khi click nút "Xóa", thêm class hiệu ứng mờ dần (fade-out) và thu nhỏ chiều cao mượt mà trước khi xóa hẳn phần tử khỏi DOM, đồng thời cập nhật lại số lượng ở Footer.   Thời gian thực: Dùng setInterval chạy mỗi 1000ms để cập nhật chính xác Giờ:Phút:Giây (định dạng 2 chữ số) lên Header.   Yêu cầu: Sử dụng kỹ thuật Event Delegation (ủy quyền sự kiện trên thẻ <ul>) để tối ưu hiệu năng, chú thích rõ ràng.
```

---

## Prompt 4: Refactor sang mô hình Hướng dữ liệu (Data-driven) & LocalStorage

```text
Vai trò: Chuyên gia Kiến trúc Front-end.Nhiệm vụ: Refactor toàn bộ mã JavaScript sang mô hình dữ liệu (Data-driven) kết hợp LocalStorage:   Quản lý trạng thái bằng một mảng tasks chứa các object { id, text, completed }.   Sử dụng đúng localStorage.setItem với JSON.stringify để lưu dữ liệu khi Thêm, Đổi trạng thái hoàn thành, hoặc Xóa.   Khởi tạo ứng dụng với localStorage.getItem và JSON.parse để khôi phục và render lại toàn bộ danh sách khi người dùng F5 hoặc mở lại trình duyệt.   Đồng bộ chính xác số lượng task ở Footer theo mảng dữ liệu. Viết code dạng module, tên biến tường minh, không có mã thừa.
```

---

## Prompt 5: Hoàn thiện chuyên sâu (Priority, Sidebar Search, Dark Mode)

```text
Vai trò: Kỹ sư Web Full-stack & UI Designer.Nhiệm vụ: Nâng cấp ứng dụng lên mức độ hoàn thiện chuyên sâu (Điểm 9-10):   Priority Tag: Thêm thẻ <select> mức độ ưu tiên (Quan trọng / Bình thường / Thấp) cạnh ô input. Task hiển thị viền đỏ nếu "Quan trọng", viền xanh lá nếu "Thấp" và lưu thuộc tính này vào LocalStorage.   Bộ lọc & Tìm kiếm:Thêm cụm nút Filter ở Sidebar: "Tất cả" / "Đã xong" / "Chưa xong".   Thêm ô input Search ở Sidebar để lọc task theo thời gian thực (Real-time Search).   Dark Mode: Thêm toggle Dark Mode ở Header. Khi chuyển chế độ, đổi theme toàn trang và lưu trạng thái vào LocalStorage để duy trì sau khi tải lại trang.   Cung cấp file hoàn chỉnh đồng bộ mã HTML, CSS và JavaScript không có lỗi console.
```

---

## Prompt 6: Bổ sung trường Mô tả công việc (Task Description) & Accordion

```text
Dưới đây là câu prompt được nâng cấp theo chuẩn Prompt Engineering, tập trung vào việc bổ sung trường Mô tả công việc (Task Description) đồng bộ từ giao diện, tương tác DOM, hiệu ứng mở rộng (Accordion/Collapsible) cho tới cấu trúc dữ liệu LocalStorage:
Prompt Nâng cấp: Bổ sung trường Mô tả công việc (Task Description)
Vai trò: Chuyên gia Lập trình Web Front-end & UI/UX.
Nhiệm vụ: Nâng cấp ứng dụng "Personalized AI Dashboard" để hỗ trợ thêm trường Mô tả chi tiết (Description) cho từng công việc:
Cập nhật Giao diện (HTML & CSS):
Thêm ô <textarea> hoặc <input type="text"> placeholder "Mô tả chi tiết công việc (không bắt buộc)..." vào khu vực Input Section.
Trên mỗi thẻ task <li>, hiển thị tiêu đề công việc chính kèm theo phần mô tả bên dưới với font chữ nhỏ hơn, màu sắc dịu hơn (text-muted).
(Tùy chọn UX): Thiết kế icon mũi tên hoặc nút bấm nhỏ để ẩn/hiện phần mô tả (dạng Accordion) giúp danh sách luôn gọn gàng.
Cập nhật Logic & Xử lý DOM (JavaScript):
Khi bấm "Thêm", lấy đồng thời giá trị của Tiêu đề và Mô tả. Nếu tiêu đề trống vẫn chặn cảnh báo alert, còn mô tả cho phép để trống.
Reset cả 2 ô nhập liệu về rỗng sau khi thêm thành công.
Đồng bộ Dữ liệu (LocalStorage):
Cập nhật cấu trúc đối tượng công việc trong mảng tasks thành:
{ id, title, description, completed, priority }.
Đảm bảo khi tải lại trang (F5), toàn bộ nội dung mô tả vẫn được khôi phục chính xác từ LocalStorage.
Yêu cầu kỹ thuật:
Giữ nguyên toàn bộ các tính năng trước đó (Xóa, Đánh dấu hoàn thành, Đếm số lượng, Dark Mode).
Code sạch, chú thích rõ ràng nơi thay đổi, không phát sinh lỗi trong Console.
```

---

## Prompt 7: Tích hợp hiệu ứng pháo hoa (Confetti / Bung lụa)

```text
Prompt Nâng cấp: Tích hợp hiệu ứng pháo hoa (Confetti / Bung lụa) khi hoàn thành công việc
Vai trò: Chuyên gia Lập trình Web Front-end & UI/UX Animation.

Nhiệm vụ: Nâng cấp ứng dụng "Personalized AI Dashboard" để hiển thị hiệu ứng chúc mừng sinh động (Confetti / bung lụa) mỗi khi người dùng đánh dấu hoàn thành một công việc:

Tích hợp thư viện hoặc CSS/Canvas Animation:

Sử dụng thư viện nhẹ qua CDN như canvas-confetti (hoặc tạo hiệu ứng bung hoa giấy thuần bằng HTML5 Canvas/CSS keyframes không phụ thuộc thư viện ngoài).

Cập nhật Logic Tương tác (JavaScript):

Bắt sự kiện khi trạng thái công việc chuyển từ Chưa hoàn thành sang Hoàn thành (khi toggle class .completed thành công).

Kích hoạt hiệu ứng bắn pháo hoa giấy bung ra ngay tại vị trí con trỏ chuột click hoặc bắn từ hai góc màn hình lên.

Đảm bảo hiệu ứng chỉ kích hoạt khi chuyển sang trạng thái đã xong (nếu bấm lại để bỏ gạch ngang/hủy hoàn thành thì không bắn pháo hoa).

Tối ưu Hiệu năng & Trải nghiệm (UX):

Hiệu ứng biến mất tự nhiên sau 1.5 - 2 giây, tự động dọn dẹp Canvas khỏi DOM để tránh rò rỉ bộ nhớ (memory leak).

Không làm gián đoạn hoặc đơ lag các thao tác khác trên giao diện.

Yêu cầu kỹ thuật:

Giữ nguyên toàn bộ logic lưu trữ dữ liệu vào LocalStorage và các chức năng trước đó.

Code sạch, chú thích rõ ràng vị trí chèn script và hàm kích hoạt hiệu ứng, không phát sinh lỗi ở Console.
```

---

## Prompt 8: Lưu nhật ký câu lệnh prompt vào file PROMPT.md

```text
hãy lưu lại nhật kí câu lệnh prompt vào file nhật kí PROMPT.md, yêu cầu giữ nguyên câu 100% câu lệnh
```
