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
    "history | awk '{CMD[$2]++;count++}END { for (a in CMD)print CMD[a] \" \" CMD[a]/count*100 \"% \" a;}' | grep -v \"./\" | column -c3 -s \" \" -t | sort -nr | nl | head -n10 : List your top 10 most used commands."
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

  // 4. The Word Wrapper Function
  // Splits long text into an array of lines, breaking at spaces
  const wrapText = (text, maxChars) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = '';

    words.forEach(word => {
      if ((currentLine + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  // Wrap the tip at 75 characters max per line
  const wrappedLines = wrapText(safeTip, 75);

  // 5. Dynamic Height Calculation
  // Base height is 130px. Add 25px for every extra line of text.
  const lineHeight = 25;
  const svgHeight = 130 + (wrappedLines.length - 1) * lineHeight;

  // Generate the <text> XML for each line
  const tipTextElements = wrappedLines.map((line, index) => {
    return `<text x="25" y="${120 + (index * lineHeight)}" class="terminal-text tip">${line}</text>`;
  }).join('');

  // 6. The SVG Template
  const svg = `
  <svg width="850" height="${svgHeight}" viewBox="0 0 850 ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .terminal-text { font-family: 'Fira Code', 'Courier New', Courier, monospace; font-size: 18px; }
      .bg { fill: #282828; }
      .user { fill: #b8bb26; font-weight: bold; }
      .dir { fill: #83a598; font-weight: bold; }
      .arrow { fill: #fe8019; font-weight: bold;}
      .cmd { fill: #ebdbb2; }
      .tip { fill: #fabd2f; font-weight: bold; }
    </style>

    <rect width="850" height="${svgHeight}" rx="10" class="bg" />

    <circle cx="25" cy="25" r="7" fill="#cc241d" />
    <circle cx="50" cy="25" r="7" fill="#d79921" />
    <circle cx="75" cy="25" r="7" fill="#98971a" />

    <text x="25" y="80" class="terminal-text">
      <tspan class="user">ngochieu@nixos</tspan>
      <tspan class="cmd"> </tspan>
      <tspan class="dir">~</tspan>
      <tspan class="cmd"> </tspan>
      <tspan class="arrow">❯</tspan>
      <tspan class="cmd"> ./get_tip.zsh</tspan>
    </text>

    ${tipTextElements}
  </svg>
  `;

  // 7. The Cache Busters
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0, s-maxage=0, stale-while-revalidate');

  // 8. Send the image
  res.status(200).send(svg);
}
