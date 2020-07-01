export function roleHarvester(creep: Creep) {
    if (Game.time % 5 == 0) {
        creep.say(`🔨`);
    }

    if (creep.carry.energy === 0) {
        creep.memory.working = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = false;
    }

    if (creep.memory.working === true) {
        // let target: any = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
        //     filter: (s) => (s.structureType === STRUCTURE_EXTENSION) &&
        //         s.energy > 0
        // });
        let target: any = creep.pos.findClosestByRange(FIND_SOURCES);
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    } else if (creep.memory.working === false) {
        // @ts-ignore
        const targets: Structure[] = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (i) => (i.structureType === STRUCTURE_SPAWN || i.structureType === STRUCTURE_EXTENSION) &&
                i.energy < i.energyCapacity
        });

        // Fall back to controller if no empty structures
        let target: Structure;
        if (targets.length !== 0) {
            target = targets[0];
        } else {
            target = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (i) => (i.structureType === STRUCTURE_CONTROLLER)
            })[0];
        }

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    }

}
