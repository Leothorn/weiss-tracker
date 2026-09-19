import test from 'node:test';
import assert from 'node:assert/strict';
import {trendPositions} from '../src/trend-model.mjs';

test('trend uses real assessment spacing on a fixed zero-to-three scale',()=>{
 const points=trendPositions([
  {date:'2026-01-01T00:00:00Z',mean:3},
  {date:'2026-02-01T00:00:00Z',mean:1.5},
  {date:'2026-04-01T00:00:00Z',mean:0},
 ]);
 assert.equal(points[0].x,0);
 assert.ok(points[1].x>0&&points[1].x<.5);
 assert.equal(points[2].x,1);
 assert.deepEqual(points.map(p=>p.y),[0,.5,1]);
});

test('missing values stay unplotted and same-day entries remain distinct',()=>{
 const points=trendPositions([
  {date:'2026-01-01T00:00:00Z',mean:2},
  {date:'2026-01-01T00:00:00Z',mean:null},
  {date:'2026-01-01T00:00:00Z',mean:1},
 ]);
 assert.deepEqual(points.map(p=>p.x),[0,.5,1]);
 assert.equal(points[1].y,null);
});
