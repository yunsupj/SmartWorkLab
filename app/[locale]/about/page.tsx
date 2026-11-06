import { Github, Linkedin, Mail } from 'lucide-react';

export const metadata = {
  title: 'About | SmartWorkLab',
  description:
    'SmartWorkLab is an engineering research blog: applied AI, robotics, and engineering — documented with measured results.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#F7F7F4] text-[#1C2321]">
      <div className="max-w-3xl mx-auto px-6 pt-16 md:pt-20 pb-24">
        <header className="border-b border-[#E4E7E2] pb-10 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">About</h1>
          <p className="text-lg text-[#66716C] leading-relaxed">
            SmartWorkLab is an engineering research blog. It documents real work in
            applied AI, robotics, and infrastructure — experiments, implementations,
            failures, and lessons learned — with measured results, not claims.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">How articles are made</h2>
          <p className="text-base text-[#66716C] leading-relaxed mb-4">
            Every project on this site follows the same loop:
          </p>
          <ol className="list-none space-y-3">
            {[
              ['Learn', 'Study the concept properly before building — the math, the mechanism, the prior work.'],
              ['Experiment', 'Run a small, controlled experiment. Change one variable at a time.'],
              ['Build', 'Implement it. Keep the code open where possible.'],
              ['Evaluate', 'Measure against a stated baseline, with the test setup written down.'],
              ['Publish', 'Write up what happened — including what failed.'],
            ].map(([step, desc]) => (
              <li key={step} className="flex gap-4 rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-4">
                <span className="font-mono font-bold text-[#4C6B59] whitespace-nowrap w-24 shrink-0">{step}</span>
                <span className="text-[#66716C] leading-relaxed">{desc}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">Featured project: Mochi Sprout</h2>
          <p className="text-base text-[#66716C] leading-relaxed mb-4">
            Mochi Sprout is an open-source Physical AI project: a small companion robot
            that grows — in behavior, not just in code — built in public from a MuJoCo
            simulation to hardware. Day 1 is done: a pendulum experiment measuring how
            gravity changes the motion. No walking, no controller, no hardware yet.
          </p>
          <a
            href="https://github.com/yunsupj/mochi-sprout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-bold text-[#4C6B59] hover:underline underline-offset-4"
          >
            github.com/yunsupj/mochi-sprout →
          </a>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-bold mb-4 tracking-tight">About the author</h2>
          <div className="rounded-xl border border-[#E4E7E2] bg-[#FFFFFF] p-6 flex flex-col sm:flex-row gap-6">
            <div className="w-20 h-20 shrink-0 bg-[#EFF0EB] rounded-full flex items-center justify-center text-2xl font-bold text-[#4C6B59]">
              YJ
            </div>
            <div>
              <h3 className="text-lg font-bold">Yunsup Jung</h3>
              <p className="text-sm text-[#66716C] leading-relaxed mt-1 mb-4">
                Senior ML engineer (Hulu, HBO Max, Nike, Meta, CloudBees). Now building
                open-source Physical AI and writing about what actually happens along
                the way.
              </p>
              <div className="flex gap-3">
                <a
                  href="https://github.com/yunsupj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/yunsupjung/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="mailto:info@yuunchloe.com"
                  className="p-2 bg-[#F7F7F4] border border-[#E4E7E2] rounded-full hover:border-[#4C6B59] text-[#66716C] hover:text-[#4C6B59] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-sm text-[#8A938E] mt-4">
            SmartWorkLab is run by Yunsup Jung and Chloe Kim.
          </p>
        </section>
      </div>
    </div>
  );
}
