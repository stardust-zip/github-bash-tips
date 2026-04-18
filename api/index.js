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
    "history | awk '{CMD[$2]++;count++}END { for (a in CMD)print CMD[a] \" \" CMD[a]/count*100 \"% \" a;}' | head -n10 : List top 10 commands."
  ];

  // 2. Pick a random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // 3. Escape special XML characters
  const escapeXml = (unsafe) => {
    return unsafe.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
  };
  
  const safeTip = escapeXml(randomTip);

  // 4. The Gruvbox + Zsh SVG Template (Bigger & Beautiful)
  const svg = `
  <svg width="850" height="160" viewBox="0 0 850 160" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      /* Using a monospaced stack with slightly larger font */
      .terminal-text { font-family: 'Fira Code', 'Courier New', Courier, monospace; font-size: 18px; }
      
      /* Gruvbox Color Palette */
      .bg { fill: #282828; }          /* Background */
      .user { fill: #b8bb26; font-weight: bold; } /* Green */
      .dir { fill: #83a598; font-weight: bold; }  /* Blue */
      .arrow { fill: #fe8019; font-weight: bold;} /* Orange */
      .cmd { fill: #ebdbb2; }         /* Foreground/Text */
      .tip { fill: #fabd2f; font-weight: bold; }  /* Yellow */
    </style>

    <rect width="850" height="160" rx="10" class="bg" />

    <circle cx="25" cy="25" r="7" fill="#cc241d" /> <circle cx="50" cy="25" r="7" fill="#d79921" /> <circle cx="75" cy="25" r="7" fill="#98971a" /> <text x="25" y="80" class="terminal-text">
      <tspan class="user">ngochieu@nixos</tspan>
      <tspan class="cmd"> </tspan>
      <tspan class="dir">~</tspan>
      <tspan class="cmd"> </tspan>
      <tspan class="arrow">❯</tspan>
      <tspan class="cmd"> ./get_tip.zsh</tspan>
    </text>

    <text x="25" y="120" class="terminal-text tip">${safeTip}</text>
  </svg>
  `;

  // 5. The Cache Busters
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0, s-maxage=0, stale-while-revalidate');

  // 6. Send the image
  res.status(200).send(svg);
}
