# OnLiq

**One-tap onboarding into Hyperliquid. Trade instantly with Pear.**

OnLiq is a mobile-first onboarding app built with **React Native + Expo** that bridges users from any chain into **HyperEVM** using **LI.FI**, then optionally auto-deposits funds into **Hyperliquid** so they can start trading immediately via **Pear**.

---

## 🚀 What OnLiq Does

- 📱 **Mobile-first onboarding** (iOS & Android)
- 🌉 **Swap + bridge in one tap** using LI.FI routing
- 📊 **Full execution visibility**: quote, ETA, steps, progress, final amount
- ⚡ **Auto-deposit to Hyperliquid**
- 🍐 **Instant trading via Pear** (pair & basket trades)

---

## 🧠 Why OnLiq

Onboarding into Hyperliquid today requires multiple steps:
bridge → wait → switch network → deposit → trade.

OnLiq compresses this into **one clean mobile flow**.

No chain juggling. No manual deposits.

---

## 🧩 Tech Stack

- **Framework**: React Native + Expo
- **Routing & Bridging**: LI.FI SDK / API
- **Destination Chain**: HyperEVM
- **Trading**: Hyperliquid + Pear Execution API
- **Wallets**: WalletConnect / embedded wallets (EVM)

---

## 🔁 User Flow

1. User selects:
   - Origin chain & token  
   - Destination asset on HyperEVM (USDC, HYPE, etc.)
2. OnLiq fetches the optimal route via LI.FI
3. User confirms → swap + bridge executes
4. Funds arrive on HyperEVM
5. (Optional) Auto-deposit into Hyperliquid
6. User trades instantly via Pear

---

## ✨ Extra Features

- Reusable **“Deposit to Hyperliquid”** mobile component
- Clear execution states and progress indicators
- Failure handling, retries, and user guidance
- Designed for reuse by other Hyperliquid mobile apps


