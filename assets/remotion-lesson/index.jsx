import React from 'react';
import {Composition, registerRoot} from 'remotion';
import {Lesson, durationInFrames, fps} from './lesson';

const Root = () => <Composition id="Lesson" component={Lesson} width={1280} height={720} fps={fps} durationInFrames={durationInFrames} />;
registerRoot(Root);
