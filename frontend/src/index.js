import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from './store/store';
import { theme } from './theme';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

//theme
import "primereact/resources/themes/lara-light-indigo/theme.css";     
//core
import "primereact/resources/primereact.min.css";
//icons
import "primeicons/primeicons.css";     

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();