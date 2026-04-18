export default function handler(req, res) {
  // 1. Array of Bash/DevOps tips
  const tips = [
    { cmd: "ctrl + r", desc: "Reverse search your command history." },
    { cmd: "sudo !!", desc: "Run the previous command with sudo privileges." },
    { cmd: "^foo^bar", desc: "Replace 'foo' with 'bar' in the last command." },
    { cmd: "cd -", desc: "Go back to the previously working directory." },
    { cmd: "disown -a && exit", desc: "Keep background jobs running after logout." },
    { cmd: "python3 -m http.server", desc: "Start a quick web server on port 8000." },
    { cmd: "find . -type f -mmin -60", desc: "Find files modified in the last 60 minutes." },
    { cmd: "netstat -tulpn", desc: "Show listening ports and their associated PIDs." },
    { cmd: "git log --graph --oneline --all", desc: "View a compact, graphical representation of your git commit history." },
    { cmd: "docker system prune -a", desc: "Remove all unused Docker containers, networks, images, and volumes." },
    { cmd: "lsof -i :8080", desc: "Find out which process is listening on port 8080." },
    { cmd: "tar -xzvf file.tar.gz", desc: "Extract a gzipped tar archive with verbose output." },
    { cmd: "grep -rnw '/path' -e 'pattern'", desc: "Recursively search for a specific string inside files." },
    { cmd: "df -h", desc: "Display human-readable disk space usage for all mounted filesystems." },
    { cmd: "du -sh * | sort -hr", desc: "List sizes of files and folders in the current directory, sorted by largest." },
    { cmd: "tail -f /var/log/syslog", desc: "Follow a log file in real-time as new lines are added." },
    { cmd: "chmod +x script.sh", desc: "Make a script executable." },
    { cmd: "chown user:group file", desc: "Change the owner and group of a file." },
    { cmd: "ssh-copy-id user@host", desc: "Copy your SSH public key to a remote machine for passwordless login." },
    { cmd: "rsync -avz local/ remote:/path", desc: "Synchronize files securely and efficiently between local and remote." },
    { cmd: "ps aux | grep node", desc: "Find all running processes related to 'node'." },
    { cmd: "history | grep 'docker'", desc: "Search your command history for previously used docker commands." },
    { cmd: "sed -i 's/old/new/g' file.txt", desc: "Replace all occurrences of 'old' with 'new' inside a file directly." },
    { cmd: "awk '{print $1}' file.txt", desc: "Print only the first column of each line in a text file." },
    { cmd: "jq '.' file.json", desc: "Pretty-print and colorize a JSON file in the terminal." },
    { cmd: "kubectl get pods -A", desc: "List all pods across all namespaces in a Kubernetes cluster." }
  ];

  // 2. Pick a random tip
  const randomTip = tips[Math.floor(Math.random() * tips.length)];

  // 3. Escape special XML characters helper
  const escapeXml = (unsafe) => {
    return unsafe.replace(/&/g, '&amp;')
                 .replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;')
                 .replace(/'/g, '&apos;');
  };

  // 4. Gruvbox Syntax Highlighter
  const syntaxHighlight = (cmdStr) => {
    const tokens = cmdStr.split(' ');
    let expectCommand = true;

    return tokens.map(token => {
      let color = '#ebdbb2'; // Default foreground
      
      // Operators pipe/and reset the expectation for the next word to be a command
      if (token === '&&' || token === '|' || token === '||') {
        color = '#fe8019'; // Orange for operators
        expectCommand = true;
      } 
      else if (expectCommand) {
        color = '#b8bb26'; // Green for commands
        expectCommand = false;
        // If the command is sudo, the next word is the actual command
        if (token === 'sudo') expectCommand = true;
      } 
      else if (token.startsWith('-')) {
        color = '#8ec07c'; // Aqua for flags (e.g., -a, --oneline)
      } 
      else {
        color = '#d3869b'; // Purple for arguments, paths, and strings
      }

      return `<tspan fill="${color}">${escapeXml(token)}</tspan>`;
    }).join(' ');
  };

  // 5. Safely prepare texts and prefixes
  const safeDesc = escapeXml(randomTip.desc);
  
  const rawPrefix = `${randomTip.cmd} : `;
  // Apply syntax highlighting to the command part
  const highlightedPrefix = `${syntaxHighlight(randomTip.cmd)} <tspan fill="#a89984">:</tspan> `;

  // 6. Smart Word Wrapper Function
  const wrapTextWithPrefix = (prefix, text, maxChars) => {
    const words = text.split(' ');
    let lines = [];
    let currentLine = prefix;

    words.forEach(word => {
      // Use a rough estimate for visual length since SVG <text> doesn't auto-wrap
      if ((currentLine + word).length > maxChars) {
        lines.push(currentLine.trim());
        currentLine = '    ' + word + ' '; // Indent subsequent lines by 4 spaces
      } else {
        currentLine += word + ' ';
      }
    });
    lines.push(currentLine.trim());
    return lines;
  };

  // Wrap text maxing out at 75 characters
  const wrappedLines = wrapTextWithPrefix(rawPrefix, safeDesc, 75);

  // Inject the highlighted prefix ONLY into the first line
  wrappedLines[0] = wrappedLines[0].replace(rawPrefix, highlightedPrefix);

  // 7. Dynamic Height Calculation
  const lineHeight = 28; // Increased slightly to accommodate bold text breathing room
  const svgHeight = 130 + (wrappedLines.length - 1) * lineHeight;

  // Generate the <text> XML for each line
  const tipTextElements = wrappedLines.map((line, index) => {
    return `<text x="25" y="${120 + (index * lineHeight)}" class="terminal-text desc">${line}</text>`;
  }).join('');

  // 8. The SVG Template
  // Notice font-weight: bold is now applied globally to .terminal-text
  const svg = `
  <svg width="850" height="${svgHeight}" viewBox="0 0 850 ${svgHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <style>
      .terminal-text { 
        font-family: 'Fira Code', 'Courier New', Courier, monospace; 
        font-size: 18px; 
        font-weight: bold; 
      }
      .bg { fill: #282828; }
      .user { fill: #b8bb26; }
      .dir { fill: #83a598; }
      .arrow { fill: #fe8019; }
      .cmd { fill: #ebdbb2; }
      .desc { fill: #ebdbb2; } 
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

  // 9. Cache Busters & Response Header
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'no-cache, max-age=0, s-maxage=0, stale-while-revalidate');

  // 10. Send the image
  res.status(200).send(svg);
}
