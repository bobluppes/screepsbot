export function roleHauler(creep: Creep) {
    if (Game.time % 5 == 0) {
        creep.say(`H`);
    }

    if (creep.carry.energy === 0) {
        creep.memory.working = true;
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.working = false;
    }

    if (creep.memory.working === true) {
        const target = creep.room.find(FIND_MY_CREEPS, {
            filter: (c) => (c.memory.source === creep.memory.source)
        });
        if (target) {
            let resource: any = target[0].pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: (r) => (r.resourceType === RESOURCE_ENERGY)
            });
            if (creep.pickup(resource) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target[0].pos);
            }
        }
    } else if (creep.memory.working === false) {
        // @ts-ignore
        const targets: Structure[] = creep.room.find(FIND_MY_STRUCTURES, {
            filter: (i) => (i.structureType === STRUCTURE_SPAWN || i.structureType === STRUCTURE_EXTENSION) &&
                i.energy < i.energyCapacity
        });

        // Fall back to containers if no empty structures
        let target: Structure;
        if (targets.length !== 0) {
            target = targets[0];
        } else {
            target = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => (i.structureType === STRUCTURE_CONTAINER) &&
                    i.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            })[0];
        }

        if (target) {
            if (creep.transfer(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    }

}
