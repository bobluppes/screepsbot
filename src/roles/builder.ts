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

        let target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (i) => (i.structureType === STRUCTURE_CONTAINER) &&
                i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
        });

        if (!target) {
            target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: (i) => (i.structureType === STRUCTURE_EXTENSION) &&
                    i.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            })
        }

        if (target) {
            if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target.pos);
            }
        }
    } else if (creep.memory.working === false) {
        let site: boolean = true;
        let target: any = creep.room.find(FIND_CONSTRUCTION_SITES, {
            filter: (i) => (i.structureType === STRUCTURE_EXTENSION)
        })[0];

        if (!target) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => (i.hits < (i.hitsMax / 2)) && (i.structureType != STRUCTURE_WALL || i.hits < 100)
            });
            site = false;
        }

        if (!target) {
            target = creep.room.find(FIND_CONSTRUCTION_SITES)[0];
            site = true;
        }

        if (!target) {
            target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => (i.hits < i.hitsMax)
            });
            site = false;
        }

        if (target) {
            if (site) {
                // @ts-ignore
                if (creep.build(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target.pos);
                }
            } else {
                if (creep.repair(target) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target.pos);
                }
            }

        }
    }

}
