import React from 'react';
import {useCurrentFrame, interpolate} from 'remotion';

export const values = [2, 5, 8, 12, 16, 23, 31];
export const fps = 24, span = 76;
export const targets = [16, 5, 13];
export function makeSteps(target) {
  const steps = [{lo: 0, hi: values.length - 1, a: 0, z: values.length - 1, mid: null, title: '先看有序数组', note: `要找的是 ${target}。括线覆盖所有候选；下一步从中间开始比较。`, tag: '起点'}];
  let lo = 0, hi = values.length - 1;
  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2), n = values[mid];
    const a = n < target ? mid + 1 : lo, z = n > target ? mid - 1 : hi;
    const hit = n === target;
    const note = hit ? `中点值等于目标 ${target}，查找结束。` : n < target ? `${n} 和左侧的数都小于 ${target}，所以一起排除。` : `${n} 和右侧的数都大于 ${target}，所以一起排除。`;
    steps.push({lo, hi, a: hit ? mid : a, z: hit ? mid : z, mid, hit, title: hit ? `命中 ${target}` : `${n} ${n < target ? '<' : '>'} ${target}`, note: note + (a > z ? ' 候选区间已空，目标不在数组中。' : ''), tag: hit ? '命中' : a > z ? '未找到' : '比较'});
    if (hit) break;
    lo = a; hi = z;
  }
  return steps;
}
const mix = (a, b, t) => a + (b - a) * t;
const x = j => 10 + j * 84;
export function Lesson({steps, reduced}) {
  const frame = useCurrentFrame(), i = Math.min(steps.length - 1, Math.floor(frame / span)), s = steps[i];
  const t = reduced ? 1 : interpolate(frame % span, [10, 38], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const empty = s.a > s.z, left = mix(x(s.lo), x(s.a), t), right = mix(x(s.hi) + 72, empty ? x(s.a) : x(s.z) + 72, t);
  return <svg viewBox="0 0 598 152" width="100%" height="100%" role="img" aria-label={'查找示意：' + s.title}>
    {values.map((v,j) => {
      const inBefore = j >= s.lo && j <= s.hi, inAfter = j >= s.a && j <= s.z;
      const weight = mix(+inBefore, +inAfter, t), focus = j === s.mid;
      return <g key={v} transform={`translate(${x(j)} 0)`}>
        {focus && <text x="36" y="22" textAnchor="middle" fill="#ffcf88" fontSize="16">{s.hit ? '命中' : '中点'}</text>}
        <rect x="0" y="32" width="72" height="62" rx="10" fill={focus ? '#473928' : '#21333d'} stroke={focus ? '#ffcf88' : '#68818c'} strokeDasharray={!inAfter && t > .95 && !focus ? '3 5' : undefined} opacity={.32 + .68*weight}/>
        <text x="36" y="72" textAnchor="middle" fontSize="28" fontWeight="650" fill={focus ? '#ffdc9f' : '#e4eff1'} opacity={.5 + .5*weight}>{v}</text>
      </g>;
    })}
    {(!empty || t < 1) && <path d={`M${left} 103v7H${right}v-7`} fill="none" stroke="#70e0bc" strokeWidth="3"/>}
    <text x={empty ? 299 : (left+right)/2} y="138" textAnchor="middle" fill="#8ce6c6" fontSize="16">{empty && t === 1 ? '候选区间为空' : '候选区间'}</text>
  </svg>;
}
