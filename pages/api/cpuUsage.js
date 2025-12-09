import os from 'os';

function snapshot() {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;
  for (const cpu of cpus) {
    const times = cpu.times;
    const t = times.user + times.nice + times.sys + times.idle + times.irq;
    idle += times.idle;
    total += t;
  }
  return { idle, total };
}

export default async function handler(req, res) {
  try {
    const s1 = snapshot();
    // short delay to measure delta
    await new Promise((r) => setTimeout(r, 150));
    const s2 = snapshot();

    const idleDelta = s2.idle - s1.idle;
    const totalDelta = s2.total - s1.total;

    if (totalDelta <= 0) {
      return res.status(200).json({ ok: true, usage: 0 });
    }

    const usage = (1 - idleDelta / totalDelta) * 100;
    return res.status(200).json({ ok: true, usage: Math.round(usage * 10) / 10 });
  } catch (err) {
    console.error('cpuUsage error', err);
    res.status(500).json({ ok: false, error: err.message });
  }
}
