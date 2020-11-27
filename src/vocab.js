export const vocab = {
  LED: 0,
  WRITE_DEFAULTS: 1,
  STATE: 2,
  SERVO_OFFSET: 10,
  SERVO_SEPARATION: 11,
  FAN_LEVEL: 12,
  FAN_MAX_LEVEL: 13,
  FAN_MAX_DURATION: 14,
  SQUEEZE_SLEEP: 15,
  NO_BUBBLE_THRESHOLD: 16,
  NO_BUBBLE_TIMEOUT: 17,
  SEND_UPDATES: 18,
  WATER_LEVEL: 19,
  BUBBLE_COUNT: 20,
  SQUEEZE_COUNT: 21,
  BLOW_COUNT: 22,
  BUBBLE_DISTANCE: 23,
  SQUEEZE: 24,
  BLOW: 25,
  TYPE: 40,
  ON_DURATION: 41,
  DUTY_CYCLE: 42,
  GLOBAL_DUTY_CYCLE: 43,
  INVERT_OUTPUT: 44,
  PERIOD: 45
}

export const vocabMap = {
  0: 'LED',
  1: 'WRITE_DEFAULTS',
  2: 'STATE',
  10: 'SERVO_OFFSET',
  11: 'SERVO_SEPARATION',
  12: 'FAN_LEVEL',
  13: 'FAN_MAX_LEVEL',
  14: 'FAN_MAX_DURATION',
  15: 'SQUEEZE_SLEEP',
  16: 'NO_BUBBLE_THRESHOLD',
  17: 'NO_BUBBLE_TIMEOUT',
  18: 'SEND_UPDATES',
  19: 'WATER_LEVEL',
  20: 'BUBBLE_COUNT',
  21: 'SQUEEZE_COUNT',
  22: 'BLOW_COUNT',
  23: 'BUBBLE_DISTANCE',
  24: 'SQUEEZE',
  25: 'BLOW',
  40: 'TYPE',
  41: 'ON_DURATION',
  42: 'DUTY_CYCLE',
  43: 'GLOBAL_DUTY_CYCLE',
  44: 'INVERT_OUTPUT',
  45: 'PERIOD'
}

export const vocabMeta = {
  LED: {
    count: 1,
    types: [
      'int'
    ],
    options: [
      {
        value: 0,
        text: 'OFFLINE'
      },
      {
        value: 1,
        text: 'ONLINE'
      },
      {
        value: 2,
        text: 'OFF'
      },
      {
        value: 500,
        text: 'ERROR'
      }
    ]
  },
  WRITE_DEFAULTS: {
    count: 0
  },
  STATE: {
    count: 0
  },
  SERVO_OFFSET: {
    count: 1,
    types: [
      'int'
    ]
  },
  SERVO_SEPARATION: {
    count: 1,
    types: [
      'int'
    ]
  },
  FAN_LEVEL: {
    count: 1,
    types: [
      'int'
    ]
  },
  FAN_MAX_LEVEL: {
    count: 1,
    types: [
      'int'
    ]
  },
  FAN_MAX_DURATION: {
    count: 1,
    types: [
      'int'
    ]
  },
  SQUEEZE_SLEEP: {
    count: 1,
    types: [
      'int'
    ]
  },
  NO_BUBBLE_THRESHOLD: {
    count: 1,
    types: [
      'int'
    ]
  },
  NO_BUBBLE_TIMEOUT: {
    count: 1,
    types: [
      'int'
    ]
  },
  SEND_UPDATES: {
    count: 1,
    types: [
      'int'
    ]
  },
  WATER_LEVEL: {
    count: 0
  },
  BUBBLE_COUNT: {
    count: 0
  },
  SQUEEZE_COUNT: {
    count: 0
  },
  BLOW_COUNT: {
    count: 0
  },
  BUBBLE_DISTANCE: {
    count: 0
  },
  SQUEEZE: {
    count: 0
  },
  BLOW: {
    count: 0
  },
  TYPE: {
    count: 1,
    types: [
      'int'
    ],
    options: [
      {
        value: 0,
        text: 'ONE_SHOT'
      },
      {
        value: 1,
        text: 'CONT'
      }
    ]
  },
  ON_DURATION: {
    count: 2,
    types: [
      'int',
      'int'
    ]
  },
  DUTY_CYCLE: {
    count: 1.5,
    types: [
      'float'
    ]
  },
  GLOBAL_DUTY_CYCLE: {
    count: 1,
    types: [
      'float'
    ]
  },
  INVERT_OUTPUT: {
    count: 1,
    types: [
      'int'
    ]
  },
  PERIOD: {
    count: 2,
    types: [
      'void',
      'int'
    ]
  }
}
