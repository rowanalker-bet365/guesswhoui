'use client';

import React, { useEffect } from 'react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceUrl?: string | null;
}

const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose, serviceUrl }) => {
  const gameApiUrl = serviceUrl || '(not configured)';
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-brand px-6 py-4 text-white">
          <h2 className="text-xl font-bold">How to Play</h2>
          <button
            onClick={onClose}
            className="text-2xl font-bold leading-none text-white hover:opacity-75 focus:outline-none"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Section 1 — How to Play */}
          <section>
            <h3 className="mb-3 text-lg font-semibold text-brand">How to Play</h3>
            <p className="mb-4 text-gray-700">
              Your team must build a program (e.g. a CLI application or a simple script) to interact
              with the service API: {gameApiUrl}.
            </p>
            <p className="mb-3 text-gray-700">
              This is where the real challenge lies. Your program will need to:
            </p>
            <ol className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">1. Start a New Round:</span> Begin your session and get
                your <code className="rounded bg-gray-100 px-1 font-mono text-sm">sessionId</code>.
              </li>
              <li>
                <span className="font-bold">2. Fetch the Board:</span> Download the full list of
                candidate characters and their traits for the current round.
              </li>
              <li>
                <span className="font-bold">3. Ask Questions:</span> Ask questions about the hidden
                target&apos;s traits.
              </li>
              <li>
                <span className="font-bold">4. Handle Different Answers:</span> Some answers will be
                straightforward, while others may be encrypted or come from &quot;flaky&quot;
                endpoints.
              </li>
              <li>
                <span className="font-bold">5. Eliminate Candidates:</span> Use the answers you
                receive to narrow down the list of possible targets.
              </li>
              <li>
                <span className="font-bold">6. Submit Your Guess:</span> Once you believe you have
                identified the target, submit your guess. But be careful, get it wrong and you&apos;ll
                be in for a nasty surprise.
              </li>
              <li>
                <span className="font-bold">7. Solve the Board:</span> Can you decrypt the identity
                of all characters?
              </li>
              <li>
                <span className="font-bold">8. Optimise:</span> You can reset your board at any
                time. This will not affect your score, but will allow you to start fresh and perfect
                your program.
              </li>
              <li>
                <span className="font-bold">9. Brace Yourself:</span> Think you&apos;ve seen it all?
                Think again. As the competition heats up, the API may start throwing some extra
                curveballs your way that will put yourcrypto skills to the test. Stay sharp,
                and make sure your program can handle whatever gets thrown at it.
              </li>
            </ol>
          </section>

          {/* Section 2 — Milestones & Scoring */}
          <section className="mt-6 border-t pt-6">
            <h3 className="mb-3 text-lg font-semibold text-brand">Milestones &amp; Scoring</h3>
            <p className="mb-4 text-gray-700">
              Your team earns points for various achievements throughout the game.
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">Achieving Milestones:</span> Earn significant points for
                reaching key technical milestones; such as decrypting a character&apos;s identity, or
                handling an encrypted answer.
              </li>
              <li>
                <span className="font-bold">Correct Solves:</span> Earn points for each correct
                guess.
              </li>
              <li>
                <span className="font-bold">Bonuses:</span> Receive bonus points for solving rounds
                quickly and using a minimal number of questions.
              </li>
            </ul>
            <p className="mt-4 text-gray-700">
              Good luck, and may the best team win!
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export { HowToPlayModal };