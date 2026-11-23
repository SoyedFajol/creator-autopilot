export interface SubtitleCue {
  index: number;
  startTimeSec: number;
  endTimeSec: number;
  text: string;
}

export function formatSrtTimestamp(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const millis = Math.floor((seconds % 1) * 1000);

  const pad = (n: number, w: number = 2) => String(n).padStart(w, '0');
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(millis, 3)}`;
}

/**
 * Generates standard SRT subtitle file contents for YouTube Closed Captions.
 */
export function generateSrtContent(cues: SubtitleCue[]): string {
  return cues
    .map((cue) => {
      const start = formatSrtTimestamp(cue.startTimeSec);
      const end = formatSrtTimestamp(cue.endTimeSec);
      return `${cue.index}\n${start} --> ${end}\n${cue.text}\n`;
    })
    .join('\n');
}

/**
 * Creates subtitle cues from spoken section texts.
 */
export function buildCuesFromSections(
  sections: Array<{ spokenText: string; estimatedDurationSec: number }>
): SubtitleCue[] {
  const cues: SubtitleCue[] = [];
  let currentTime = 0;
  let cueIndex = 1;

  for (const sec of sections) {
    const sentences = sec.spokenText.split(/(?<=[.?!])\s+/).filter(Boolean);
    const durationPerSentence = sec.estimatedDurationSec / Math.max(1, sentences.length);

    for (const sentence of sentences) {
      const startTimeSec = currentTime;
      const endTimeSec = currentTime + durationPerSentence;

      cues.push({
        index: cueIndex++,
        startTimeSec,
        endTimeSec,
        text: sentence.trim(),
      });

      currentTime = endTimeSec;
    }
  }

  return cues;
}
