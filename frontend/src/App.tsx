import React from 'react';
import './App.scss';

import { mdiAccount } from '@mdi/js'
import Button from './components/Button';
import IconButton from './components/IconButton';

import colors from "./colors.module.scss";

function App() {
  return (
    <div className="page-container">
      <div className="page-app-bar">
        <img src="/logo.svg" alt="Logo" height={48}></img>
        <div className="app-bar-title">Skelearn</div>
        <div className="app-bar-spacer"></div>
        <IconButton inverted={true} color="primary" size="small" icon={mdiAccount}></IconButton>
      </div>
      <div className="title-area">
        <span className="title">Ske<span style={{color: colors["accent-color"]}}>learn</span></span>
      </div>
      <div className="content-area">
        <span className='slogan'>Learn bones - become a boner.</span>
        <Button size='large' color='accent'>Jetzt loslegen!</Button>
      </div>
    </div>
  );
}

export default App;
