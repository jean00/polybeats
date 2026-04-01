import { useState, useRef, useEffect } from "react"
import * as Tone from "tone"

const useMetronome = () => {
  const [isPlaying, setIsPlaying] = useState(false)

  // Usiamo i Ref per mantenere la stessa istanza tra i vari render di React
  const synthRef = useRef<Tone.Synth | null>(null)
  const transport = Tone.getTransport()

  useEffect(() => {
    // Inizializziamo il synth una sola volta e lo connettiamo all'uscita
    synthRef.current = new Tone.Synth({
      oscillator: { type: "sine" },
      envelope: { attack: 0.001, decay: 0.1, sustain: 0, release: 0.1 },
    }).toDestination() // <--- FONDAMENTALE

    // Pulizia quando il componente viene smontato
    return () => {
      synthRef.current?.dispose()
      transport.cancel() // Rimuove tutti i loop pianificati
    }
  }, [transport])

  const start = async () => {
    // 1. Sblocca l'audio nel browser (promessa)
    await Tone.start()

    // 2. Configura il loop (se non è già programmato)
    transport.cancel() // Pulisce loop precedenti
    transport.scheduleRepeat((time) => {
      // Usiamo il trigger dal Ref
      synthRef.current?.triggerAttackRelease("C5", "16n", time)
    }, "4n")

    // 3. Avvia il motore
    transport.position = 0
    transport.start()
    setIsPlaying(true)
  }

  const stop = () => {
    transport.stop()
    setIsPlaying(false)
  }

  const setBpm = (newBpm: number) => {
    transport.bpm.value = newBpm
  }

  return {
    isPlaying,
    start,
    stop,
    setBpm,
    bpm: transport.bpm.value, // Restituisce il valore numerico
  }
}

export default useMetronome
