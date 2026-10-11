/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import carImg from './assets/car.png';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const LETTERS = [
  'W', 'E', 'L', 'C', 'O', 'M', 'E',
  ' ',
  'I', 'T', 'Z', 'F', 'I', 'Z', 'Z',
];

export default function App() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const carRef = useRef<HTMLImageElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const valueAddRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const road = roadRef.current;
    const car = carRef.current;
    const trail = trailRef.current;
    const valueAdd = valueAddRef.current;

    if (!section || !track || !road || !car || !trail || !valueAdd) return;

    const ctx = gsap.context(() => {
      const letters = letterRefs.current.filter(Boolean) as HTMLSpanElement[];

      const setupAnimations = () => {
        const roadWidth = window.innerWidth;
        const carWidth = car.clientWidth || 360;
        const endX = roadWidth - carWidth;

        const valueRect = valueAdd.getBoundingClientRect();
        const roadRect = road.getBoundingClientRect();
        const valueLeft = valueRect.left - roadRect.left;

        const letterOffsets = letters.map((l) => l.offsetLeft);

        // Main Car scroll animation
        gsap.to(car, {
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
            pin: track,
            invalidateOnRefresh: true,
          },
          x: endX,
          ease: 'none',
          onUpdate: function () {
            const carX = (gsap.getProperty(car, 'x') as number) + carWidth / 2;

            letters.forEach((letter, i) => {
              const letterX = valueLeft + letterOffsets[i];
              if (carX >= letterX) {
                letter.style.opacity = '1';
              } else {
                letter.style.opacity = '0';
              }
            });

            gsap.set(trail, { width: carX });
          },
        });

        // Box 1 (58%)
        gsap.to('#box1', {
          scrollTrigger: {
            trigger: section,
            start: 'top+=400 top',
            end: 'top+=600 top',
            scrub: true,
          },
          opacity: 1,
          ease: 'power1.out',
        });

        // Box 2 (23%)
        gsap.to('#box2', {
          scrollTrigger: {
            trigger: section,
            start: 'top+=600 top',
            end: 'top+=800 top',
            scrub: true,
          },
          opacity: 1,
          ease: 'power1.out',
        });

        // Box 3 (27%)
        gsap.to('#box3', {
          scrollTrigger: {
            trigger: section,
            start: 'top+=800 top',
            end: 'top+=1000 top',
            scrub: true,
          },
          opacity: 1,
          ease: 'power1.out',
        });

        // Box 4 (40%)
        gsap.to('#box4', {
          scrollTrigger: {
            trigger: section,
            start: 'top+=1000 top',
            end: 'top+=1200 top',
            scrub: true,
          },
          opacity: 1,
          ease: 'power1.out',
        });
      };

      // Ensure image is loaded before measuring
      if (car.complete) {
        setupAnimations();
      } else {
        car.onload = () => {
          setupAnimations();
          ScrollTrigger.refresh();
        };
      }

      const handleResize = () => {
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <div
      ref={sectionRef}
      className="section"
      style={{
        height: '200vh',
        position: 'relative',
        background: '#121212',
      }}
    >
      {/* Sticky Track Section */}
      <div
        ref={trackRef}
        className="track"
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#d1d1d1',
          overflow: 'hidden',
        }}
      >
        {/* Road Track */}
        <div
          ref={roadRef}
          id="road"
          className="road"
          style={{
            width: '100vw',
            height: '200px',
            backgroundColor: '#1e1e1e',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Supercar */}
          <img
            ref={carRef}
            src={carImg}
            alt="McLaren 720S"
            className="car"
            id="car"
            style={{
              height: '200px',
              position: 'absolute',
              top: '0%',
              left: 0,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          />

          {/* Green Trail */}
          <div
            ref={trailRef}
            id="trail"
            className="trail"
            style={{
              height: '200px',
              background: '#45db7d',
              position: 'absolute',
              top: 0,
              left: 0,
              zIndex: 1,
              width: 0,
            }}
          />

          {/* Headline Text: W E L C O M E   I T Z F I Z Z */}
          <div
            ref={valueAddRef}
            id="valueText"
            className="value-add"
            style={{
              top: '15%',
              fontSize: 'clamp(4rem, 8vw, 8rem)',
              fontWeight: 'bold',
              fontFamily: 'sans-serif',
              position: 'absolute',
              left: '5%',
              zIndex: 5,
              display: 'flex',
              gap: '0.3rem',
              lineHeight: 1,
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            {LETTERS.map((char, index) => {
              if (char === ' ') {
                return (
                  <span key={index} style={{ width: '2rem', display: 'inline-block' }}>
                    &nbsp;
                  </span>
                );
              }
              return (
                <span
                  key={index}
                  ref={(el) => {
                    letterRefs.current[index] = el;
                  }}
                  className="value-letter"
                  style={{
                    color: '#111',
                    opacity: 0,
                    transition: 'opacity 0.1s ease',
                  }}
                >
                  {char}
                </span>
              );
            })}
          </div>
        </div>

        {/* Box 1 (58%) */}
        <div
          id="box1"
          className="text-box"
          style={{
            opacity: 0,
            padding: '30px',
            borderRadius: '10px',
            position: 'absolute',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '5px',
            background: '#def54f',
            color: '#111',
            fontSize: '18px',
            top: '5%',
            right: '30%',
          }}
        >
          <span
            className="num-box"
            style={{
              fontSize: '58px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            58%
          </span>
          Increase in pick up point use
        </div>

        {/* Box 2 (23%) */}
        <div
          id="box2"
          className="text-box"
          style={{
            opacity: 0,
            padding: '30px',
            borderRadius: '10px',
            position: 'absolute',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '5px',
            background: '#6ac9ff',
            color: '#111',
            fontSize: '18px',
            bottom: '5%',
            right: '35%',
          }}
        >
          <span
            className="num-box"
            style={{
              fontSize: '58px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            23%
          </span>
          Decreased in customer phone calls
        </div>

        {/* Box 3 (27%) */}
        <div
          id="box3"
          className="text-box"
          style={{
            opacity: 0,
            padding: '30px',
            borderRadius: '10px',
            position: 'absolute',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '5px',
            background: '#333',
            color: '#fff',
            fontSize: '18px',
            top: '5%',
            right: '10%',
          }}
        >
          <span
            className="num-box"
            style={{
              fontSize: '58px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            27%
          </span>
          Increase in pick up point use
        </div>

        {/* Box 4 (40%) */}
        <div
          id="box4"
          className="text-box"
          style={{
            opacity: 0,
            padding: '30px',
            borderRadius: '10px',
            position: 'absolute',
            zIndex: 5,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            flexDirection: 'column',
            gap: '5px',
            background: '#fa7328',
            color: '#111',
            fontSize: '18px',
            bottom: '5%',
            right: '12.5%',
          }}
        >
          <span
            className="num-box"
            style={{
              fontSize: '58px',
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            40%
          </span>
          Decreased in customer phone calls
        </div>
      </div>
    </div>
  );
}
