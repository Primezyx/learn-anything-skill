import React, {useEffect, useMemo, useRef, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {Lesson, fps, span, makeSteps, targets} from './lesson';

function Lab({target, setTarget}) {
  const ref = useRef(null), [i,setI] = useState(0), [playing,setPlaying] = useState(false), [atEnd,setAtEnd] = useState(false);
  const query = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)'), []);
  const [reduced,setReduced] = useState(query.matches);
  const steps = useMemo(() => makeSteps(target), [target]);
  const props = useMemo(() => ({steps,reduced}), [steps,reduced]);
  const total = steps.length * span;
  useEffect(() => {
    const p = ref.current;
    function frame(e){setI(Math.min(steps.length-1,Math.floor(e.detail.frame/span))); setAtEnd(e.detail.frame >= total-1);}
    function start(){setPlaying(true);} function stop(){setPlaying(false);} function end(){stop();setAtEnd(true);}
    function motion(){setReduced(query.matches);if (query.matches) p.pause();}
    const events = [['frameupdate',frame],['seeked',frame],['play',start],['pause',stop],['ended',end]];
    events.forEach(([name,fn])=>p.addEventListener(name,fn));query.addEventListener('change',motion);
    return () => {events.forEach(([name,fn])=>p.removeEventListener(name,fn));query.removeEventListener('change',motion);};
  },[query,steps,total]);
  function jump(j){const p=ref.current;p.pause();p.seekTo(j===0 ? 0 : j*span + 42);}
  function toggle(){const p=ref.current;if(p.isPlaying()) p.pause(); else {if(atEnd) p.seekTo(0); p.play();}}
  return <div className="box"><div className="bar"><small>探索　/　候选区间</small><label>查找目标　<select aria-label="查找目标" value={target} onChange={e=>setTarget(Number(e.target.value))}>{targets.map(n=><option key={n} value={n}>{n}</option>)}</select></label></div>
    <div className="pad"><div aria-live="polite" aria-atomic="true"><small>{steps[i].tag}　·　第 {i+1} 步</small><h2 id="step-title">{steps[i].title}</h2><p className="panelnote">{steps[i].note}</p></div>
    <div className="stage"><Player ref={ref} component={Lesson} inputProps={props} durationInFrames={total} fps={fps} compositionWidth={598} compositionHeight={152} controls={false} autoPlay={false} loop={false} moveToBeginningWhenEnded={false} numberOfSharedAudioTags={0} style={{width:'100%'}}/></div>
    <p className="legend">括线表示候选范围；“中点”标出本次比较的数。</p>
    <div className="controls"><button className="primary" onClick={toggle}>{playing?'暂停':atEnd?'重播':'播放'}</button><button onClick={()=>jump(i-1)} disabled={i===0}>上一步</button><button onClick={()=>jump(i+1)} disabled={i===steps.length-1}>下一步</button><button onClick={()=>jump(0)}>重置</button><span className="status" id="progress">步骤 {i+1} / {steps.length}</span></div></div></div>;
}
function App(){const [target,setTarget]=useState(targets[0]);return <Lab key={target} target={target} setTarget={setTarget}/>;}
createRoot(document.getElementById('app')).render(<App/>);
