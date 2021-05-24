import { useState, useEffect } from 'react';

function Clock() {
  const [currTime, setCurrTime] = useState(0);

  useEffect(() => {
    fetch('/api/time')
      .then(res => res.json())
      .then(data => {
        setCurrTime(data.time);
      });
  }, []);

  return (
    <div>The current time is {currTime}.</div>
  )
}

export default Clock;