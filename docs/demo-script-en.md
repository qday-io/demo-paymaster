# 🎬 Demo Script — USD8 Gasless Transfer

**Suggested length:** ~3–4 minutes
**Core message:** Users transfer USD8 **without holding POL for gas** — the paymaster covers the fee and is reimbursed in USD8.

## Pre-recording checklist
- A MetaMask wallet that already holds some **POL** (for bootstrap) and some **USD8** (to transfer).
- The correct network selected (Polygon/Amoy testnet, depending on config).
- Two tabs open: the app + (optional) a block explorer to show the tx.
- To record the full "create new" flow: use a wallet whose smart account has **never been deployed**.

---

## Scene 0 — Intro (10s)
- **Screen:** `EntryChoice` page — "USD8 Payment Solution" heading, two cards.
- **Voiceover:**
  > "This is a demo of a Smart Account wallet built on the ERC-4337 standard. The key idea: users transfer USD8 without needing to hold POL for gas. The Smart Account is deterministically derived from your wallet via CREATE2 — the same wallet always yields the same address."

---

## Scene 1 — Onboarding: Connect (20s)
- **Action:** Click **"Create new account"** (orange card, left side).
- **Screen:** Enter `OnboardingPage` — a 4-step progress bar: **Connect → Bootstrap → Activate → Ready**.
- **Action:** Click **"Connect Wallet"** → pick MetaMask → approve.
- **Voiceover:**
  > "Step one: connect your EOA wallet. The moment you connect, the system derives your Smart Account address — and it never changes."
- **Recording note:** After connecting, a brief "Setting up your Smart Account" loading screen flashes by.

---

## Scene 2 — Onboarding: Bootstrap (one-time POL funding) (35s)
- **Screen:** The **"One-Time Bootstrap"** step — lightning icon, showing the Smart Account address + "Current POL balance".
- **Voiceover:**
  > "Since this is the first time, the Smart Account needs a small amount of POL — around 0.1 POL — to cover the one-time deployment fee. This is a one-time cost only."
- **Action:** Click **"Send POL to Smart Account"** → opens `SendPolModal`.
  - Pick the **0.1 POL** preset (or hit Max).
  - Click **"Send 0.1000 POL"** → confirm in MetaMask.
- **Screen:** A green "Transaction submitted!" banner appears, the modal auto-closes, then a **"Transfer sent!"** banner shows on the page.
- **Voiceover:**
  > "The POL is sent straight from your wallet to the Smart Account. The page auto-updates the balance and advances once the POL arrives."
- **Recording note:** Wait for the balance to reach ≥ 0.1 POL → the app **auto-advances** to the Activate step. You can trim the block-wait time in editing.

---

## Scene 3 — Onboarding: Activate (approve + deploy) (35s)
- **Screen:** The **"Activate Gasless Mode"** step — shield icon, "Gas cost after activation = 0 POL forever".
- **Voiceover:**
  > "Final step: approve the USD8 Paymaster. This very transaction also deploys the Smart Account on-chain. After this, every future transaction is paid by the paymaster — you'll never need POL again."
- **Action:** Click **"Activate Gasless Transactions"** → confirm in the wallet.
- **Screen:** A "Sending UserOperation…" alert (bundler wait ~10–30s) → the button changes to "Approved — refreshing…".
- **Screen:** The **"You're All Set!"** step (green check).
- **Action:** Click **"Open App"**.

---

## Scene 4 — Main screen: Account State (25s)
- **Screen:** Main transfer screen — the **"Account State"** panel ("live" badge).
- **Voiceover (pointing at each part):**
  > "This is the account state. On the left is you — your USD8 and POL balances. Below are four indicators: **Paymaster approved** ✓, **Smart account deployed** ✓, the **POL/USD** rate from the oracle, and the **Paymaster deposit**."
- **Recording note:** Zoom into the **POL balance** (green box) to emphasize the POL stays essentially unchanged after a transaction.

---

## Scene 5 — Gasless USD8 transfer (40s) ⭐ highlight
- **Screen:** The **"Transfer USD8"** card.
- **Voiceover:**
  > "Now let's send money. The recipient is pre-filled, so I just enter an amount — say 10 USD8."
- **Action:**
  - (If an "Approval required" alert shows → click **"Approve Paymaster"** first, explaining this is a one-time approval.)
  - Enter amount **10**.
  - Click **"Send Transfer"**.
- **Screen:** The button changes to "Sending UserOp…" (spinner).
- **Voiceover (while waiting):**
  > "This is a UserOperation submitted through the bundler. The user signs it, but the gas fee is fronted by the paymaster — the wallet doesn't spend a single POL."

---

## Scene 6 — Transaction result (30s) ⭐ message payoff
- **Screen:** The **"Transfer Complete"** card (green border, "Block #…" badge).
- **Voiceover (pointing at the table):**
  > "Done. This table is fully transparent about costs: USD8 sent, gas pre-charged in USD8, the refund for overcharge, the net gas — and most importantly:"
- **Action:** Zoom/circle the final green row **"POL spent → 0 POL"**.
  > "**0 POL.** All gas was paid in USD8 through the paymaster. The user only needs to hold USD8."
- **Action (optional):** Click the tx hash → open the explorer to prove the transaction is real and on-chain.
- **Screen:** Back to the Account State panel — sender's USD8 drops, recipient's rises, and **POL stays essentially the same**.

---

## Scene 7 — Closing (10s)
- **Voiceover:**
  > "In short: bootstrap once with POL, approve the paymaster once — after that, every USD8 transfer is completely gasless. That's the Smart Account experience with an ERC-4337 paymaster."

---

## 📝 Recording tips
- **Trim block-wait times** (bootstrap & UserOp) in editing to keep the video tight.
- Record in **light theme** with clear fonts; zoom into the key numbers (POL balance, "0 POL").
- For a quick demo without redeploying: use an **already-onboarded** wallet and choose the **"I already have a Smart Account"** path → jump straight to Scenes 4–6.
- Prepare **two versions**: a full one (with onboarding) and a short one (transfer only) depending on your audience.
