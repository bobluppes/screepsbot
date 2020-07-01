export function roleMiner(creep: Creep) {
    if (Game.time % 5 == 0) {
        creep.say(`M`);
    }

    if (creep.carry.energy === 0) {
        creep.memory.working = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = false;
    }

    if (creep.memory.working === true) {
        const target = creep.pos.findClosestByPath(FIND_SOURCES, {
            filter: (s) => (s.id === creep.memory.source)
        });
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    } else if (creep.memory.working === false) {
        creep.drop(RESOURCE_ENERGY);
    }

}
