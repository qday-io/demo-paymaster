# 🎙️ Voiceover — USD8 Gasless Transfer

Tổng hợp lời thoại theo từng màn hình (chỉ phần đọc). VI + EN song song để đọc/lồng tiếng.

---

## 0. Mở đầu — `EntryChoice`
**VI:**
> Đây là demo ví Smart Account theo chuẩn ERC-4337. Điểm đặc biệt: người dùng chuyển USD8 mà không cần giữ POL để trả phí gas. Smart Account được dẫn xuất tất định từ ví của bạn qua CREATE2 — cùng một ví luôn ra cùng một địa chỉ.

**EN:**
> This is a demo of a Smart Account wallet built on the ERC-4337 standard. The key idea: users transfer USD8 without needing to hold POL for gas. The Smart Account is deterministically derived from your wallet via CREATE2 — the same wallet always yields the same address.

---

## 1. Connect — `OnboardingPage` (bước Connect)
**VI:**
> Bước 1, kết nối ví EOA. Ngay khi kết nối, hệ thống tự dẫn xuất địa chỉ Smart Account — nó không bao giờ đổi.

**EN:**
> Step one: connect your EOA wallet. The moment you connect, the system derives your Smart Account address — and it never changes.

---

## 2. Bootstrap — gửi POL một lần
**VI:**
> Vì đây là lần đầu, Smart Account cần một lượng nhỏ POL — khoảng 0.1 POL — để trả phí deploy account lần đầu. Đây là chi phí một lần duy nhất.
>
> POL được gửi thẳng từ ví sang Smart Account. Trang sẽ tự cập nhật số dư và chuyển bước khi POL về tới.

**EN:**
> Since this is the first time, the Smart Account needs a small amount of POL — around 0.1 POL — to cover the one-time deployment fee. This is a one-time cost only.
>
> The POL is sent straight from your wallet to the Smart Account. The page auto-updates the balance and advances once the POL arrives.

---

## 3. Activate — approve paymaster + deploy
**VI:**
> Bước cuối: approve USD8 Paymaster. Giao dịch này cũng chính là giao dịch deploy Smart Account lên on-chain. Sau bước này, mọi giao dịch về sau đều được paymaster trả phí — không bao giờ cần POL nữa.

**EN:**
> Final step: approve the USD8 Paymaster. This very transaction also deploys the Smart Account on-chain. After this, every future transaction is paid by the paymaster — you'll never need POL again.

---

## 4. Account State — màn chính
**VI:**
> Đây là trạng thái tài khoản. Bên trái là bạn — số dư USD8 và POL. Bên dưới là 4 chỉ số: Paymaster approved, Smart account deployed, tỷ giá POL/USD từ oracle, và Paymaster deposit.

**EN:**
> This is the account state. On the left is you — your USD8 and POL balances. Below are four indicators: Paymaster approved, Smart account deployed, the POL/USD rate from the oracle, and the Paymaster deposit.

---

## 5. Transfer USD8 — điểm nhấn
**VI:**
> Giờ thử chuyển tiền. Recipient đã điền sẵn, mình nhập số tiền — ví dụ 10 USD8.
>
> Đây là một UserOperation gửi qua bundler. Người dùng ký, nhưng phí gas do paymaster ứng trả — ví không tốn một POL nào.

**EN:**
> Now let's send money. The recipient is pre-filled, so I just enter an amount — say 10 USD8.
>
> This is a UserOperation submitted through the bundler. The user signs it, but the gas fee is fronted by the paymaster — the wallet doesn't spend a single POL.

---

## 6. Transaction Result — chốt thông điệp
**VI:**
> Giao dịch xong. Bảng này minh bạch chi phí: số USD8 đã gửi, phí gas pre-charge bằng USD8, phần hoàn lại do thu dư, net gas — và quan trọng nhất: 0 POL. Toàn bộ gas được trả bằng USD8 thông qua paymaster. Người dùng chỉ cần giữ USD8.

**EN:**
> Done. This table is fully transparent about costs: USD8 sent, gas pre-charged in USD8, the refund for overcharge, the net gas — and most importantly: zero POL. All gas was paid in USD8 through the paymaster. The user only needs to hold USD8.

---

## 7. Kết
**VI:**
> Tóm lại: bootstrap một lần bằng POL, approve paymaster một lần — sau đó mọi giao dịch USD8 đều hoàn toàn gasless. Đó là trải nghiệm Smart Account với ERC-4337 paymaster.

**EN:**
> In short: bootstrap once with POL, approve the paymaster once — after that, every USD8 transfer is completely gasless. That's the Smart Account experience with an ERC-4337 paymaster.
