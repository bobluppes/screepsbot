import { roleHarvester } from "roles/harvester";
import { roleUpgrader } from "roles/upgrader";
import { roleBuilder } from "./roles/builder";
import { roleMiner } from "./roles/miner";
import { roleHauler } from "roles/hauler";
import { forEach } from "lodash";

export class SpawnManager {

    private static maxHarvesters: number = 3;
    private static maxUpgraders: number = 1;
    private static maxBuilders: number = 2;

    private static sources: Source[];
    private static roomCreeps: Creep[];
    private static energyAvailable: number;
    private static energyCap: number;

    private static harvesters: number;
    private static miners: Creep[];
    private static haulers: Creep[];
    private static upgraders: number;
    private static builders: number;

    // Check if we can spawn another creep in this room and increase body size
    // according to available energy in the room
    public static spawnCreeps(spawn: StructureSpawn) {
        this.roomCreeps = spawn.room.find(FIND_MY_CREEPS);
        this.energyAvailable = spawn.room.energyAvailable;
        this.energyCap = spawn.room.energyCapacityAvailable;

        this.sources = spawn.room.find(FIND_SOURCES);
        this.harvesters = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'harvester'
        }).length;
        this.miners = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'miner'
        });
        this.haulers = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'hauler'
        });
        this.upgraders = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'upgrader'
        }).length;
        this.builders = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'builder'
        }).length;

        console.log(`Harvesters: ${this.harvesters}/${this.maxHarvesters} | Miners: ${this.miners.length}/${this.sources.length} | Haulers: ${this.haulers.length}/${this.miners.length} | Upgraders: ${this.upgraders}/${this.maxUpgraders} | Builders: ${this.builders}/${this.maxBuilders} | Energy: ${this.energyAvailable}/${this.energyCap}`);

        // Determine the role
        let role: string = '';
        let sourceId: string = '';
        if (this.harvesters < this.maxHarvesters) {
            role = 'harvester';
        } else if (this.upgraders < this.maxUpgraders) {
            role = 'upgrader';
        } else if (this.builders < this.maxBuilders) {
            role = 'builder';
        } else if (this.miners.length < this.sources.length) {
            role = 'miner';
            let coveredSources: string[] = [];
            this.miners.forEach(miner => {
                coveredSources.push(miner.memory.source)
            });
            this.sources.forEach(el => {
                if (!coveredSources.includes(el.id)) {
                    sourceId = el.id;
                    // TODO: Break
                }
            });
        } else if (this.haulers.length < this.miners.length) {
            role = 'hauler';
            let coveredSources: string[] = [];
            this.haulers.forEach(hauler => {
                coveredSources.push(hauler.memory.source)
            });
            this.miners.forEach(miner => {
                if (!coveredSources.includes(miner.memory.source)) {
                    sourceId = miner.memory.source;
                    // TODO: Break
                }
            })
        }

        // Build the creep body
        let body: BodyPartConstant[];
        let cost: number;
        if (this.harvesters * this.miners.length * this.haulers.length * this.upgraders * this.builders === 0) {
            // No creeps => build a quick and cheap one
            body = [WORK, CARRY, MOVE];
            cost = 200;
        } else if (role === 'miner') {
            body = [MOVE, CARRY, WORK];
            cost = 200;
            const workCost = 100;
            for (let i = 0; (this.energyAvailable - cost) >= workCost; i++) {
                body.push(WORK);
                cost += workCost;
            }
        } else if (role === 'hauler') {
            body = [];
            cost = 0;
            const bodyPart: BodyPartConstant[] = [CARRY, MOVE];
            const parts = Math.floor(this.energyCap / 100);
            for (let i = 0; i < parts; i++) {
                body = body.concat(bodyPart);
                cost += 100;
            }
        } else {
            body = [];
            cost = 0;
            const bodyPart: BodyPartConstant[] = [WORK, CARRY, MOVE];
            const parts = Math.floor(this.energyCap / 200);
            for (let i = 0; i < parts; i++) {
                body = body.concat(bodyPart);
                cost += 200;
            }
        }

        console.log(`We need a ${role} with cost ${cost}`);

        if (this.energyAvailable >= cost) {
            if (role !== '') {
                spawn.room.visual.text('Spawning ' + role, spawn.pos.x, spawn.pos.y);
                spawn.spawnCreep(body, "creep_" + Game.time, { memory: { role: role, working: false, source: sourceId } });
            }
        }

        // this.assignRoles();
    }

    public static doJobs() {
        for (const creep of this.roomCreeps) {
            if (creep.memory.role === 'harvester') {
                roleHarvester(creep);
            } else if (creep.memory.role === 'upgrader') {
                roleUpgrader(creep);
            } else if (creep.memory.role === 'builder') {
                roleBuilder(creep);
            } else if (creep.memory.role === 'miner') {
                roleMiner(creep);
            } else if (creep.memory.role === 'hauler') {
                roleHauler(creep);
            }
        }
    }

    private static assignRoles() {
        for (const creep of this.roomCreeps) {
            if (creep.memory.role === '') {
                creep.memory.role = 'harvester';
            }
        }
    }
}
