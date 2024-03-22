export const getCommand = (cmd = 0x40, data = [], len = 0) => {
  const defaultData = new Uint8Array([0xff, len, cmd]);
  const command = [...defaultData, ...data];
  if (command.length < parseInt(len, 16)) {
    while (command.length < len - 1) {
      command.push(0);
    }
  }

  command.push(_calcChecksum(command, len));
  return command;
};

export const getStartCommand = (cmd = 0x40, data = [], len = 0) => {
  const defaultData = new Uint8Array([0xff, len, cmd, 0]);
  const command = [...defaultData, ...data];
  if (command.length < len) {
    while (command.length < len - 1) {
      command.push(0);
    }
  }

  command.push(_calcChecksum(command, len));
  return command;
};

export const setTeaAlarmCommand = (
  data = [],
  len = 0,
  hour = 0,
  minute = 0,
) => {
  const defaultData = new Uint8Array([0xff, len, 0x40, 2]);
  let command = [...defaultData, ...data];
  if (command.length < len - 2) {
    while (command.length < len - 4) {
      command.push(0);
    }
  }
  command = [...command, hour, minute];
  command.push(0);

  command.push(_calcChecksum(command, len));
  return command;
};

const _calcChecksum = (dat, len) => {
  let chksum = 0;
  for (let i = 0; i < len - 1; i++) {
    chksum += dat[i];
  }
  chksum = 0 - chksum;
  chksum ^= 0x3a;
  chksum = new Uint8Array([chksum])[0];
  return chksum;
};

export const bufferToHex = buffer => {
  var s = '',
    h = '0123456789ABCDEF';
  new Uint8Array(buffer).forEach(v => {
    s += h[v >> 4] + h[v & 15];
  });
  return s;
};
