export default function handler(req, res) {
  // 1. Your array of Bash/DevOps tips
  const tips = [
    "ctrl + r : Reverse search your command history.",
    "sudo !! : Run the last command as root.",
    "^foo^bar : Replace 'foo' with 'bar' in the last command.",
    "cd - : Go back to the previous directory.",
    "disown -a && exit : Keep background jobs running after logout.",
    "python3 -m http.server : Start a quick web server on port 8000.",
    "find . -type f -mmin -60 : Find files modified in the last hour.",
    "netstat -tulpn : Show listening ports and their PIDs.",
    "chmod 777 . : (Just kidding, please don't do this).",
    "history | awk '{CMD[$2]++;count++}END { for (a in CMD)print CMD[a] \" \" CMD[a]/count*100 \"% \" a;}' | grep -v \"./\" | column -c3 -s \" \" -t | sort -nr | nl |  head -n10 : List your top 10 most used commands."
  ];

  // 2. Pick a random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // 3. The SVG Template (Designed to look like a macOS/Linux terminal window)
  const svg = `
  <svg width="700" height="120" viewBox="0 0 700 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .terminal-text { font-family: 'Courier New', Courier, monospace; font-size: 15px; }
      .prompt { fill: #a9b7c6; }
      .tip { fill: #98c379; font-weight: bold; }
    </style>

    <rect width="700" height="120" rx="8" fill="#1e1e1e" />

    <circle cx="20" cy="20" r="6" fill="#ff5f56" />
    <circle cx="40" cy="20" r="6" fill="#ffbd2e" />
    <circle cx="60" cy="20" r="6" fill="#27c93f" />

    <text x="20" y="60" class="terminal-text prompt">sysadmin@github:~$ ./get_tip.sh</text>
    <text x="20" y="90" class="terminal-text tip">> ${randomTip}</text>
  </svg>
  `;

  // 4. The Cache Busters (CRITICAL for GitHub READMEs)
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0, s-maxage=0, stale-while-revalidate');

  // 5. Send the image
  res.status(200).send(svg);
}
