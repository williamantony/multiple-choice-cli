#!/usr/bin/env node

const Reset  = '\x1b[0m';
const HideCursor = '\x1b[?25l';
const ShowCursor = '\x1b[?25h';
const ClearLine = '\x1b[K';

const Bright = '\x1b[1m';
const Dim = '\x1b[2m';

const FgCyan = '\x1b[36m';
const FgYellow = '\x1b[33m';
const BgRed = '\x1b[41m';

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

  prompt(question) {
    this.question = question;

    return new Promise((resolve, reject) => {
      console.log(HideCursor);
      console.log(`${ FgCyan }${ Bright }${ question }`, Reset);

      this.renderOptions();

      process.stdin.resume();
      
      this.onSelect = () => {
        process.stdin.pause();
        resolve({
          selection: this.options[this.current],
          index: this.current,
          options: this.options,
        });
      };
    });
  }

  renderOptions() {
    this.options.forEach((option, index) => {
      const optionText = `${ option }`;
      if (index === this.current) {
        console.log(` ${ ClearLine }${ FgYellow }${ Bright }\u2714 ${ optionText }`, Reset);
      } else {
        console.log(` ${ ClearLine }${ Dim }\u2022 ${ optionText }`, Reset);
      }
    });
  }

  moveUp() {
    if (this.current > 0) {
      this.current--;
    }
    console.log(`\x1b[${ this.options.length + 1 }A`);
    this.renderOptions();
  }

  moveDown() {
    if (this.current < this.options.length - 1) {
      this.current++;
    }
    console.log(`\x1b[${ this.options.length + 1 }A`);
    this.renderOptions();
  }

  select() {
    const selectedOption = this.options[this.current];
    
    const consoleClear = `\x1b[${ this.options.length }A\x1b[0J`;
    const consolePrompt = `${ Dim }${ Bright }>${ Reset }`;
    const consoleAnswer = `${ FgYellow }${ Bright }${ selectedOption }${ Reset }`;

    console.log(`${ consoleClear }${ consolePrompt } ${ consoleAnswer }\n`, ShowCursor);
    
    this.selected = true;
    this.onSelect();
  }

  exit() {
    const consoleClear = `\x1b[${ this.options.length }A\x1b[0J`;
    const consolePrompt = `${ Dim }${ Bright }>${ Reset }`;
    const consoleAnswer = `${ Dim }None Selected${ Reset }`;

    console.log(`${ consoleClear }${ consolePrompt } ${ consoleAnswer }`, ShowCursor);
    console.log(`\n${ BgRed } EXITED ${ Reset }`);

    process.exit();
  }
}

module.exports = MultipleChoice;
