export const vocab = {
  LED: 0,
  WRITE_DEFAULTS: 1,
  DISCOVER: 2,
  SERVO_OFFSET: 10,
  SERVO_SEPARATION: 11,
  FAN_LEVEL: 12,
  FAN_MAX_LEVEL: 13,
  FAN_MAX_DURATION: 14,
  PRESSURE_SLEEP: 15,
  BLOW_SQUEEZE_DELAY: 16,
  WATER_LEVEL: 17,
  BUBBLE_COUNT: 18,
  SQUEEZE_COUNT: 19,
  PRESSURE: 20,
  SQUEEZE: 21,
  BLOW: 22,
  TYPE: 40,
  ON_DURATION: 41,
  DUTY_CYCLE: 42,
  GLOBAL_DUTY_CYCLE: 43,
  INVERT_OUTPUT: 44,
  PERIOD: 45
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
  DISCOVER: {
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
  PRESSURE_SLEEP: {
    count: 1,
    types: [
      'int'
    ]
  },
  BLOW_SQUEEZE_DELAY: {
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
  PRESSURE: {
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
        text: 'CONTINOUS'
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
    count: 1,
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
