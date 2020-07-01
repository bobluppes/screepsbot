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
        const target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => (s.structureType === STRUCTURE_EXTENSION) &&
                s.energy > 0
        });
        if (target) {
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    } else if (creep.memory.working === false) {
        // @ts-ignore
        // const targets: Structure[] = creep.room.find(FIND_MY_STRUCTURES, {
        //     filter: (i) => (i.structureType === STRUCTURE_SPAWN || i.structureType === STRUCTURE_EXTENSION) &&
        //         i.energy < i.energyCapacity
        // });

        // Fall back to controller if no empty structures
        let target: Structure;
        target = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (i) => (i.structureType === STRUCTURE_CONTROLLER)
        })[0];

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    }

}
