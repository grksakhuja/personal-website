import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TerminalLine {
  command: string;
  output: string[];
}

const terminalContent: TerminalLine[] = [
  {
    command: 'whoami',
    output: ['rohit.sakhuja'],
  },
  {
    command: 'cat skills.txt',
    output: ['Platform Engineering', 'Kubernetes | Terraform | GitOps'],
  },
  {
    command: 'uptime',
    output: ['10+ years in tech'],
  },
];

export default function TerminalAnimation() {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayedCommand, setDisplayedCommand] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    const currentLine = terminalContent[currentLineIndex];
    const command = currentLine.command;

    if (isTyping && displayedCommand.length < command.length) {
      const timeout = setTimeout(() => {
        setDisplayedCommand(command.slice(0, displayedCommand.length + 1));
      }, 80);
      return () => clearTimeout(timeout);
    }

    if (displayedCommand.length === command.length && !showOutput) {
      const timeout = setTimeout(() => {
        setShowOutput(true);
      }, 300);
      return () => clearTimeout(timeout);
    }

    if (showOutput) {
      const timeout = setTimeout(() => {
        // Move to next line
        const nextIndex = (currentLineIndex + 1) % terminalContent.length;
        setCurrentLineIndex(nextIndex);
        setDisplayedCommand('');
        setShowOutput(false);
        setIsTyping(true);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [displayedCommand, showOutput, currentLineIndex, isTyping]);

  return (
    <div className="w-full md:w-[400px] mx-auto">
      {/* Terminal Window */}
      <div className="rounded-lg overflow-hidden border border-[#2a2a2a] shadow-2xl">
        {/* Title Bar */}
        <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2 border-b border-[#2a2a2a]">
          {/* Traffic Lights */}
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca3f]" />
          </div>
          <span className="text-[#737373] text-sm ml-2 font-mono">iTerm2</span>
        </div>

        {/* Terminal Content - fixed height to prevent layout shift */}
        <div className="bg-[#0d0d0d] p-4 font-mono text-sm text-left h-[220px] overflow-hidden">
          {/* Previous completed lines */}
          {terminalContent.slice(0, currentLineIndex).map((line, idx) => (
            <div key={idx} className="mb-3">
              <div className="text-[#737373]">
                <span className="text-[#27ca3f]">$</span> <span className="text-[#00d4ff]">{line.command}</span>
              </div>
              {line.output.map((out, outIdx) => (
                <div key={outIdx} className="text-[#e5e5e5] ml-2">{out}</div>
              ))}
            </div>
          ))}

          {/* Current line being typed */}
          <div className="mb-3">
            <div className="text-[#737373]">
              <span className="text-[#27ca3f]">$</span>{' '}
              <span className="text-[#00d4ff]">{displayedCommand}</span>
              {!showOutput && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="inline-block w-2 h-4 bg-[#00d4ff] ml-0.5 align-middle"
                />
              )}
            </div>
            {showOutput && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {terminalContent[currentLineIndex].output.map((out, outIdx) => (
                  <div key={outIdx} className="text-[#e5e5e5] ml-2">{out}</div>
                ))}
              </motion.div>
            )}
          </div>

          {/* Blinking cursor on new line after output */}
          {showOutput && (
            <div className="text-[#737373]">
              <span className="text-[#27ca3f]">$</span>{' '}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="inline-block w-2 h-4 bg-[#00d4ff] ml-0.5 align-middle"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
