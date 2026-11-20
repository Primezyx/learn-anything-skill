import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

// Replace this module for a different mechanism; keep Lesson, fps and durationInFrames.
export const fps = 24;
const values = [2, 5, 8, 12, 16, 23, 31];
const target = 16;
const beats = [
  {seconds: 3, range: [0, 6], next: [0, 6], title: '先看整段有序数据', caption: '数字从小到大排列。下方实线标出了仍可能包含 16 的范围。'},
  {seconds: 5, range: [0, 6], next: [4, 6], mid: 3, title: '12 < 16，排除左半段', caption: '中点和它左边的数都不大于 12，不可能是 16。'},
  {seconds: 5, range: [4, 6], next: [4, 4], mid: 5, title: '23 > 16，排除右半段', caption: '只在剩余三个数里取中点。23 和右侧的数一起排除。'},
  {seconds: 4, range: [4, 4], next: [4, 4], mid: 4, title: '16 = 16，找到目标', caption: '关键不是每次猜得准，而是有序性保证被排除的区间不含目标。'},
];
export const durationInFrames = fps * beats.reduce((sum, b) => sum + b.seconds, 0);
const card = 132, gap = 16, pitch = card + gap;
const lerp = (a, b, t) => a + (b - a) * t;
const colors = {bg: '#11202e', text: '#f4f7fc', soft: '#bdceda', line: '#68d7c8', focus: '#ffd18c'};

export function Lesson() {
  const frame = useCurrentFrame();
  let i = 0, local = frame;
  while (i < beats.length - 1 && local >= beats[i].seconds * fps) local -= beats[i++].seconds * fps;
  const b = beats[i];
  const t = interpolate(local, [1.5 * fps, 2.5 * fps], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const left = lerp(b.range[0], b.next[0], t), right = lerp(b.range[1], b.next[1], t);
  const inside = (j, range) => j >= range[0] && j <= range[1];
  return <AbsoluteFill style={{backgroundColor: colors.bg, color: colors.text, padding: '58px 80px', fontFamily: '"Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", sans-serif'}}>
    <div style={{display: 'flex', justifyContent: 'space-between', color: colors.line, fontSize: 26, fontWeight: 650}}><span>算法图解　/　二分查找</span><span>{i + 1} / {beats.length}</span></div>
    <h1 style={{fontSize: 58, lineHeight: 1.16, margin: '32px 0 10px'}}>{b.title}</h1>
    <div style={{fontSize: 28, color: colors.soft}}>在升序数组中查找目标值 {target}</div>
    <div style={{width: values.length * pitch - gap, margin: '58px auto 0', position: 'relative', height: 194}}>
      {values.map((n, j) => {
        const strength = lerp(Number(inside(j, b.range)), Number(inside(j, b.next)), t);
        const focus = j === b.mid && strength > 0.25;
        return <div key={n} style={{position: 'absolute', left: j * pitch, top: 0, width: card, textAlign: 'center', opacity: 0.34 + strength * 0.66}}>
          <div style={{height: 38, fontSize: 24, color: colors.focus}}>{focus ? (n === target ? '命中' : '中点') : ''}</div>
          <div style={{height: 96, lineHeight: '90px', fontSize: 48, fontWeight: 700, borderRadius: 14, boxSizing: 'border-box', border: `3px solid ${focus ? colors.focus : '#7897ae'}`, background: focus ? '#493b2c' : '#203448'}}>{n}</div>
        </div>;
      })}
      <div style={{position: 'absolute', top: 143, left: left * pitch, width: (right - left) * pitch + card, height: 14, boxSizing: 'border-box', border: `4px solid ${colors.line}`, borderTop: 0}} />
      <div style={{position: 'absolute', top: 163, left: left * pitch, width: (right - left) * pitch + card, fontSize: 22, color: colors.line, textAlign: 'center'}}>候选区间</div>
    </div>
    <div style={{marginTop: 'auto', minHeight: 88, borderTop: '1px solid #527087', paddingTop: 18, fontSize: 30, lineHeight: 1.45}}>{b.caption}</div>
  </AbsoluteFill>;
}
