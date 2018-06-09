//@flow
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';


it('flow is super cool', () => {
  const da = (x: number, y: number): number => x+y

  var foo = {da:"boo",bar:""}
  foo.bar = "1"

  expect(da(1,2)).toBe(3) 
})

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});
