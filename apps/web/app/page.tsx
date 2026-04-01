import Header from "./components/header";
import Metronome from "./components/metronome/metronome";

export default function Page() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col items-center p-24">
        <Metronome />
        {/* <Button
        onClick={async () => {
          await Tone.start()
          // 2. Crea il synth
          const synth = new Tone.Synth().toDestination()

          // 3. Suona
          synth.triggerAttackRelease("C4", "8n")
        }}
      /> */}
      </main>
    </>
  );
}
