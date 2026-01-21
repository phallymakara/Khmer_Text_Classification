# Khmer_Text_Classification

## frontend structure

frontend/
├── public/ # Static assets (Favicon, robots.txt)
├── src/
│ ├── assets/ # Global assets
│ │ ├── fonts/ # Khmer Unicode fonts (Kantumruy Pro, etc.)
│ │ └── images/ # Logos or icons
│ ├── components/ # Reusable UI Atoms
│ │ ├── Prediction/ # Components for current results
│ │ ├── History/ # Components for past logs
│ │ └── Shared/ # Buttons, Inputs, Spinners
│ ├── hooks/ # Custom React hooks (e.g., useClassify)
│ ├── services/ # API connection (Axios instance)
│ ├── styles/ # Global CSS and Tailwind entry
│ ├── utils/ # Helper functions (text truncation, date formatting)
│ ├── App.jsx # Main App layout
│ └── main.jsx # React entry point
├── .env # Frontend environment variables
├── tailwind.config.js # Design tokens (colors, Khmer fonts)
├── Dockerfile # Production build instructions
└── package.json
