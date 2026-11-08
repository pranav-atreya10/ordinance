import { CheckCircle, Doc } from "./icons";

const Bar = ({ w }: { w: string }) => <span className="block h-2 rounded-full bg-line" style={{ width: w }} />;

/** A wireframe of an answer card. Shows the layout without making up any real rules. */
export function AnswerPreview() {
  return (
    <div className="relative mx-auto w-full max-w-3xl">
      <div className="absolute -inset-x-6 -inset-y-4 -z-10 rounded-[32px] bg-gradient-to-b from-forest/[0.06] to-transparent blur-2xl" />
      <div className="overflow-hidden rounded-[22px] border border-line bg-surface shadow-lift">
        <div className="flex items-center justify-between border-b border-line px-5 py-3">
          <div className="flex items-center gap-2 text-[13px] text-muted">
            <span className="size-2 rounded-full bg-moss" /> “I want to put up a 6-foot fence”
          </div>
          <span className="rounded-full bg-paper-2 px-2 py-0.5 font-mono text-[10.5px] tracking-wide text-faint uppercase">Example layout</span>
        </div>
        <div className="grid gap-px bg-line sm:grid-cols-[1.2fr_1fr]">
          <div className="space-y-5 bg-surface p-5">
            <div className="flex items-start gap-3 rounded-2xl bg-forest-soft p-4">
              <CheckCircle className="mt-0.5 shrink-0 text-forest" size={20} />
              <div className="w-full space-y-2">
                <p className="text-[14px] font-medium text-forest-deep">Do I need a permit?</p>
                <Bar w="90%" />
                <Bar w="65%" />
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-[11.5px] font-medium tracking-wider text-faint uppercase">Rules that apply</p>
              {["82%", "70%", "76%"].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-faint">0{i + 1}</span>
                  <div className="flex-1"><Bar w={w} /></div>
                  <span className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10.5px] text-forest">§ 170-xx</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5 bg-surface p-5">
            {["What you'll need", "Common mistakes", "Who to contact"].map((t, i) => (
              <div key={t} className="space-y-2">
                <p className="text-[11.5px] font-medium tracking-wider text-faint uppercase">{t}</p>
                <Bar w={["80%", "70%", "55%"][i]} />
                <Bar w={["60%", "50%", "40%"][i]} />
              </div>
            ))}
            <div className="flex items-center gap-2 rounded-xl border border-dashed border-line-strong px-3 py-2 text-[12.5px] text-muted">
              <Doc size={15} /> Sources link to eCode360
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
