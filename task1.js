const revertStrng = () => {
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    var inputStr = process.stdin.read();
    if (inputStr) {
      process.stdout.write(inputStr.split('').reverse().join('').concat('\n\n'));
    }
  });
}

revertStrng();