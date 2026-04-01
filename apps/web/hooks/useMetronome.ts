import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

const useMetronome = (onBeat: (beat: number) => void) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);
  const transport = Tone.getTransport();

  useEffect(() => {
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination();

    return () => {
      synthRef.current?.dispose();
      transport.cancel();
    };
  }, [transport]);

  const start = async () => {
    let beatCount = 0;
    await Tone.start();
    transport.cancel();
    transport.scheduleRepeat((time) => {
      const isFirstBeat = beatCount === 0;
      synthRef.current?.triggerAttackRelease(
        isFirstBeat ? "C5" : "C4",
        "16n",
        time
      );
      Tone.Draw.schedule(() => {
        onBeat(beatCount);
        beatCount = (beatCount + 1) % 4;
      }, time);
    }, "4n");

    transport.position = 0;
    transport.start();
    setIsPlaying(true);
  };

  const stop = () => {
    transport.stop();
    setIsPlaying(false);
  };

  const setBpm = (newBpm: number) => {
    transport.bpm.value = newBpm;
  };

  const setTimeSignature = (numerator: number, denominator: number) => {
    transport.timeSignature = [numerator, denominator];
  };

  return {
    isPlaying,
    start,
    stop,
    setBpm,
    bpm: transport.bpm.value,
    timeSignature: transport.timeSignature,
    setTimeSignature,
  };
};

export default useMetronome;
