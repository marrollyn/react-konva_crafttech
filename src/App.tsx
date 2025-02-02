import './App.css';
import { useState } from 'react';
import StageComp from './components/Stage';
import Buttons from './components/Buttons';

function App() {

  const [shape, setShape] = useState('');

  return (
    <>
      <Buttons shape={shape} setShape={setShape} />
      <StageComp shape={shape} setShape={setShape} />
    </>
  )
}

export default App
