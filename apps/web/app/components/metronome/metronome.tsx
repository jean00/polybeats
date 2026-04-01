"use client"
import React, { useEffect, useRef, useState } from "react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import useMetronome from "@/hooks/useMetronome"
import { PauseIcon, PlayIcon } from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const Metronome = () => {
  const { isPlaying, bpm, setBpm, start, stop } = useMetronome()
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [tempBpm, setTempBpm] = useState(bpm.value)

  // Focus automatico quando si entra in modalità edit
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
      inputRef.current?.select() // Seleziona tutto il testo per comodità
    }
  }, [isEditing])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "Escape") {
      setBpm(tempBpm)
      setIsEditing(false)
    }
  }

  return (
    <>
      <span className="item-center flex flex-row justify-center">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={tempBpm}
            onChange={(e) => setTempBpm(Number(e.target.value))}
            onBlur={() => {
              setBpm(tempBpm)
              setIsEditing(false)
            }}
            onKeyDown={handleKeyDown}
            className="h-auto w-[250px] border-none bg-transparent text-center text-6xl font-bold focus-visible:ring-1 focus-visible:ring-blue-500"
          />
        ) : (
          <p
            onClick={() => setIsEditing(true)}
            className={cn(
              "cursor-pointer text-6xl font-bold transition-colors hover:text-blue-400",
              "rounded-md border border-transparent px-3 hover:border-slate-800"
            )}
          >
            {bpm.value}
            <span className="ml-2 text-sm text-muted-foreground uppercase">
              Bpm
            </span>
          </p>
        )}
      </span>
      <Button
        className="rounded-md bg-green-500 px-4 py-2 text-white"
        onClick={isPlaying ? stop : start}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </Button>
    </>
  )
}

export default Metronome
