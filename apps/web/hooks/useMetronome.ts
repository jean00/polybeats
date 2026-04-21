import { useState, useRef, useEffect } from "react";
import * as Tone from "tone";

const useMetronome = (onBeat: (beat: number) => void) => {
  const transport = Tone.getTransport();
  const [bpm, setBpm] = useState(transport.bpm?.value ?? 120);
  const [timeSignature, setTimeSignature] = useState([4, 4]);
  const [isPlaying, setIsPlaying] = useState(false);
  const synthRef = useRef<Tone.Synth | null>(null);

  const updateBpm = (newBpm: number) => {
    setBpm(newBpm);
    transport.bpm.value = newBpm;
  };

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
        beatCount = (beatCount + 1) % (timeSignature[0] || 4);
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

  const editTimeSignature = (numerator = 4, denominator = 4) => {
    transport.timeSignature = [numerator, denominator];
    setTimeSignature([numerator, denominator]);
    stop();
  };

  const tapTempo = () => {
    const currentTime = transport.seconds;
    transport.stop().start();
    const newBpm = currentTime > 0 ? 60 / currentTime : 120;
    const formatNumber = Number(newBpm.toFixed(0));
    updateBpm(formatNumber);
  };

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

  return {
    isPlaying,
    start,
    stop,
    setBpm: updateBpm,
    bpm,
    timeSignature,
    editTimeSignature,
    tapTempo,
  };
};

export default useMetronome;
