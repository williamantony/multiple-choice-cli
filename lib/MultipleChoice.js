#!/usr/bin/env node

const keyCode = {
  up: '\x1b\x5b\x41',
  down: '\x1b\x5b\x42',
  right: '\x1b\x5b\x43',
  left: '\x1b\x5b\x44',

  enter: '\x0D',
  ctrlC: '\x03',
};

class MultipleChoice {
  constructor(options) {
    this.question = '';
    this.options = options;
    this.current = 0;
    this.selected = false;

    this.onSelect = () => {  };

    process.stdin.setRawMode(true);
    process.stdin.setEncoding('utf8');

    process.stdin.on('data', (key) => {
      switch (key) {
        case keyCode.up:
          this.moveUp();
          return;

        case keyCode.down:
          this.moveDown();
          return;

        case keyCode.enter:
          this.select();
          return;

        case keyCode.ctrlC:
          this.exit();
          return;

        default:
          return;
      }
    });
  }
}

module.exports = MultipleChoice;
