# 🎬 Kịch bản Demo — USD8 Gasless Transfer

**Thời lượng đề xuất:** ~3–4 phút
**Thông điệp chính:** Người dùng chuyển USD8 mà **không cần POL để trả gas** — paymaster trả phí thay, thu lại bằng USD8.

## Chuẩn bị trước khi quay
- Ví MetaMask đã có sẵn một ít **POL** (để bootstrap) và một ít **USD8** (để chuyển).
- Mạng đã chọn đúng (Polygon/Amoy testnet tùy config).
- Mở sẵn 2 tab: app + (tùy chọn) block explorer để show tx.
- Nếu muốn quay luồng "tạo mới" trọn vẹn: dùng ví **chưa từng deploy** smart account.

---

## Phân cảnh 0 — Mở đầu (10s)
- **Hình:** Màn hình `EntryChoice` — tiêu đề "USD8 Payment Solution", 2 card.
- **Lời thoại:**
  > "Đây là demo ví Smart Account theo chuẩn ERC-4337. Điểm đặc biệt: người dùng chuyển USD8 mà không cần giữ POL để trả phí gas. Smart Account được dẫn xuất tất định từ ví của bạn qua CREATE2 — cùng một ví luôn ra cùng một địa chỉ."

---

## Phân cảnh 1 — Onboarding: Connect (20s)
- **Thao tác:** Click **"Create new account"** (card cam, bên trái).
- **Hình:** Vào `OnboardingPage` — thanh tiến trình 4 bước: **Connect → Bootstrap → Activate → Ready**.
- **Thao tác:** Click **"Connect Wallet"** → chọn MetaMask → approve.
- **Lời thoại:**
  > "Bước 1, kết nối ví EOA. Ngay khi kết nối, hệ thống tự dẫn xuất địa chỉ Smart Account — nó không bao giờ đổi."
- **Lưu ý quay:** Sau khi connect sẽ thấy màn "Setting up your Smart Account" (loading) chớp qua.

---

## Phân cảnh 2 — Onboarding: Bootstrap (gửi POL một lần) (35s)
- **Hình:** Bước **"One-Time Bootstrap"** — biểu tượng tia sét, hiện địa chỉ Smart Account + "Current POL balance".
- **Lời thoại:**
  > "Vì đây là lần đầu, Smart Account cần một lượng nhỏ POL — khoảng 0.1 POL — để trả phí deploy account lần đầu. Đây là chi phí một lần duy nhất."
- **Thao tác:** Click **"Send POL to Smart Account"** → mở `SendPolModal`.
  - Chọn preset **0.1 POL** (hoặc bấm Max).
  - Click **"Send 0.1000 POL"** → confirm trong MetaMask.
- **Hình:** Hiện banner xanh "Transaction submitted!", modal tự đóng, sau đó banner **"Transfer sent!"** trên trang.
- **Lời thoại:**
  > "POL được gửi thẳng từ ví sang Smart Account. Trang sẽ tự cập nhật số dư và chuyển bước khi POL về tới."
- **Lưu ý quay:** Chờ balance cập nhật ≥ 0.1 POL → app **tự nhảy** sang bước Activate. Có thể cắt bớt thời gian chờ block khi edit.

---

## Phân cảnh 3 — Onboarding: Activate (approve + deploy) (35s)
- **Hình:** Bước **"Activate Gasless Mode"** — icon khiên, dòng "Gas cost after activation = 0 POL forever".
- **Lời thoại:**
  > "Bước cuối: approve USD8 Paymaster. Giao dịch này cũng chính là giao dịch deploy Smart Account lên on-chain. Sau bước này, mọi giao dịch về sau đều được paymaster trả phí — không bao giờ cần POL nữa."
- **Thao tác:** Click **"Activate Gasless Transactions"** → confirm trong ví.
- **Hình:** Alert "Sending UserOperation…" (chờ bundler ~10–30s) → nút đổi "Approved — refreshing…".
- **Hình:** Bước **"You're All Set!"** (tick xanh).
- **Thao tác:** Click **"Open App"**.

---

## Phân cảnh 4 — Màn chính: Account State (25s)
- **Hình:** Màn transfer chính — panel **"Account State"** (badge "live").
- **Lời thoại (chỉ vào từng phần):**
  > "Đây là trạng thái tài khoản. Bên trái là bạn — số dư USD8 và POL. Bên dưới là 4 chỉ số: **Paymaster approved** ✓, **Smart account deployed** ✓, tỷ giá **POL/USD** từ oracle, và **Paymaster deposit**."
- **Lưu ý quay:** Zoom vào dòng **POL balance** (ô xanh) để nhấn mạnh số POL gần như không đổi sau giao dịch.

---

## Phân cảnh 5 — Transfer USD8 gasless (40s) ⭐ điểm nhấn
- **Hình:** Card **"Transfer USD8"**.
- **Lời thoại:**
  > "Giờ thử chuyển tiền. Recipient đã điền sẵn, mình nhập số tiền — ví dụ 10 USD8."
- **Thao tác:**
  - (Nếu hiện alert "Approval required" → click **"Approve Paymaster"** trước, giải thích đây là approve một lần.)
  - Nhập amount **10**.
  - Click **"Send Transfer"**.
- **Hình:** Nút đổi "Sending UserOp…" (spinner).
- **Lời thoại (trong lúc chờ):**
  > "Đây là một UserOperation gửi qua bundler. Người dùng ký, nhưng phí gas do paymaster ứng trả — ví không tốn một POL nào."

---

## Phân cảnh 6 — Kết quả giao dịch (30s) ⭐ chốt thông điệp
- **Hình:** Card **"Transfer Complete"** (viền xanh, badge "Block #…").
- **Lời thoại (chỉ vào bảng):**
  > "Giao dịch xong. Bảng này minh bạch chi phí: số USD8 đã gửi, phí gas pre-charge bằng USD8, phần hoàn lại do thu dư, net gas — và quan trọng nhất:"
- **Thao tác:** Zoom/khoanh dòng cuối màu xanh **"POL spent → 0 POL"**.
  > "**0 POL.** Toàn bộ gas được trả bằng USD8 thông qua paymaster. Người dùng chỉ cần giữ USD8."
- **Thao tác (tùy chọn):** Click tx hash → mở explorer để chứng minh giao dịch on-chain thật.
- **Hình:** Quay lại panel Account State — số dư USD8 người gửi giảm, người nhận tăng, **POL gần như giữ nguyên**.

---

## Phân cảnh 7 — Kết (10s)
- **Lời thoại:**
  > "Tóm lại: bootstrap một lần bằng POL, approve paymaster một lần — sau đó mọi giao dịch USD8 đều hoàn toàn gasless. Đó là trải nghiệm Smart Account với ERC-4337 paymaster."

---

## 📝 Mẹo khi record
- **Cắt thời gian chờ block** (bootstrap & UserOp) khi edit để video gọn.
- Quay ở **theme sáng**, font rõ; zoom vào các con số quan trọng (POL balance, "0 POL").
- Nếu muốn demo nhanh không cần deploy lại: dùng ví **đã onboard sẵn** và chọn nhánh **"I already have a Smart Account"** → vào thẳng Phân cảnh 4–6.
- Chuẩn bị sẵn **2 phiên bản**: bản đầy đủ (có onboarding) và bản ngắn (chỉ transfer) tùy đối tượng xem.
