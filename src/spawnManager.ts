import { roleHarvester } from "roles/harvester";
import { roleUpgrader } from "roles/upgrader";
import { roleBuilder } from "./roles/builder";

export class SpawnManager {

    private static maxHarvesters: number = 3;
    private static maxUpgraders: number = 2;
    private static maxBuilders: number = 1;

    private static roomCreeps: Creep[];
    private static energyAvailable: number;
    private static energyCap: number;

    private static harvesters: number;
    private static upgraders: number;
    private static builders: number;

    // Check if we can spawn another creep in this room and increase body size
    // according to available energy in the room
    public static spawnCreeps(spawn: StructureSpawn) {
        this.roomCreeps = spawn.room.find(FIND_MY_CREEPS);
        this.energyAvailable = spawn.room.energyAvailable;
        this.energyCap = spawn.room.energyCapacityAvailable;

        this.harvesters = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'harvester'
        }).length;
        this.upgraders = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'upgrader'
        }).length
        this.builders = spawn.room.find(FIND_MY_CREEPS, {
            filter: (c) => c.memory.role === 'builder'
        }).length;

        console.log(`Harvesters: ${this.harvesters}/${this.maxHarvesters} | Upgraders: ${this.upgraders}/${this.maxUpgraders} | Builders: ${this.builders}/${this.maxBuilders} | Energy: ${this.energyAvailable}/${this.energyCap}`);

        // Build the creep body
        let body: BodyPartConstant[] = [];
        let cost: number = 0;
        const bodyPart: BodyPartConstant[] = [WORK, CARRY, MOVE];
        const parts = Math.floor(this.energyCap / 200);
        for (let i = 0; i < parts; i++) {
            body = body.concat(bodyPart);
            cost += 200;
        }

        if (this.energyAvailable >= cost) {

            // Determine the role
            let role: string = '';
            if (this.harvesters < this.maxHarvesters) {
                role = 'harvester';
            } else if (this.upgraders < this.maxUpgraders) {
                role = 'upgrader';
            } else if (this.builders < this.maxBuilders) {
                role = 'builder';
            }

            if (role !== '') {
                spawn.room.visual.text('Spawning ' + role, spawn.pos.x, spawn.pos.y);
                console.log(spawn.spawnCreep(body, "creep_" + Game.time, { memory: { role: role, working: false } }));
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
