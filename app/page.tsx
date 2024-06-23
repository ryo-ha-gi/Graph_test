"use client"
import { useEffect, useState } from 'react';
import Matter from 'matter-js';

export default function Home() {
  // console.log("start")
  const [boxes, setBoxes] = useState([
    { id: 1, x: 200, y: 200 },
    { id: 2, x: 400, y: 200 },
    { id: 3, x: 600, y: 200 },
  ]);
  const [mouse_coordinates, setMouse_coordninates] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      element: document.body,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    const ground = Matter.Bodies.rectangle(400, 580, 810, 60, { isStatic: true });
    Matter.World.add(world, ground);

    const boxBodies = boxes.map((box, index) => {
      const body = Matter.Bodies.rectangle(box.x, box.y, 80, 80, {
        restitution: 0.7,
        render: { fillStyle: 'red' },
      });
      Matter.World.add(world, body);
      return { id: box.id, body };
    });

    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: { visible: false },
      },
    });
    Matter.World.add(world, mouseConstraint);

    const update = () => {
      Matter.Engine.update(engine);
      setBoxes(currentBoxes =>
        currentBoxes.map(box => {
          const boxBody = boxBodies.find(b => b.id === box.id);
          return boxBody
            ? { ...box, x: boxBody.body.position.x, y: boxBody.body.position.y }
            : box;
        })
      );
      requestAnimationFrame(update);
    };

    Matter.Runner.run(engine);
    Matter.Render.run(render);
    update();

    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world,false);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h1>Next.js with Matter.js</h1>
      {boxes.map(box => (
        <div
          key={box.id}
          onMouseMove={e => setMouse_coordninates({x:e.clientX,y:e.clientY})}
          style={{
            position: 'absolute',
            left: box.x - 40, // 中心を基準に位置を調整
            top: box.y - 40, // 中心を基準に位置を調整
            width: 80,
            height: 80,
            backgroundColor: 'red',
          }}
        />
      ))}
      <div id="matter-scene" />
      <p>x:{mouse_coordinates.x} y:{mouse_coordinates.y}</p>
    </div>
  );
}
