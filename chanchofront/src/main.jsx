import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MongoDataProvider } from './Context/MongoDataContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MongoDataProvider>
      <App />
    </MongoDataProvider>
  </React.StrictMode>
);
