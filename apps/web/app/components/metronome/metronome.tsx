"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import useMetronome from "@/hooks/useMetronome";
import { PauseIcon, PlayIcon } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import BeatsVisualizer from "./components/beats-visualizer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";

const timeSignatureNumerators = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const timeSignatureDenominators = [2, 4, 8, 16];

const Metronome = () => {
  const [activeBeat, setActiveBeat] = useState(-1);
  const {
    isPlaying,
    bpm,
    timeSignature,
    editTimeSignature,
    setBpm,
    start,
    stop,
    tapTempo,
  } = useMetronome((index) => {
    setActiveBeat(index);
    setTimeout(() => setActiveBeat(-1), 100);
  });
  const [numerator, denominator] = timeSignature;
  const inputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [tempBpm, setTempBpm] = useState(bpm);

  const handleBpmChange = (operation: "increment" | "decrement") => {
    const newBpm = operation === "increment" ? tempBpm + 1 : tempBpm - 1;
    setTempBpm(newBpm);
    setBpm(newBpm);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setBpm(tempBpm);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  useEffect(() => {
    setTempBpm(bpm);
  }, [bpm]);

  return (
    <section className="flex h-full w-full flex-col items-center justify-center gap-4">
      <span className="item-center flex flex-row justify-center">
        {isEditing ? (
          <Input
            // disabled
            ref={inputRef}
            value={tempBpm}
            onChange={(e) => setTempBpm(Number(e.target.value))}
            onBlur={() => {
              setBpm(tempBpm);
              setIsEditing(false);
            }}
            onKeyDown={handleKeyDown}
            className="h-auto w-62.5 border-none bg-transparent text-center text-6xl font-bold focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className={cn(
              "cursor-pointer text-6xl font-bold transition-colors hover:text-blue-400",
              "rounded-md border border-transparent px-3 hover:border-slate-800"
            )}
          >
            {bpm.toFixed(0)}
            <span className="ml-2 text-sm text-muted-foreground uppercase">
              Bpm
            </span>
          </p>
        )}
      </span>
      <div className="flex items-center gap-2">
        <Select
          defaultValue={numerator?.toString() || "4"}
          onValueChange={(value) =>
            editTimeSignature(Number(value), denominator)
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {timeSignatureNumerators.map((numerator) => (
                <SelectItem key={numerator} value={numerator.toString()}>
                  {numerator}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        /
        <Select
          defaultValue={denominator?.toString() || "4"}
          onValueChange={(value) => editTimeSignature(numerator, Number(value))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {timeSignatureDenominators.map((denominator) => (
                <SelectItem key={denominator} value={denominator.toString()}>
                  {denominator}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="flex gap-4">
        {[...Array(numerator)].map((_, i) => (
          <BeatsVisualizer key={i} index={i} activeBeat={activeBeat} />
        ))}
      </div>
      <div className="flex flex-row gap-4">
        <Button
          className="rounded-md bg-green-500 px-4 py-2 text-white"
          onClick={() => {
            handleBpmChange("decrement");
          }}
        >
          -1
        </Button>
        <Button
          className="rounded-md bg-green-500 px-4 py-2 text-white"
          onClick={isPlaying ? stop : start}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </Button>
        <Button
          className="rounded-md bg-green-500 px-4 py-2 text-white"
          onClick={() => handleBpmChange("increment")}
        >
          +1
        </Button>
      </div>
      <Button
        className="rounded-md bg-green-500 px-4 py-2 text-white"
        onClick={tapTempo}
      >
        tap tempo
      </Button>
    </section>
  );
};

export default Metronome;
