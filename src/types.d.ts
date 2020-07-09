// example declaration file - remove these and add your own custom typings

// memory extension samples
interface CreepMemory {
  role: string;
  room: string;
  working: boolean;
  source: any;
  container: boolean;
}

interface Memory {
  uuid: number;
  log: any;
}

interface SpawnOptions {
  memory: any;
}

// `global` extension samples
declare namespace NodeJS {
  interface Global {
    log: any;
  }
}
