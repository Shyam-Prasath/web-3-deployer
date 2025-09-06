# 🌐 Web 3 Deployer

### Decentralized Website & dApp Hosting Platform 

Web 3 Deployer is a **fully decentralized hosting platform** that allows developers to deploy **static websites** and **dApps** securely on the blockchain.
It leverages **IPFS & Pinata** for distributed file storage, **Web3Storage** for persistent and censorship-resistant hosting, and **smart contracts** for verifiable, permanent deployments.
With **Web3Auth-based authentication** and **AI-powered assistance** via **Google Gemini**, developers get a seamless and intelligent deployment experience.

---

## 🚀 Core Features

* 🔗 **Decentralized Hosting** – Deploy sites directly to **IPFS** & **Pinata** with blockchain verification.
* 🗄️ **Storage Options** – Dual integration with **Pinata** (fast, reliable IPFS gateway) and **Web3Storage** (Filecoin-backed persistence).
* 📜 **Smart Contracts** – Immutable, on-chain records of deployments ensuring transparency & permanence.
* 🔒 **Web3Auth Authentication** – Secure decentralized login with wallets or social accounts.
* 🧠 **AI Assistance** – **Google Gemini AI** provides deployment guidance, error handling, and intelligent user interactions.
* 📊 **Real-time Analytics** – Monitor traffic, users, and engagement with blockchain-backed tracking.
* 🎨 **Modern UI** – Clean, responsive interface built with **React.js + TailwindCSS**.

---

## 🛠️ Tech Stack

| Layer              | Technology Used                                          |
| ------------------ | -------------------------------------------------------- |
| **Frontend**       | React.js, TailwindCSS                                    |
| **Backend**        | Drizzle ORM + Neon Database (PostgreSQL)                 |
| **Storage**        | IPFS, **Pinata**, Web3Storage                            |
| **Blockchain**     | Solidity Smart Contracts (Ethereum / Polygon compatible) |
| **Authentication** | Web3Auth                                                 |
| **AI Integration** | Google Gemini API                                        |
| **Deployment**     | Blockchain-based decentralized hosting                   |

---

## ⚡ Architecture Overview

1. **Frontend UI** → Developer uploads project files via React.js interface.
2. **Storage Layer** → Files pinned to **IPFS** using **Pinata** or stored with **Web3Storage**.
3. **Blockchain Layer** → A smart contract records the deployment hash (IPFS CID), ensuring tamper-proof hosting.
4. **Authentication Layer** → Users sign in with **Web3Auth** (wallets or OAuth).
5. **AI Integration** → **Google Gemini** assists with deployment validation, analytics interpretation, and recommendations.
6. **Analytics Layer** → Smart contracts + database track usage, engagement, and interactions in real time.

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Shyam-Prasath/web-3-deployer.git
cd web-3-deployer
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=your_neon_database_url
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret
WEB3_STORAGE_API=your_web3_storage_key
WEB3AUTH_CLIENT_ID=your_web3auth_client_id
GEMINI_API_KEY=your_gemini_api_key
```

### 4️⃣ Run the Development Server

```bash
npm run dev
```

### 5️⃣ Build for Production

```bash
npm run build
```

---

## 🔮 Future Enhancements

* 🌍 **Multi-chain Deployment** → Support Ethereum, Polygon, Solana, Avalanche.
* 🪙 **Token Economy** → Incentives for hosting & validation.
* 🧩 **Plugin Ecosystem** → AI-powered deployment optimizations, security checks, and SEO plugins.
* 📡 **Decentralized CDN Layer** → Faster global distribution of dApps via IPFS gateways.
* 🤝 **DAO Governance** → Community-led management of hosting policies.

---
