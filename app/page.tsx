"use client"
import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';

export default function Home() {
  const scene = useRef(null);
  const [boxPosition, setBoxPosition] = useState({ x: 400, y: 200 });
  const boxRef = useRef(null);

  useEffect(() => {
    // Matter.js のエンジン、ワールド、レンダラを作成
    const engine = Matter.Engine.create();
    const world = engine.world;
    const render = Matter.Render.create({
      element: scene.current,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false,
      },
    });

    // 床を作成
    const ground = Matter.Bodies.rectangle(400, 580, 810, 60, { isStatic: true });
    Matter.World.add(world, ground);

    // 動かすボックスを作成
    const box = Matter.Bodies.rectangle(400, 200, 80, 80, {
      restitution: 0.7,
      render: {
        fillStyle: 'red'
      }
    });
    Matter.World.add(world, box);
    boxRef.current = box;

    // マウス操作を追加
    const mouse = Matter.Mouse.create(render.canvas);
    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false
        }
      }
    });
    Matter.World.add(world, mouseConstraint);

    // Matter.jsのエンジンを更新する関数
    const update = () => {
      Matter.Engine.update(engine);
      setBoxPosition({
        x: box.position.x,
        y: box.position.y
      });
      requestAnimationFrame(update);
    };

    // 物理演算とレンダリングを開始
    Matter.Engine.run(engine);
    Matter.Render.run(render);
    update();

    // クリーンアップ関数
    return () => {
      Matter.Render.stop(render);
      Matter.World.clear(world,true);
      Matter.Engine.clear(engine);
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <h1>Next.js with Matter.js</h1>
      <div
        style={{
          position: 'absolute',
          left: boxPosition.x - 40, // 中心を基準に位置を調整
          top: boxPosition.y - 40, // 中心を基準に位置を調整
          width: 80,
          height: 80,
          backgroundColor: 'red',
          "pointer-events": "none"
        }}
      />
      <div ref={scene} />
    </div>
  );
}
