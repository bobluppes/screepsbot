export function roleBuilder(creep: Creep) {
    if (Game.time % 5 == 0) {
        creep.say(`🚧`);
    }

    if (creep.carry.energy === 0) {
        creep.memory.working = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = false;
    }

    if (creep.memory.working === true) {
        const target = creep.pos.findClosestByPath(FIND_SOURCES);
        if (target) {
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    } else if (creep.memory.working === false) {
        // @ts-ignore
        const targets: ConstructionSite[] = creep.room.find(FIND_CONSTRUCTION_SITES);

        // Fall back to controller if no empty structures
        let target = null;
        if (targets.length !== 0) {
            target = targets[0];
        }

        if (target) {
            if (creep.build(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    }

}
