# onLiq

**onLiq** is a mobile-first React Native app that onboards crypto-native users and beginners into **Hyperliquid** in one flow, and lets them trade **themes, pairs, and directional bets** using the **Pear Execution API**.

It removes friction from wallet setup, bridging, and execution — users can go from email → funded account → live trades on mainnet in minutes.

---

## 🚀 What is onLiq?

onLiq is an opinionated trading app designed around **ideas, not charts**.

Instead of forcing users to manually long/short single tokens, onLiq introduces:
- **One-click onboarding to Hyperliquid**
- **Theme-based investing (“investment pies”)**
- **Pair & basket trading via Pear**
- **Cross-chain bridging via LI.FI**

Everything executes **real trades on mainnet**.

DEMO VIDEO : https://youtube.com/shorts/aWw1oms4U2o?si=t0_tM-0mxrku1-Y1

---

## 🧠 Key Features

### 🔐 Smart Onboarding
- Connect an existing Web3 wallet **or**
- Sign up with email & password
- Non-custodial wallet is created and securely managed for the user

### 🌉 One-Click Bridging (LI.FI)
- Bridge from **any chain, any token** to HyperEVM
- Powered by **LI.FI routing**
- Shows execution status, progress, and final amount
- Optional auto-funding into Hyperliquid

### 📊 Trade with Investment Pies (Pear)
- Trade **ideas instead of tokens**
- Long / Short with simple sliders and presets
- Examples:
  - Long ETH / Short BTC
  - Long Hyperliquid ecosystem
  - Directional thematic baskets
- All executions use the **Pear Execution API**

### 🔁 Universal Bridge Page
- Dedicated bridge screen inside the app
- Bridge tokens between chains at any time using LI.FI
- Not just onboarding — reusable infrastructure

### 💰 Mainnet, Real Trades
- No testnet
- No mocks
- Real funds, real execution, real volume

---

## 🧩 How It Uses the APIs

### Pear Execution API
- Executes **pair trades**, **basket trades**, and **directional positions**
- Abstracts complex execution into beginner-friendly actions
- Enables trading narratives, ecosystems, and strategies

### LI.FI
- Handles cross-chain swaps and bridges in a single flow
- Used for:
  - Initial onboarding deposits
  - In-app universal bridge experience
- Improves reliability with route visibility and execution states

---

## 🏗️ Tech Stack

- **React Native (Expo)**
- **Hyperliquid / HyperEVM**
- **Pear Protocol Execution API**
- **LI.FI SDK / API**
- **TypeScript**

---

## 🧪 Running Locally

```bash
git clone https://github.com/sahid-m/onliq
cd onliq
npm install
npx expo start
